import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface QAContent {
  id: number;
  language: string;
  name: string;
  titleId: string;
  createdOn: string | null;
  updatedOn: string | null;
  updatedBy: string | null;
  createdBy: string | null;
}

const QAContentTable: React.FC = () => {
  const [qaContents, setQAContents] = useState<QAContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [titles, setTitles] = useState<{ id: number; name: string }[]>([]);

  // Fetch titles from API
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

  // Get title name by titleId
  const getTitleName = (titleId: string | null): string => {
    if (!titleId) return "N/A"; // Handle cases where titleId is null
    const title = titles.find((t) => String(t.id) === String(titleId));
    // return title ? `${title.name} (${titleId})` : `Unknown (${titleId})`;
    return title ? `${title.name}` : `Unknown (${titleId})`;
  };

  // Fetch data from API
  useEffect(() => {
    const fetchQAContent = async () => {
      try {
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
    return (
      <div className="flex justify-center items-center my-24">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-4">
      {/* Create Button */}
      <div className=" flex justify-between items-center my-4">
        <h1 className="text-2xl font-semibold ">Q/A Content Grid</h1>
        <Button onClick={handleCreate}>Create Q/A Content</Button>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-hidden rounded-lg border border-gray-300">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 first:rounded-t-lg">
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Language
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content Name
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Game Title
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created Date
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created By
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated Date
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated By
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
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
                <td className="px-3 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
                  {content.id}
                </td>
                <td className="px-3 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
                  {content.language || "N/A"}
                </td>
                <td className="px-3 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
                  {content.name}
                </td>
                <td className="px-3 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
                  {getTitleName(content.titleId)}
                </td>
                <td className="px-3 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
                  {content.createdOn
                    ? moment(content.createdOn)
                        .tz("America/Los_Angeles")
                        .format("ddd MMMM DD YYYY hh:mm:ss A z")
                    : "N/A"}
                </td>
                <td className="px-3 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
                  {content.createdBy || "N/A"}
                </td>
                <td className="px-3 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
                  {content.updatedOn
                    ? moment(content.updatedOn)
                        .tz("America/Los_Angeles")
                        .format("ddd MMMM DD YYYY hh:mm:ss A z")
                    : "N/A"}
                </td>
                <td className="px-3 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
                  {content.updatedBy || "N/A"}
                </td>
                <td className="px-3 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
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
