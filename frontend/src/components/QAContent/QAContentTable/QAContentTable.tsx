import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";

interface QAContent {
  id: number;
  language: string;
  name: string;
  createdOn: string | null;
  updatedOn: string | null;
  updatedBy: string | null;
  createdBy: string | null;
}

const QAContentTable: React.FC = () => {
  const [qaContents, setQAContents] = useState<QAContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchQAContent = async () => {
      try {
        // const response = await fetch("./public/qaContent.json");
        const response = await fetch(`http://localhost:8080/api/v2/contents`, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: "Basic " + btoa(`admin@test.com:admin123`),
          },
        });
        console.log("response", response);

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
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

  const handleCreate = () => {
    window.location.href = `/qa-content`; // Navigate to the QA editor page for new content
  };

  const navigate = useNavigate();

  const handleRowClick = (id: number) => {
    navigate(`/qa-content/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v2/content?contentId=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: "Basic " + btoa(`admin@test.com:admin123`),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete content: ${response.statusText}`);
      }

      // Remove the deleted item from the UI
      const updatedContents = qaContents.filter(
        (content) => content.id !== Number(id)
      );
      setQAContents(updatedContents);

      alert("Content deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting content:", error);
      alert("Failed to delete content. Please try again.");
    }
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
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleCreate}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Create Q/A Content
        </button>
      </div>

      {/* Table Wrapper with Overflow Hidden for Rounded Borders */}
      {/* <div className="overflow-hidden rounded-lg border border-gray-300 shadow-lg"> */}
      <div className="overflow-hidden rounded-lg border border-gray-300">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 first:rounded-t-lg">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Language</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Created Date</th>
              <th className="border border-gray-300 px-4 py-2">Created By</th>
              <th className="border border-gray-300 px-4 py-2">Updated Date</th>
              <th className="border border-gray-300 px-4 py-2">Updated By</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {qaContents.map((content, index) => (
              <tr
                key={content.id}
                className={`hover:bg-gray-50 cursor-pointer text-center ${
                  index === qaContents.length - 1 ? "last:rounded-b-lg" : ""
                }`}
                onClick={() => handleRowClick(content.id)}
              >
                <td className="border border-gray-300 px-4 py-2">
                  {content.id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {content.language || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {content.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {content.createdOn
                    ? moment(content.createdOn)
                        .tz("America/Los_Angeles")
                        .format("ddd MMMM DD YYYY hh:mm:ss A z")
                    : "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {content.createdBy || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {content.updatedOn
                    ? moment(content.updatedOn)
                        .tz("America/Los_Angeles")
                        .format("ddd MMMM DD YYYY hh:mm:ss A z")
                    : "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {content.updatedBy || "N/A"}
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
    </div>
  );
};

export default QAContentTable;
