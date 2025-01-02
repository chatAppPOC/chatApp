import React, { useState } from "react";

interface QASection {
  id: string;
  question: string;
  answer: string;
}

const CaseDeatilsPage: React.FC = () => {
  //   const [qaSections, setQASections] = useState<QASection[]>([
  //     { id: "1", question: "", answer: "" },
  //   ]);

  //   const handleAddQuestionUnderAnswer = (index: number) => {
  //     const newSection: QASection = {
  //       id: Date.now().toString(),
  //       question: "",
  //       answer: "",
  //     };
  //     const updatedSections = [...qaSections];
  //     updatedSections.splice(index + 1, 0, newSection);
  //     setQASections(updatedSections);
  //   };

  //   const handleCopySection = (index: number) => {
  //     const copiedSection = { ...qaSections[index], id: Date.now().toString() };
  //     const updatedSections = [...qaSections];
  //     updatedSections.splice(index + 1, 0, copiedSection);
  //     setQASections(updatedSections);
  //   };

  //   const handleTranslate = (index: number) => {
  //     // Add translation logic here
  //     alert(`Translating content for question: ${qaSections[index].question}`);
  //   };

  //   const handleInputChange = (
  //     index: number,
  //     field: "question" | "answer",
  //     value: string
  //   ) => {
  //     const updatedSections = [...qaSections];
  //     updatedSections[index][field] = value;
  //     setQASections(updatedSections);
  //   };
  const options = [
    { label: "Testuser1", value: "user1" },

    { label: "TestUser2", value: "user2" },

    { label: "Testuser3", value: "user3" },
  ];

  const [value, setValue] = React.useState("user1");

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>Description</div>
      <div>
        {/* <input
          type="text"
          value=" This is teh cased 1 of userxyz is in progress"
          disabled
        ></input> */}
        This is the cased 1 of userxyz is in progress This is the cased 1 of use
        rxyz is in progress This is the cased 1 of userxyz is in progressThis is
        the cased 1 of user xyz is in progress
      </div>
      <div>Assigned to</div>
      <div>
        <select value={value} onChange={handleChange}>
          {options.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <div>Status</div>
      <div>In Progress</div>
      <div>Estimated completion date</div>
      <div>20/07/2024</div>
      <div>Chat to player</div>
      <div>
        <svg
          aria-hidden="true"
          class="svg-icon iconQuestion"
          width="18"
          height="18"
          viewBox="0 0 18 18"
        >
          <path d="m4 15-3 3V4c0-1.1.9-2 2-2h12c1.09 0 2 .91 2 2v9c0 1.09-.91 2-2 2zm7.75-3.97c.72-.83.98-1.86.98-2.94 0-1.65-.7-3.22-2.3-3.83a4.4 4.4 0 0 0-3.02 0 3.8 3.8 0 0 0-2.32 3.83q0 1.93 1.03 3a3.8 3.8 0 0 0 2.85 1.07q.94 0 1.71-.34.97.66 1.06.7.34.2.7.3l.59-1.13a5 5 0 0 1-1.28-.66m-1.27-.9a5 5 0 0 0-1.5-.8l-.45.9q.5.18.98.5-.3.1-.65.11-.92 0-1.52-.68c-.86-1-.86-3.12 0-4.11.8-.9 2.35-.9 3.15 0 .9 1.01.86 3.03-.01 4.08"></path>
        </svg>
      </div>
      <div>FeedBack</div>
      <div>
        <input
          type="text"
          style={{ width: "361px", height: "50px", border: "1px solid #ccc" }}
        ></input>
      </div>
    </div>
  );
};

export default CaseDeatilsPage;
