import React, { useEffect, useState } from "react";

interface QAContent {
  id: string;
  createdDate: string;
  updatedDate: string;
  updatedBy: string;
}

const QAContentTable: React.FC = () => {
  const [qaContents, setQAContents] = useState<QAContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

// Fetch data from the public folder
useEffect(() => {
  const fetchQAContent = async () => {
    try {
      const response = await fetch("./public/qaContent.json");
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response");
      }
      const data: QAContent[] = await response.json();
      setQAContents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchQAContent();
}, []);

  const handleRowClick = (id: string) => {
    window.location.href = `/qa-content/${id}`; // or use React Router
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Q/A Content Grid</h1>
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Created Date</th>
            <th className="border border-gray-300 px-4 py-2">Updated Date</th>
            <th className="border border-gray-300 px-4 py-2">Updated By</th>
          </tr>
        </thead>
        <tbody>
          {qaContents.map((content) => (
            <tr
              key={content.id}
              className="hover:bg-gray-50 cursor-pointer text-gray text-center"
              onClick={() => handleRowClick(content.id)}
            >
              <td className="border border-gray-300 px-4 py-2">{content.id}</td>
              <td className="border border-gray-300 px-4 py-2">
                {content.createdDate}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {content.updatedDate}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {content.updatedBy}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QAContentTable;
