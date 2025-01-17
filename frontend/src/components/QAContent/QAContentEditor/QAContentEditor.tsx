import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // For routing and getting URL params

interface QASection {
  id: string;
  question: string;
  answers: Answer[];
}

interface Answer {
  id: string;
  answer: string;
  childQuestion?: QASection;
  solution?: string;
}

const QAContentEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Extract 'id' from URL
  console.log("contentId", id);

  const [contentName, setContentName] = useState<string>("");
  const [qaSections, setQASections] = useState<QASection[]>([
    {
      id: "1",
      question: "Sample Question?",
      answers: [
        {
          id: "1-1",
          answer: "Sample Answer",
        },
      ],
    },
  ]);

  const [languages, setLanguages] = useState<
    { id: number; name: string; code: string | null }[]
  >([]);
  const [language, setLanguage] = useState<number>(1); // Default to first language ID
  const [selectedLanguageId, setSelectedLanguageId] = useState<number>(1);

  // Fetch languages on component load
  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (selectedLanguageId) {
      setLanguage(selectedLanguageId);
    }
  }, [selectedLanguageId]);

  console.log("selectedLanguageId", selectedLanguageId, language);

  // Fetch Languages through Api
  const fetchLanguages = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/languages", {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: "Basic " + btoa(`admin@test.com:admin123`),
        },
      });
      const data = await response.json();
      setLanguages(data); // Store languages

      //   // Set language for create mode
      //   if (!id) {
      //     setLanguage(data[0]?.id || 1); // Default to the first language
      //   }

      // Respect selectedLanguage or fallback to the first language
      setLanguage(selectedLanguageId || data[0]?.id || 1);
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  // Fetch content when the component loads or when 'id' changes
  useEffect(() => {
    if (id) {
      fetchContentById(id);
    }
  }, [id]);

  const fetchContentById = async (contentId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v2/content?contentId=${contentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: "Basic " + btoa(`admin@test.com:admin123`),
          },
        }
      );
      const data = await response.json();
      const parsedData = parseApiResponse(data);
      setQASections(parsedData);

      // Set the content name
      setContentName(data?.name || ""); // Use default value if name is not found
      setSelectedLanguageId(data?.languageId || "");
      console.log("selectedLanguageId", selectedLanguageId);
    } catch (error) {
      console.error("Error fetching Q/A data:", error);
    }
  };

  const parseApiResponse = (response: any): QASection[] => {
    const parseQuestions = (data: any): QASection => {
      return {
        id: `${data.id || Date.now()}-${Math.random()}`, // Generate a unique ID
        question: data.question || "",
        answers: (data.answers || []).map((answer: any) => ({
          id: `${Math.random()}`, // Generate a unique ID
          answer: answer.answer || "",
          childQuestion: answer.questions
            ? parseQuestions(answer.questions)
            : undefined,
          solution: answer.solution || undefined,
        })),
      };
    };

    return response?.content?.questionare?.questions
      ? [parseQuestions(response.content.questionare.questions)]
      : [];
  };

  // Function to handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(Number(e.target.value));
  };

  // Function to handle adding a new answer
  // Recursive function to handle adding a new answer
  const handleAddAnswer = (questionId: string) => {
    const addAnswerRecursively = (sections: QASection[]): QASection[] =>
      sections.map((section) => {
        if (section.id === questionId) {
          // Skip if any answer already has a solution
          if (section.answers.some((ans) => ans.solution)) return section;
          return {
            ...section,
            answers: [
              ...section.answers,
              { id: `${section.id}-${section.answers.length + 1}`, answer: "" },
            ],
          };
        }
        return {
          ...section,
          answers: section.answers.map((answer) => ({
            ...answer,
            childQuestion: answer.childQuestion
              ? addAnswerRecursively([answer.childQuestion])[0]
              : undefined,
          })),
        };
      });
    setQASections((prev) => addAnswerRecursively(prev));
  };

  // Function to handle adding a new solution
  const handleAddSolution = (answerId: string) => {
    const addSolutionRecursively = (sections: QASection[]): QASection[] =>
      sections.map((section) => ({
        ...section,
        answers: section.answers.map((ans) =>
          ans.id === answerId
            ? { ...ans, solution: "" } // Initialize solution field
            : {
                ...ans,
                childQuestion: ans.childQuestion
                  ? addSolutionRecursively([ans.childQuestion])[0]
                  : undefined,
              }
        ),
      }));

    setQASections((prev) => addSolutionRecursively(prev));
  };

  // Function to handle adding a new question
  // Recursive function to handle adding a new question
  const handleAddQuestion = (answerId: string) => {
    const addQuestionRecursively = (sections: QASection[]): QASection[] =>
      sections.map((section) => ({
        ...section,
        answers: section.answers.map((ans) => {
          // Prevent adding a question if solution exists
          if (ans.id === answerId && !ans.solution) {
            return {
              ...ans,
              childQuestion: ans.childQuestion || {
                id: `${ans.id}-child`,
                question: "",
                answers: [],
              },
            };
          }
          return {
            ...ans,
            childQuestion: ans.childQuestion
              ? addQuestionRecursively([ans.childQuestion])[0]
              : undefined,
          };
        }),
      }));
    setQASections((prev) => addQuestionRecursively(prev));
  };

  // Recursive delete for answers and questions
  const handleDeleteAnswer = (questionId: string, answerId: string) => {
    const deleteAnswerRecursively = (sections: QASection[]): QASection[] =>
      sections.map((section) => {
        if (section.id === questionId) {
          return {
            ...section,
            answers: section.answers.filter((ans) => ans.id !== answerId),
          };
        }
        return {
          ...section,
          answers: section.answers.map((ans) =>
            ans.childQuestion
              ? {
                  ...ans,
                  childQuestion: {
                    ...ans.childQuestion,
                    answers: deleteAnswerRecursively([ans.childQuestion])[0]
                      .answers,
                  },
                }
              : ans
          ),
        };
      });
    setQASections((prev) => deleteAnswerRecursively(prev));
  };

  // Recursive delete for questions and answers
  const handleDeleteQuestion = (answerId: string) => {
    const deleteQuestionRecursively = (sections: QASection[]): QASection[] => {
      return sections.map((section) => ({
        ...section,
        answers: section.answers.map((ans) => {
          if (ans.id === answerId) {
            return { ...ans, childQuestion: undefined }; // Remove the child question
          }
          // If there's a nested child question, process it recursively
          if (ans.childQuestion) {
            return {
              ...ans,
              childQuestion: {
                ...ans.childQuestion,
                answers: deleteQuestionRecursively([ans.childQuestion])[0]
                  .answers,
              },
            };
          }
          return ans;
        }),
      }));
    };

    setQASections((prev) => deleteQuestionRecursively(prev));
  };

  // Delete for solution
  const handleDeleteSolution = (answerId: string) => {
    const deleteSolutionRecursively = (sections: QASection[]): QASection[] =>
      sections.map((section) => {
        return {
          ...section,
          answers: section.answers.map((ans) => {
            if (ans.id === answerId) {
              return { ...ans, solution: undefined }; // Remove solution
            }
            if (ans.childQuestion) {
              return {
                ...ans,
                childQuestion: {
                  ...ans.childQuestion,
                  answers: deleteSolutionRecursively([ans.childQuestion])[0]
                    .answers,
                },
              };
            }
            return ans;
          }),
        };
      });

    setQASections((prev) => deleteSolutionRecursively(prev));
  };

  // Recursive function to handle changes to question and answer fields
  const handleInputChange = (
    id: string,
    field: "question" | "answer" | "solution",
    value: string
  ) => {
    const updateRecursively = (sections: QASection[]): QASection[] =>
      sections.map((section) => {
        if (section.id === id && field === "question") {
          return { ...section, question: value };
        }

        return {
          ...section,
          answers: section.answers.map((ans) => {
            if (ans.id === id && field === "answer") {
              return { ...ans, answer: value };
            }

            if (ans.id === id && field === "solution") {
              return { ...ans, solution: value };
            }

            if (ans.childQuestion) {
              return {
                ...ans,
                childQuestion: {
                  ...ans.childQuestion,
                  ...updateRecursively([ans.childQuestion])[0],
                },
              };
            }
            return ans;
          }),
        };
      });

    setQASections((prev) => updateRecursively(prev));
  };

  // Recursive function to map the current state to the API format
  const mapToApiFormat = (sections: QASection[]): any => {
    return sections.map((section) => ({
      question: section.question,
      answers:
        section.answers.length > 0
          ? section.answers.map((ans) => ({
              answer: ans.answer,
              solution: ans.solution || null,
              questions: ans.childQuestion
                ? mapToApiFormat([ans.childQuestion])
                : null,
            }))
          : null,
    }))[0]; // Assuming there's only one root question for the questionare
  };

  // Function to copy and assign new IDs recursively
  const deepCopyWithNewIds = (sections: QASection[]): QASection[] => {
    return sections.map((section) => ({
      ...section,
      id: `${section.id}-copy-${Date.now()}`,
      question: `${section.question} (Copied)`,
      answers: section.answers.map((answer) => ({
        ...answer,
        id: `${answer.id}-copy-${Date.now()}`,
        childQuestion: answer.childQuestion
          ? deepCopyWithNewIds([answer.childQuestion])[0]
          : undefined,
      })),
    }));
  };

  // Handle Copy Button Click
  const handleCopyAll = async () => {
    if (!contentName) {
      alert("Content name not available.");
      return;
    }

    const copiedSections = deepCopyWithNewIds(qaSections);
    console.log("copiedSections", copiedSections, contentName);

    const dataToSubmit = {
      language,
      questionare: { questions: copiedSections },
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/v2/content/copy?srcContentId=${id}&&name=${encodeURIComponent(
          contentName
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: "Basic " + btoa(`admin@test.com:admin123`),
          },
          body: JSON.stringify(dataToSubmit),
        }
      );

      if (response.ok) {
        alert("Content copied and saved successfully!");
        setQASections(copiedSections);
      } else {
        alert("Failed to copy content.");
      }
    } catch (error) {
      console.error("Error copying content:", error);
      alert("An error occurred while copying content.");
    }
  };

  const validateFields = (): string | null => {
    if (!contentName.trim()) {
      return "Content name is required.";
    }

    if (!language) {
      return "Please select a language.";
    }

    if (!qaSections.length) {
      return "At least one question is required.";
    }

    for (const section of qaSections) {
      if (!section.question.trim()) {
        return "All questions must have a valid text.";
      }

      for (const answer of section.answers) {
        if (!answer.answer.trim()) {
          return "All answers must have a valid text.";
        }

        if (answer.solution !== undefined && !answer.solution.trim()) {
          return "All solutions must have a valid text.";
        }

        if (answer.childQuestion) {
          const childValidationError = validateChildSections([
            answer.childQuestion,
          ]);
          if (childValidationError) {
            return childValidationError;
          }
        }
      }
    }

    return null;
  };

  const validateChildSections = (sections: QASection[]): string | null => {
    for (const section of sections) {
      if (!section.question.trim()) {
        return "All child questions must have valid text.";
      }

      for (const answer of section.answers) {
        if (!answer.answer.trim()) {
          return "All child answers must have valid text.";
        }

        if (answer.solution !== undefined && !answer.solution.trim()) {
          return "All child solutions must have valid text.";
        }

        if (answer.childQuestion) {
          const error = validateChildSections([answer.childQuestion]);
          if (error) {
            return error;
          }
        }
      }
    }
    return null;
  };

  //Handle submit button click
  // const handleSubmit = () => {
  //   const validationError = validateFields();

  //   if (validationError) {
  //     alert(validationError);
  //     return;
  //   }

  //   const dataToSubmit = {
  //     language,
  //     questionare: {
  //       questions: mapToApiFormat(qaSections), // Transform state to API format
  //     },
  //   };

  //   console.log("Submitting Q/A Data:", dataToSubmit);

  //   if (id) {
  //     // Update API call
  //     fetch(
  //       `http://localhost:8080/api/v2/content?contentId=${id}&name=${encodeURIComponent(
  //         contentName
  //       )}`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "Access-Control-Allow-Origin": "*",
  //           Authorization: "Basic " + btoa(`admin@test.com:admin123`),
  //         },
  //         body: JSON.stringify(dataToSubmit),
  //       }
  //     )
  //       .then((response) => {
  //         if (response.ok) {
  //           alert("Q/A data updated successfully!");
  //           navigate("/"); // Navigate back to the listing page
  //         } else {
  //           alert("Failed to update Q/A data.");
  //         }
  //       })
  //       .catch((error) => console.error("Error updating Q/A data:", error));
  //   }
  //   else {
  //     // Create API call
  //     fetch(
  //       `http://localhost:8080/api/v2/content?languageId=${language}&name=${encodeURIComponent(
  //         contentName
  //       )}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "Access-Control-Allow-Origin": "*",
  //           Authorization: "Basic " + btoa(`admin@test.com:admin123`),
  //         },
  //         body: JSON.stringify(dataToSubmit),
  //       }
  //     )
  //       .then((response) => {
  //         if (response.ok) {
  //           alert("Q/A data created successfully!");
  //           navigate("/"); // Navigate back to the listing page
  //         } else {
  //           alert("Failed to create Q/A data.");
  //         }
  //       })
  //       .catch((error) => console.error("Error creating Q/A data:", error));
  //   }
  // };

  // const handleSubmit = async () => {
  //   const validationError = validateFields();
  //   if (validationError) {
  //     alert(validationError);
  //     return;
  //   }

  //   // Fetch the latest contents to validate uniqueness
  //   try {
  //     const response = await fetch("http://localhost:8080/api/v2/contents", {
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Access-Control-Allow-Origin": "*",
  //         Authorization: "Basic " + btoa(`admin@test.com:admin123`),
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch contents: ${response.statusText}`);
  //     }

  //     const contents = await response.json();

  //     // Check for duplicate name and language
  //     const isDuplicate = contents.some(
  //       (content: { id: string; name: string; language: string }) =>
  //         content.name.trim().toLowerCase() ===
  //           contentName.trim().toLowerCase() &&
  //         content.language === String(language) &&
  //         (!id || content.id !== id) // Allow updates for the same entry
  //     );

  //     if (isDuplicate) {
  //       alert(
  //         "A content with the same name and language already exists. Please try with a different name or language."
  //       );
  //       return;
  //     }
  //   } catch (error: any) {
  //     console.error("Error fetching contents for validation:", error.message);
  //     alert("Failed to validate uniqueness. Please try again later.");
  //     return;
  //   }

  //   const dataToSubmit = {
  //     language,
  //     questionare: {
  //       questions: mapToApiFormat(qaSections), // Transform state to API format
  //     },
  //   };

  //   console.log("Submitting Q/A Data:", dataToSubmit);

  //   if (id) {
  //     // Update API call
  //     fetch(
  //       `http://localhost:8080/api/v2/content?contentId=${id}&name=${encodeURIComponent(
  //         contentName
  //       )}`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "Access-Control-Allow-Origin": "*",
  //           Authorization: "Basic " + btoa(`admin@test.com:admin123`),
  //         },
  //         body: JSON.stringify(dataToSubmit),
  //       }
  //     )
  //       .then((response) => {
  //         if (response.ok) {
  //           alert("Q/A data updated successfully!");
  //           navigate("/"); // Navigate back to the listing page
  //         } else {
  //           alert("Failed to update Q/A data.");
  //         }
  //       })
  //       .catch((error) => console.error("Error updating Q/A data:", error));
  //   } else {
  //     // Create API call
  //     fetch(
  //       `http://localhost:8080/api/v2/content?languageId=${language}&name=${encodeURIComponent(
  //         contentName
  //       )}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "Access-Control-Allow-Origin": "*",
  //           Authorization: "Basic " + btoa(`admin@test.com:admin123`),
  //         },
  //         body: JSON.stringify(dataToSubmit),
  //       }
  //     )
  //       .then((response) => {
  //         if (response.ok) {
  //           alert("Q/A data created successfully!");
  //           navigate("/"); // Navigate back to the listing page
  //         } else {
  //           alert("Failed to create Q/A data.");
  //         }
  //       })
  //       .catch((error) => console.error("Error creating Q/A data:", error));
  //   }
  // };

  const handleSubmit = async () => {
    const validationError = validateFields();
    if (validationError) {
      alert(validationError);
      return;
    }

    const dataToSubmit = {
      language,
      questionare: {
        questions: mapToApiFormat(qaSections), // Transform state to API format
      },
    };

    console.log("Submitting Q/A Data:", dataToSubmit);

    try {
      let response;

      if (id) {
        // Update API call
        response = await fetch(
          `http://localhost:8080/api/v2/content?contentId=${id}&name=${encodeURIComponent(
            contentName
          )}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Authorization: "Basic " + btoa(`admin@test.com:admin123`),
            },
            body: JSON.stringify(dataToSubmit),
          }
        );
      } else {
        // Create API call
        response = await fetch(
          `http://localhost:8080/api/v2/content?languageId=${language}&name=${encodeURIComponent(
            contentName
          )}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Authorization: "Basic " + btoa(`admin@test.com:admin123`),
            },
            body: JSON.stringify(dataToSubmit),
          }
        );
      }

      const responseData = await response.json();

      if (response.ok) {
        alert(
          id
            ? "Q/A data updated successfully!"
            : "Q/A data created successfully!"
        );
        navigate("/"); // Navigate back to the listing page
      } else {
        // Handle specific error responses from the API
        if (response.status === 409) {
          alert(responseData.message);
        } else {
          alert(
            `Failed to ${id ? "update" : "create"} Q/A data: ${
              responseData.message || "Unknown error"
            }`
          );
        }
      }
    } catch (error) {
      console.error("Error in submission:", error);
      alert(`Failed to ${id ? "update" : "create"} Q/A data: Network error`);
    }
  };

  // Recursive component for rendering nested sections
  const renderSection = (section: QASection) => {
    return (
      <div
        key={section.id}
        className="border border-gray-800 p-4 mb-4 rounded-lg"
      >
        <h2 className="text-lg font-medium">Question</h2>
        <textarea
          value={section.question}
          onChange={(e) =>
            handleInputChange(section.id, "question", e.target.value)
          }
          className="w-full border p-2 mb-2 rounded-lg"
          // className={`w-full border p-2 mb-2 rounded-lg ${
          //   !section.question.trim() ? "border-red-500" : "border-gray-300"
          // }`}
          placeholder="Enter question"
        />
        {/* {!section.question.trim() && (
          <p className="text-red-500">This question is required.</p>
        )} */}
        {section.answers.map((answer) => (
          <div
            key={answer.id}
            className="ml-4 border-l border-gray-800 pl-4 mb-2"
          >
            <h3 className="text-md font-medium">Answer</h3>
            <textarea
              value={answer.answer}
              onChange={(e) =>
                handleInputChange(answer.id, "answer", e.target.value)
              }
              className="w-full border p-2 mb-2 rounded-lg"
              placeholder="Enter answer"
            />
            {answer.solution !== undefined && (
              <div>
                <h3 className="text-md font-medium">Solution</h3>
                <textarea
                  value={answer.solution || ""}
                  onChange={(e) =>
                    handleInputChange(answer.id, "solution", e.target.value)
                  }
                  className="w-full border p-2 mb-2 rounded-lg"
                  placeholder="Enter solution"
                />
              </div>
            )}
            <div className="flex gap-4 items-center mb-2">
              <button
                onClick={() => handleAddQuestion(answer.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                disabled={!!answer.solution}
              >
                + Add Question
              </button>
              <button
                onClick={() => handleDeleteAnswer(section.id, answer.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Delete Answer
              </button>
              {answer.childQuestion && (
                <button
                  onClick={() => handleDeleteQuestion(answer.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Delete Question
                </button>
              )}
              {answer.solution !== undefined && (
                <button
                  onClick={() => handleDeleteSolution(answer.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Delete Solution
                </button>
              )}
              <button
                onClick={() => handleAddSolution(answer.id)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                disabled={!!answer.solution}
              >
                Add Solution
              </button>
            </div>
            {answer.childQuestion && !answer.solution && (
              <div className="ml-4">{renderSection(answer.childQuestion)}</div>
            )}
          </div>
        ))}
        <button
          onClick={() => handleAddAnswer(section.id)}
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg"
          disabled={section.answers.some((ans) => ans.solution)}
        >
          + Add Answer
        </button>
      </div>
    );
  };

  return (
    <div className="p-4">
      {/* Display Content Name */}
      <h1 className="text-2xl font-bold mb-4">
        <input
          type="text"
          value={contentName}
          onChange={(e) => setContentName(e.target.value)}
          // className={`border p-2 rounded-lg w-full ${
          //   !contentName.trim() ? "border-red-500" : "border-gray-300"
          // }`}
          className="border p-2 rounded-lg w-full"
          placeholder="Enter Q/A Content Title"
        />
        {/* {!contentName.trim() && <p className="text-red-500">Content name is required.</p>} */}
      </h1>

      <div className="mb-4 flex justify-between">
        {/* Language Dropdown */}
        <div className="mb-4">
          {id ? (
            // Edit Mode: Display selected language name as a label
            <div>
              <label className="text-lg font-medium">Language: </label>
              {languages.find((lang) => lang.id === selectedLanguageId)?.name ||
                "Unknown Language"}
            </div>
          ) : (
            // Create Mode: Display dropdown for language selection
            <div>
              <label htmlFor="language" className="mr-2 text-lg font-medium">
                Select Language:
              </label>
              <select
                id="language"
                value={language}
                onChange={handleLanguageChange}
                className="border px-4 py-2 rounded-lg"
              >
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        {/* Copy Button at the Top */}
        {/* <button
          onClick={handleCopyAll}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Copy All
        </button> */}
      </div>
      {qaSections.map(renderSection)}
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 mt-4 rounded-lg"
      >
        {id ? "Update" : "Create"}
      </button>
    </div>
  );
};

export default QAContentEditor;
