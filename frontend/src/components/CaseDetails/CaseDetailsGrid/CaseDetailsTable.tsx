import React, { useState, useEffect } from "react";
import CaseDeatilsPage from "../../CaseDetails/CaseDeatilsPage/CaseDeatilsPage";
import "./CaseDetailsTable.css";
import Modal from "react-modal";
import moment from "moment-timezone";

interface CaseContent {
  id: number;
  userName: string;
  caseType: string;
  gameName: string;
  status: string;
  createdOn: string;
}

const CaseDetailsTable = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [caseContent, setCaseContent] = useState<CaseContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleRowClick = (id: number) => {
    setSelectedCaseId(id);
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  function getFormattedDate(date: string) {
    if (date) {
      const timestampInPDT = moment(date).tz("America/Los_Angeles");
      const format = "MMM DD YYYY hh:mm:ss a z";
      return timestampInPDT
        .format(format)
        .replace(/\bam\b/, "AM")
        .replace(/\bpm\b/, "PM");
    } else {
      return null;
    }
  }

  useEffect(() => {
    const fetchCaseContent = async () => {
      try {
        //const response = await fetch("./caseContent.json");
        const response = await fetch("http://localhost:8080/api/allCases");
        console.log("check res", response);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response");
        }
        const data: CaseContent[] = Object.values(await response.json());
        setCaseContent(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseContent();
  }, []);

  return (
    <div>
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th>Case Id</th>
            <th>User Name</th>
            <th>Case Description</th>
            <th>Game Name</th>
            <th>Status</th>
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
          {caseContent.map((caseItem) => (
            <tr
              className="hover:bg-gray-50 cursor-pointer text-gray text-center"
              key={caseItem.id}
              onClick={() => handleRowClick(caseItem.id)}
            >
              <td className="border border-gray-300 px-4 py-2">
                {caseItem.id}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {caseItem.userName}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {caseItem.caseType}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {caseItem.gameName}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {caseItem.status}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {getFormattedDate(caseItem.createdOn)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            width: "600px",
            height: "auto",
            margin: "50px auto",
            padding: "20px",
            //backgroundColor: "#000000",
            background: "linear-gradient(to bottom, #000000, #333333)",
            border: "1px solid #ddd",
            borderRadius: "10px",
            // boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        {/* {selectedCaseId && <CaseDeatilsPage caseId={selectedCaseId} />} */}
        {selectedCaseId && (
          <div className="modal">
            <div className="modal-header">
              <h1 className="modal-title">Case Details</h1>
              <button onClick={handleCloseModal} className="modal-close-button">
                ×
              </button>
            </div>
            <CaseDeatilsPage caseId={selectedCaseId} />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CaseDetailsTable;
