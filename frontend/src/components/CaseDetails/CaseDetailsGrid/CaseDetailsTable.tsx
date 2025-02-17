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
  const [titleName, setTitleName] = useState<string>("");

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

    const getGameName = title ? `${title.name}` : `Unknown (${titleId})`;
    return getGameName;
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
    <div className="p-5 h-screen overflow-auto">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Cases</h2>
        <p className="text-sm text-gray-500">
          Manage and track all case details
        </p>
      </div>
      <div className="overflow-x-auto shadow-sm sm:rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Case Id
              </th>
              <th
                scope="col"
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Assigned To
              </th>
              <th
                scope="col"
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Case Description
              </th>
              <th
                scope="col"
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Game Name
              </th>
              <th
                scope="col"
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Created Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {caseContent.map((caseItem) => (
              <tr
                key={caseItem.id}
                onClick={() => handleRowClick(caseItem.id)}
                className="hover:bg-gray-50 transition-colors duration-200 ease-in-out cursor-pointer"
              >
                <td className="px-3 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
                  {caseItem.id}
                </td>
                <td className="px-3 py-1 whitespace-nowrap text-sm text-gray-500">
                  {getAssignedTo(caseItem.userId)}
                </td>
                <td className="px-3 py-1">
                  <textarea
                    className="w-full min-h-[40px] text-sm text-gray-500 bg-transparent border-0 resize-none focus:ring-0 focus:outline-none"
                    disabled
                    value={caseItem.caseType}
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                  {getTitleName(caseItem.title)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className="px-2 py-0.5 text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {caseItem.status}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                  {getFormattedDate(caseItem.createdOn)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedCaseId && (
        <CaseDetailsPage
          caseId={selectedCaseId}
          isModalOpen={modalIsOpen}
          closeModal={handleCloseModal}
          status={status}
          titles={titles}
        />
      )}
    </div>
  );
};

export default CaseDetailsTable;
