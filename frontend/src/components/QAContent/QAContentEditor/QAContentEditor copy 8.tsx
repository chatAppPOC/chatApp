import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // For routing and getting URL params

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

  // const [language, setLanguage] = useState<string>("en"); // Default language: English
  // const [languages, setLanguages] = useState<string[]>(["en", "es", "fr"]); // Example languages
  const [language, setLanguage] = useState("en"); // Default language: English

  // Languages for the dropdown
  const languages = [
    { code: "en", label: "English" },
    { code: "fr", label: "French" },
    { code: "es", label: "Spanish" },
    { code: "de", label: "German" },
    { code: "it", label: "Italian" },
  ];

  // Fetch content when the component loads or when the language changes
  useEffect(() => {
    fetchContentByLanguage(language);
  }, [language]);

  //   // Function to fetch content based on selected language
  const fetchContentByLanguage = async (languageId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v2/content?languageId=${languageId}`
      );
      const data = await response.json();

      // Map API response to QASection format
      const mapApiToQASection = (apiData: any): QASection => ({
        id: `${Date.now()}-${Math.random()}`, // Unique ID for frontend tracking
        question: apiData.question,
        answers: apiData.answers.map((ans: any) => ({
          id: `${Date.now()}-${Math.random()}`,
          answer: ans.answer,
          ...(ans.questions
            ? { childQuestion: mapApiToQASection(ans.questions) }
            : {}),
          ...(ans.solution ? { solution: ans.solution } : {}),
        })),
      });

      setQASections([mapApiToQASection(data.questionare.questions)]);
    } catch (error) {
      console.error("Error fetching content:", error);
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
        `http://localhost:8080/api/v2/content?contentId=${contentId}`
      );
      const data = await response.json();
      const parsedData = parseApiResponse(data);
      setQASections(parsedData);

      // Set the content name
      setContentName(data?.name || ""); // Use default value if name is not found
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

  //   useEffect(() => {
  //     fetch(`http://localhost:8080/api/v2/content?contentId=${contentId}`)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         const parsedData = parseApiResponse(data);
  //         setQASections(parsedData);
  //       })
  //       .catch((error) => console.error("Error fetching Q/A data:", error));
  //   }, [contentId]);

  // Function to handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
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

  // Recursive copy function
  const handleCopy = (id: string) => {
    setQASections((prev) => {
      const newSections = JSON.parse(JSON.stringify(prev));
      const findAndCopy = (items: any[]): any[] =>
        items
          .map((item) => {
            if (item.id === id) {
              const copied = { ...item, id: `${item.id}-copy` };
              return [item, copied];
            }
            if (item.answers) {
              item.answers = findAndCopy(item.answers);
            }
            if (item.childQuestion) {
              item.childQuestion = findAndCopy([item.childQuestion])[0];
            }
            return item;
          })
          .flat();
      return findAndCopy(newSections);
    });
  };

  const handleTranslate = (text: string) => {
    alert(`Translate: ${text}`);
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

  //Handle submit button click
  //   const handleSubmit = () => {
  //     const dataToSubmit = {
  //       language,
  //       // qaSections: mapToApiFormat(qaSections)
  //       questionare: {
  //         questions: mapToApiFormat(qaSections)[0],
  //       },
  //     };
  //     // Map state to API format
  //     // const dataToSubmitToAPI = mapToApiFormat(dataToSubmit);
  //     console.log("Submitting Q/A Data:", dataToSubmit);
  //     // API Call (mocked here)

  //       if (id) {
  //         // Update API call
  //         fetch(`/api/questions/${id}`, {
  //             method: "PUT",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify(dataToSubmit),
  //           })
  //             .then((response) => {
  //               if (response.ok) {
  //                 alert("Q/A data saved successfully!");
  //                 navigate('/'); // Navigate back to the listing page
  //               } else {
  //                 alert("Failed to save Q/A data.");
  //               }
  //             })
  //             .catch((error) => console.error("Error submitting Q/A data:", error));
  //       } else {
  //         // Create API call
  //         fetch("/api/submit-qa", {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify(dataToSubmit),
  //           })
  //             .then((response) => {
  //               if (response.ok) {
  //                 alert("Q/A data saved successfully!");
  //                 navigate('/'); // Navigate back to the listing page
  //               } else {
  //                 alert("Failed to save Q/A data.");
  //               }
  //             })
  //             .catch((error) => console.error("Error submitting Q/A data:", error));
  //       }
  //   };

  // const handleSubmit = async () => {
  //     const mappedData = mapToApiFormat(qaSections)[0]; // Map the state to API format
  //     console.log("mappedData", mappedData);

  //     const dataToSubmit = {
  //       id, // The content ID
  //       content: {
  //         questionare: {
  //           questions: [mappedData], // Include mapped questions
  //         },
  //       },
  //       name: contentName,
  //       languageId: language, // Assuming `language` corresponds to `languageId`
  //     };

  //     console.log("Submitting Q/A Data:", JSON.stringify(dataToSubmit, null, 2)); // Debug the payload

  //     try {
  //       const response = await fetch(
  //   `http://localhost:8080/api/v2/content?contentId=${id}&name=${encodeURIComponent(contentName)}`,
  //         {
  //           method: "PUT",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(dataToSubmit),
  //         }
  //       );

  //       if (response.ok) {
  //         alert("Q/A data updated successfully!");
  //         navigate('/'); // Navigate back to the listing page or dashboard
  //       } else {
  //         const errorData = await response.json();
  //         console.error("Update failed:", errorData);
  //         alert("Failed to update Q/A data.");
  //       }
  //     } catch (error) {
  //       console.error("Error submitting Q/A data:", error);
  //       alert("An error occurred while updating Q/A data.");
  //     }
  //   };

  const handleSubmit = () => {
    const dataToSubmit = {
      language,
      questionare: {
        questions: mapToApiFormat(qaSections), // Transform state to API format
      },
    };

    console.log("Submitting Q/A Data:", dataToSubmit);

    if (id) {
      // Update API call
      fetch(
        `http://localhost:8080/api/v2/content?contentId=${id}&name=${encodeURIComponent(
          contentName
        )}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSubmit),
        }
      )
        .then((response) => {
          if (response.ok) {
            alert("Q/A data updated successfully!");
            navigate("/"); // Navigate back to the listing page
          } else {
            alert("Failed to update Q/A data.");
          }
        })
        .catch((error) => console.error("Error updating Q/A data:", error));
    } else {
      // Create API call
      fetch( `http://localhost:8080/api/v2/content?languageId=${1}&name=${encodeURIComponent(
        contentName
      )}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      })
        .then((response) => {
          if (response.ok) {
            alert("Q/A data created successfully!");
            navigate("/"); // Navigate back to the listing page
          } else {
            alert("Failed to create Q/A data.");
          }
        })
        .catch((error) => console.error("Error creating Q/A data:", error));
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
          placeholder="Enter question"
        />
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
                {/* Delete Solution Button
                <button
                  onClick={() => handleDeleteSolution(answer.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2"
                >
                  Delete Solution
                </button> */}
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
              {/* <button
              onClick={() => handleCopy(answer.id)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Copy
            </button>
            <button
              onClick={() => handleTranslate(answer.answer)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
            >
              Translate
            </button> */}
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
      {/* Language Dropdown */}
      {/* <div className="mb-4">
        <label htmlFor="language" className="mr-2 text-lg font-medium">
          Select Language:
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>
      </div> */}
      {/* Display Content Name */}
      {/* <h1 className="text-2xl font-bold mb-4">{contentName}</h1> */}
      <h1 className="text-2xl font-bold mb-4">
        <input
          type="text"
          value={contentName}
          onChange={(e) => setContentName(e.target.value)}
          className="border p-2 rounded-lg w-full"
          placeholder="Enter Game Title"
        />
      </h1>

      {/* Copy Button at the Top */}
      <div className="mb-4 flex justify-between">
        <div className="mb-4">
          <label className="text-md font-medium mr-2">Language:</label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="border border-gray-800 p-2 rounded-lg"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.code} {lang.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleCopyAll}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Copy All
        </button>
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
