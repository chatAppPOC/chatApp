import React, { useEffect, useState } from "react";

interface CaseContent {
  id: number;
  userName: string;
  caseType: string;
  gameName: string;
  status: string;
  createdOn: string;
}

function CaseDetailsTable() {
  const [caseContent, setCaseContent] = useState<CaseContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the public folder
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

  const handleRowClick = (id: number) => {
    window.location.href = `/case-details/${id}`; // or use React Router
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">Case Details Table</h1>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Case Id</th>
              <th className="border border-gray-300 px-4 py-2">User Name</th>
              <th className="border border-gray-300 px-4 py-2">Case Type</th>
              <th className="border border-gray-300 px-4 py-2">Game Name</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Created On</th>
            </tr>
          </thead>

          <tbody>
            {caseContent.map((content) => (
              <tr
                key={content.id}
                className="hover:bg-gray-50 cursor-pointer text-gray text-center"
                onClick={() => handleRowClick(content.id)}
              >
                <td className="border border-gray-300 px-4 py-2">
                  {content.id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {content.userName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {content.caseType}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {content.gameName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {content.status}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {content.createdOn.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default CaseDetailsTable;