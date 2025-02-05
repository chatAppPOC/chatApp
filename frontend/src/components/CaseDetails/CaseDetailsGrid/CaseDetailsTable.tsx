import React, { useState, useEffect } from "react";
import CaseDetailsPage from "../../CaseDetails/CaseDetailsPage/CaseDetailsPage";
import "./CaseDetailsTable.css";
import moment from "moment-timezone";

interface CaseContent {
  id: number;
  // userName: string;
  userId: number;
  caseType: string;
  // gameName: string;
  title: number;
  status: string;
  createdOn: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

const CaseDetailsTable = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [caseContent, setCaseContent] = useState<CaseContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchUsers, setFetchUsers] = useState<User[]>([]);
  const [titles, setTitles] = useState<{ id: number; name: string }[]>([]);

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

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/titles", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa(`admin@test.com:admin123`),
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch titles: ${response.statusText}`);
        }
        const data = await response.json();
        setTitles(data);
      } catch (error) {
        console.error("Error fetching titles:", error);
      }
    };
    fetchTitles();
  }, []);

  const handleCloseModal = () => {
    setModalIsOpen(false);
    fetchCaseContent();
    //window.location.reload();
  };

  const getTitleName = (titleId: number | null): string => {
    if (!titleId) return "N/A"; // Handle cases where titleId is null
    const title = titles.find((t) => t.id == titleId);
    // return title ? `${title.name} (${titleId})` : `Unknown (${titleId})`;
    return title ? `${title.name}` : `Unknown (${titleId})`;
  };

  const getAssignedTo = (userId: number | null): string => {
    if (!userId) return "N/A"; //Handle cases where ase is not assigned to any user
    const assignedTo = fetchUsers.find((u) => u.id == userId);
    return assignedTo
      ? `${assignedTo.firstName + " " + assignedTo.lastName}`
      : `Unknown (${userId})`;
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

  // Fetch title id's from API
  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/titles", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa(`admin@test.com:admin123`),
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch titles: ${response.statusText}`);
        }
        const data = await response.json();
        setTitles(data);
      } catch (error) {
        console.error("Error fetching titles:", error);
      }
    };
    fetchTitles();
  }, []);

  const fetchCaseContent = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/allCases", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: "Basic " + btoa(`admin@test.com:admin123`),
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
            <th>Assigned To</th>
            <th>Case Description</th>
            <th>Game Name</th>
            <th>Status</th>
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
          {caseContent.map((caseItem) => (
            <tr
              className="hover:bg-gray-50 cursor-pointer text-gray text-center h-12"
              key={caseItem.id}
              onClick={() => handleRowClick(caseItem.id)}
            >
              <td className="border border-gray-300 px-4 py-2">
                {caseItem.id}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {getAssignedTo(caseItem.userId)}
              </td>
              <td className="border border-gray-300 px-4 py-2 w-30 h-20 desc  text-center">
                <textarea
                  className="w-full h-full text-center"
                  disabled
                  value={caseItem.caseType}
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {getTitleName(caseItem.title)}
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
        <CaseDetailsPage
          caseId={selectedCaseId}
          isModalOpen={modalIsOpen}
          closeModal={handleCloseModal}
          status={status}
        />
      )}
    </div>
  );
};

export default CaseDetailsTable;
