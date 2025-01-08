import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

interface QAContent {
  id: string;
  createdDate: string;
  createdBy:string;
  updatedDate: string;
  updatedBy: string;
  language: string;
  action: string;
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


  const handleDelete = (id: string) => {
    const updatedContents = qaContents.filter((content) => content.id !== id);
    setQAContents(updatedContents);
  };

  // const handleDelete = async (id: string) => {
  //   try {
  //     const response = await fetch(`http://localhost:8080/api/v2/content?contentId=${id}`, {
  //       method: "DELETE",
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Failed to delete content: ${response.statusText}`);
  //     }

  //     // Remove the deleted item from the UI
  //     const updatedContents = qaContents.filter((content) => content.id !== id);
  //     setQAContents(updatedContents);

  //     alert("Content deleted successfully!");
  //   } catch (error: any) {
  //     console.error("Error deleting content:", error);
  //     alert("Failed to delete content. Please try again.");
  //   }
  // };

  const handleCreate = () => {
    window.location.href = `/qa-content`; // Navigate to the QA editor page for new content
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

      {/* Create Button */}
      {/* <div className="mb-4 flex justify-end">
        <button
          onClick={handleCreate}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Create Q/A Content
        </button>
      </div> */}

      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Language</th>
            <th className="border border-gray-300 px-4 py-2">Created Date</th>
            <th className="border border-gray-300 px-4 py-2">Created By</th>
            <th className="border border-gray-300 px-4 py-2">Updated Date</th>
            <th className="border border-gray-300 px-4 py-2">Updated By</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {qaContents.map((content) => (
            <tr
              key={content.id}
              className="hover:bg-gray-50 cursor-pointer text-gray text-center"
            >
              <td
                className="border border-gray-300 px-4 py-2"
                onClick={() => handleRowClick(content.id)}
              >
                {content.id}
              </td>
              <td
                className="border border-gray-300 px-4 py-2"
                onClick={() => handleRowClick(content.id)}
              >
                {content.language}
              </td>
              <td
                className="border border-gray-300 px-4 py-2"
                onClick={() => handleRowClick(content.id)}
              >
                {content.createdDate}
              </td>
              <td
                className="border border-gray-300 px-4 py-2"
                onClick={() => handleRowClick(content.id)}
              >
                {content.createdBy}
              </td>
              <td
                className="border border-gray-300 px-4 py-2"
                onClick={() => handleRowClick(content.id)}
              >
                {content.updatedDate}
              </td>
              <td
                className="border border-gray-300 px-4 py-2"
                onClick={() => handleRowClick(content.id)}
              >
                {content.updatedBy}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(content.id);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QAContentTable;
