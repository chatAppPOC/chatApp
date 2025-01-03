import React, { useState, useEffect } from "react";

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
  const fetchContentByLanguage = async (lang: string) => {
    try {
      const response = await fetch(`/api/get-qa?language=${lang}`);
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

  //   const fetchContentByLanguage = async (lang: string) => {
  //     try {
  //       const response = await fetch(`/api/get-qa?language=${lang}`);
  //       const data = await response.json();

  //       const transformApiToState = (apiData: any): QASection[] => {
  //         const transformAnswers = (answers: any[]): Answer[] =>
  //           answers.map((ans) => ({
  //   id: ans.id.toString(),
  //             answer: ans.answer,
  //             solution: ans.solution,
  //             childQuestion: ans.questions
  //               ? transformApiToState([ans.questions])[0]
  //               : undefined,
  //           }));

  //         return apiData.questions
  //           ? [{
  //   id: apiData.id.toString(),
  //               question: apiData.questions.question,
  //               answers: transformAnswers(apiData.questions.answers || []),
  //             }]
  //           : [];
  //       };

  //       setQASections(transformApiToState(data.questionare));
  //     } catch (error) {
  //       console.error("Error fetching content:", error);
  //     }
  //   };

  const parseApiResponse = (response: any): QASection[] => {
    const parseSection = (data: any): QASection => ({
      id: `${data.id}-${Math.random()}`, // Ensure unique IDs
      question: data.question,
      answers: data.answers.map((ans: any) => ({
        id: `${Math.random()}`, // Ensure unique IDs
        answer: ans.answer,
        ...(ans.questions
          ? { childQuestion: parseSection(ans.questions) }
          : {}),
        ...(ans.solution ? { solution: ans.solution } : {}),
      })),
    });

    return response.questionare.questions
      ? [parseSection(response.questionare.questions)]
      : [];
  };

  useEffect(() => {
    fetch("/api/get-qa-data")
      .then((response) => response.json())
      .then((data) => {
        const parsedData = parseApiResponse(data);
        setQASections(parsedData);
      })
      .catch((error) => console.error("Error fetching Q/A data:", error));
  }, []);

  // Function to handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  // Function to handle adding a new answer
  const handleAddAnswer = (questionId: string) => {
    const addAnswerRecursively = (sections: QASection[]): QASection[] =>
      sections.map((section) => {
        if (section.id === questionId) {
          return {
            ...section,
            answers: [
              ...section.answers,
              {
                id: `${section.id}-${section.answers.length + 1}`,
                answer: "",
              },
            ],
          };
        }

        return {
          ...section,
          answers: section.answers.map((answer) => ({
            ...answer,
            childQuestion: answer.childQuestion
              ? {
                  ...answer.childQuestion,
                  answers: addAnswerRecursively([answer.childQuestion])[0]
                    .answers,
                }
              : answer.childQuestion,
          })),
        };
      });

    setQASections((prev) => addAnswerRecursively(prev));
  };

  // Function to handle adding a new question
  const handleAddQuestion = (answerId: string) => {
    const addQuestionRecursively = (sections: QASection[]): QASection[] =>
      sections.map((section) => {
        return {
          ...section,
          answers: section.answers.map((answer) => {
            if (answer.id === answerId) {
              return {
                ...answer,
                childQuestion: answer.childQuestion || {
                  id: `${answer.id}-child`,
                  question: "",
                  answers: [],
                },
              };
            }

            return {
              ...answer,
              childQuestion: answer.childQuestion
                ? {
                    ...answer.childQuestion,
                    answers: addQuestionRecursively([answer.childQuestion])[0]
                      .answers,
                  }
                : answer.childQuestion,
            };
          }),
        };
      });

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

  // const handleDeleteQuestion = (answerId: string) => {
  //     setQASections((prev) =>
  //         prev.map((section) => ({
  //             ...section,
  //             answers: section.answers.map((ans) =>
  //                 ans.id === answerId ? { ...ans, childQuestion: undefined } : ans
  //             ),
  //         }))
  //     );
  // };

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
    field: "question" | "answer",
    value: string
  ) => {
    const updateRecursively = (sections: QASection[]): QASection[] =>
      sections.map((section) => {
        // Update the section question
        if (section.id === id && field === "question") {
          return { ...section, question: value };
        }

        // Update answers and handle nested questions
        return {
          ...section,
          answers: section.answers.map((ans) => {
            // Update the answer field
            if (ans.id === id && field === "answer") {
              return { ...ans, answer: value };
            }

            // If there's a child question, recursively update it
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
  // const mapToApiFormat = (sections: QASection[]): any => {
  //     return sections.map((section) => ({
  //         question: section.question,
  //         answers: section.answers.map((ans) => ({
  //             answer: ans.answer,
  //             solution: ans.solution,
  //             ...(ans.childQuestion
  //                 ? { questions: mapToApiFormat([ans.childQuestion])[0] }
  //                 : {}),
  //         })),
  //     }));
  // };

  const mapToApiFormat = (sections: QASection[]): any => {
    return sections.map((section) => ({
      question: section.question,
      answers: section.answers.map((ans) => ({
        answer: ans.answer,
        solution: ans.solution,
        ...(ans.childQuestion
          ? { questions: mapToApiFormat([ans.childQuestion])[0] }
          : {}),
      })),
    }));
  };

  const handleSubmit = () => {
    const dataToSubmit = {
      language,
      // qaSections: mapToApiFormat(qaSections)
      questionare: {
        questions: mapToApiFormat(qaSections)[0],
      },
    };
    // Map state to API format
    // const dataToSubmitToAPI = mapToApiFormat(dataToSubmit);
    console.log("Submitting Q/A Data:", dataToSubmit);
    // API Call (mocked here)
    fetch("/api/submit-qa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSubmit),
    })
      .then((response) => {
        if (response.ok) {
          alert("Q/A data saved successfully!");
        } else {
          alert("Failed to save Q/A data.");
        }
      })
      .catch((error) => console.error("Error submitting Q/A data:", error));
  };

  // Recursive component for rendering nested sections
  const renderSection = (section: QASection) => (
    <div key={section.id} className="border p-4 mb-4 rounded-lg">
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
        <div key={answer.id} className="ml-4 border-l pl-4 mb-2">
          <h3 className="text-md font-medium">Answer</h3>
          <textarea
            value={answer.answer}
            onChange={(e) =>
              handleInputChange(answer.id, "answer", e.target.value)
            }
            className="w-full border p-2 mb-2 rounded-lg"
            placeholder="Enter answer"
          />
          <div className="flex gap-4">
            <button
              onClick={() => handleAddQuestion(answer.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
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
          </div>
          {answer.childQuestion && (
            <div className="ml-4">{renderSection(answer.childQuestion)}</div>
          )}
        </div>
      ))}
      <button
        onClick={() => handleAddAnswer(section.id)}
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg"
      >
        + Add Answer
      </button>
    </div>
  );

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

      <div className="mb-4">
        <label className="text-md font-medium mr-2">Language:</label>
        <select
          value={language}
          onChange={handleLanguageChange}
          className="border p-2 rounded-lg"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.code} {lang.label}
            </option>
          ))}
        </select>
      </div>
      {qaSections.map(renderSection)}
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 mt-4 rounded-lg"
      >
        Submit
      </button>
    </div>
  );
};

export default QAContentEditor;
