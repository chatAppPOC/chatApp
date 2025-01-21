import React, { useState, useEffect } from "react";
import CaseDetailsPage from "../../CaseDetails/CaseDetailsPage/CaseDetailsPage";
import "./CaseDetailsTable.css";
import moment from "moment-timezone";

interface CaseContent {
  id: number;
  userName: string;
  caseType: string;
  gameName: string;
  status: string;
  createdOn: string;
}

interface User {
  id: number;
  firstName: string;
  LastName: string;
}

const CaseDetailsTable = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [caseContent, setCaseContent] = useState<CaseContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchUsers, setFetchUsers] = useState<User[]>([]);

  const handleRowClick = (id: number) => {
    setSelectedCaseId(id);
    setModalIsOpen(true);
  };
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setModalIsOpen(true);
  //   }, 10000); // Change 3000 to the desired delay in milliseconds

  //   return () => clearTimeout(timer);
  // }, []);

  const handleCloseModal = () => {
    setModalIsOpen(false);
    fetchCaseContent();
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
    fetchCaseContent();
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchCaseContent = async () => {
    try {
      //const response = await fetch("./caseContent.json");
      //const cookie = document.cookie;
      const response = await fetch("http://localhost:8080/api/allCases", {
        // credentials: "same-origin",
        //mode: "no-cors",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: "Basic " + btoa(`admin@test.com:admin123`),
          //"Access-Control-Allow-Credentials": "true",
          // Accept: "application/json",
          //Cookie: "JSESSIONID=FE06813246C825EAC62E09232C6844A0",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setCaseContent(data);
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      // const data = await response.json();
      // setCaseContent(data);
      // console.log(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(`admin@test.com:admin123`),
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      console.log("Fetched users:", data);
      setFetchUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
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
      {selectedCaseId && (
        // <div className="modal">
        //   <div className="modal-header">
        //     <h1 className="modal-title">Case Details</h1>
        //     <button onClick={handleCloseModal} className="modal-close-button">
        //       ×
        //     </button>
        //   </div>
        <CaseDetailsPage
          caseId={selectedCaseId}
          isModalOpen={modalIsOpen}
          closeModal={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CaseDetailsTable;
