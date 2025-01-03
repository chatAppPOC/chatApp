import React, { useState } from "react";

interface QASection {
  id: string;
  question: string;
  answers: Answer[];
}

interface Answer {
  id: string;
  answer: string;
  childQuestion?: QASection;
}

const QAContentEditor: React.FC = () => {
  const [qaSections, setQASections] = useState<QASection[]>([
    {
      id: "1",
      question: "Sample Question?",
      answers: [
        { id: "1-1", answer: "Sample Answer 1" },
        { id: "1-2", answer: "Sample Answer 2" },
      ],
    },
  ]);

//   const handleAddAnswer = (questionId: string) => {
//     setQASections((prev) =>
//       prev.map((section) =>
//         section.id === questionId
//           ? {
//               ...section,
//               answers: [
//                 ...section.answers,
//                 {
//                   id: `${section.id}-${section.answers.length + 1}`,
//                   answer: "",
//                 },
//               ],
//             }
//           : section
//       )
//     );
//   };

const handleAddAnswer = (questionId: string) => {
    const addAnswerToNestedSection = (sections: QASection[]): QASection[] => {
      return sections.map((section) => {
  if (section.id === questionId) {
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
          answers: section.answers.map((answer) => {
            if (answer.childQuestion) {
              return {
                ...answer,
                childQuestion: {
                  ...answer.childQuestion,
                  answers: addAnswerToNestedSection([answer.childQuestion])[0]
                    .answers,
                },
              };
            }
            return answer;
          }),
        };
      });
    };
   
    setQASections((prev) => addAnswerToNestedSection(prev));
  };
  
  const handleAddQuestion = (answerId: string) => {
    setQASections((prev) =>
      prev.map((section) => ({
        ...section,
        answers: section.answers.map((ans) =>
          ans.id === answerId
            ? {
                ...ans,
                childQuestion: {
                  id: `${answerId}-child`,
                  question: "",
                  answers: [],
                },
              }
            : ans
        ),
      }))
    );
  };

  const handleDeleteAnswer = (questionId: string, answerId: string) => {
    setQASections((prev) =>
      prev.map((section) =>
        section.id === questionId
          ? {
              ...section,
              answers: section.answers.filter((ans) => ans.id !== answerId),
            }
          : section
      )
    );
  };

  const handleDeleteQuestion = (answerId: string) => {
    setQASections((prev) =>
      prev.map((section) => ({
        ...section,
        answers: section.answers.map((ans) =>
          ans.id === answerId ? { ...ans, childQuestion: undefined } : ans
        ),
      }))
    );
  };

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

  const handleInputChange = (
    id: string,
    field: "question" | "answer",
    value: string
  ) => {
    setQASections((prev) =>
      prev.map((section) => {
        if (section.id === id) {
          return { ...section, [field]: value };
        }
        return {
          ...section,
          answers: section.answers.map((ans) =>
            ans.id === id
              ? { ...ans, [field]: value }
              : {
                  ...ans,
                  childQuestion: ans.childQuestion
                    ? {
                        ...ans.childQuestion,
                        [field]:
                          ans.childQuestion.id === id
                            ? value
                            : ans.childQuestion[field as keyof QASection],
                      }
                    : undefined,
                }
          ),
        };
      })
    );
  };

  const handleSubmit = () => {
    // Validate that all questions and answers are filled out
    const validateSections = (sections: QASection[]): boolean => {
      for (const section of sections) {
        if (!section.question.trim()) {
          alert(`Question ID: ${section.id} is empty.`);
          return false;
        }
        for (const answer of section.answers) {
          if (!answer.answer.trim()) {
            alert(
              `Answer ID: ${answer.id} in Question ID: ${section.id} is empty.`
            );
            return false;
          }
          if (
            answer.childQuestion &&
            !validateSections([answer.childQuestion])
          ) {
            return false;
          }
        }
      }
      return true;
    };

    if (!validateSections(qaSections)) {
      return; // Stop submission if validation fails
    }

    console.log("Submitting Q/A Data:", qaSections);

    // Replace this with your API call
    fetch("/api/submit-qa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(qaSections),
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

  const renderQASection = (section: QASection) => (
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
            <button
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
            </button>
          </div>
          {answer.childQuestion && (
            <div className="ml-4">{renderQASection(answer.childQuestion)}</div>
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
      {qaSections.map((section) => renderQASection(section))}
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
