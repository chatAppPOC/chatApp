import React, { useState } from "react";

interface QASection {
  id: string;
  question: string;
  answer: string;
}

const QAContentEditor: React.FC = () => {
  const [qaSections, setQASections] = useState<QASection[]>([
    { id: "1", question: "", answer: "" },
  ]);

  const handleAddQuestionUnderAnswer = (index: number) => {
    const newSection: QASection = {
      id: Date.now().toString(),
      question: "",
      answer: "",
    };
    const updatedSections = [...qaSections];
    updatedSections.splice(index + 1, 0, newSection);
    setQASections(updatedSections);
  };

  const handleCopySection = (index: number) => {
    const copiedSection = { ...qaSections[index], id: Date.now().toString() };
    const updatedSections = [...qaSections];
    updatedSections.splice(index + 1, 0, copiedSection);
    setQASections(updatedSections);
  };

  const handleTranslate = (index: number) => {
    // Add translation logic here
    alert(`Translating content for question: ${qaSections[index].question}`);
  };

  const handleInputChange = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const updatedSections = [...qaSections];
    updatedSections[index][field] = value;
    setQASections(updatedSections);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Edit Q/A Content</h1>
      {qaSections.map((section, index) => (
        <div key={section.id} className="border p-4 mb-4 rounded-lg">
          <div className="mb-4">
            <label className="block font-medium">Question</label>
            <textarea
              value={section.question}
              onChange={(e) =>
                handleInputChange(index, "question", e.target.value)
              }
              className="w-full border p-2 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Answer</label>
            <textarea
              value={section.answer}
              onChange={(e) =>
                handleInputChange(index, "answer", e.target.value)
              }
              className="w-full border p-2 rounded-lg"
            />
          </div>
          {/* <div className="flex gap-4">
            <button
              onClick={() => handleAddQuestionUnderAnswer(index)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              + Add Question
            </button>
            <button
              onClick={() => handleCopySection(index)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Copy
            </button>
            <button
              onClick={() => handleTranslate(index)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
            >
              Translate
            </button>
          </div> */}
        </div>
      ))}
    </div>
  );
};

export default QAContentEditor;
