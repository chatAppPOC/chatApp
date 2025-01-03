import React, { useState } from "react";

interface QASection {
    id: string;
    question: string;
    // questionDesc: string;
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
                {
                    id: "1-1",
                    answer: "Sample Answer 1"
                },
            ],
        },
    ]);

    const handleAddAnswer = (questionId: string) => {
        setQASections((prev) =>
            prev.map((section) =>
                section.id === questionId
                    ? {
                        ...section,
                        answers: [
                            ...section.answers,
                            {
                                id: `${section.id}-${section.answers.length + 1}`,
                                answer: "",
                                answerDesc: "",
                            },
                        ],
                    }
                    : section
            )
        );
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

    const handleCopy = (id: string) => {
        setQASections((prev) => {
            const newSections = JSON.parse(JSON.stringify(prev));
            const findAndCopy = (items: any[]): any[] =>
                items.map((item) => {
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
                }).flat();
            return findAndCopy(newSections);
        });
    };

    const handleTranslate = (text: string) => {
        alert(`Translate: ${text}`);
    };

    const handleInputChange = (
        id: string,
        field: "question"  | "answer",
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
                                        [field]: ans.childQuestion.id === id ? value : ans.childQuestion[field as keyof QASection],
                                    }
                                    : undefined,
                            }
                    ),
                };
            })
        );
    };

    return (
        <div className="p-4">
            {/* <h1 className="text-xl font-semibold mb-4">Q/A Editor</h1> */}
            {qaSections.map((section) => (
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
                    {/* <textarea
                        value={section.questionDesc}
                        onChange={(e) =>
                            handleInputChange(section.id, "questionDesc", e.target.value)
                        }
                        className="w-full border p-2 mb-2 rounded-lg"
                        placeholder="Enter question description"
                    /> */}
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
                            {/* <textarea
                                value={answer.answerDesc}
                                onChange={(e) =>
                                    handleInputChange(answer.id, "answerDesc", e.target.value)
                                }
                                className="w-full border p-2 mb-2 rounded-lg"
                                placeholder="Enter answer description"
                            /> */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleAddQuestion(answer.id)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                >
                                    + Add Question
                                </button>
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
                                <div className="ml-4">
                                    <QAContentEditor />
                                </div>
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
            ))}
        </div>
    );
};

export default QAContentEditor;