import React, { useEffect, useState } from "react";

interface CaseDetailsContent {
  id: number;
  caseType: string;
  status: string;
  completedOn: string;
  userName: string;
  feedback: string;
}

const CaseDeatilsPage: React.FC = () => {
  const options = [
    { label: "Testuser1", value: "user1" },
    { label: "TestUser2", value: "user2" },
    { label: "Testuser3", value: "user3" },
  ];

  const [value, setValue] = useState("");
  const [caseContent, setCaseContent] = useState<CaseDetailsContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const fetchCaseContent = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/case?caseId=1");
        console.log("check res", response);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response");
        }
        const data: CaseDetailsContent[] = await response.json();
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
    <table className="w-full border-collapse table-auto bg-white border border-gray-300 text-gray-600 text-sm font-medium ">
      <thead>
        <tr>
          <th className="border border-gray-300 px-4 py-2">ID</th>
          <th className="border border-gray-300 px-4 py-2">Description</th>
          <th className="border border-gray-300 px-4 py-2">Assigned To</th>
          <th className="border border-gray-300 px-4 py-2">Status</th>
          <th className="border border-gray-300 px-4 py-2">Completed On</th>
          <th className="border border-gray-300 px-4 py-2">FeedBack</th>
        </tr>
      </thead>
      <tbody>
        {caseContent.map((content) => (
          <tr
            key={content.id}
            className="hover:bg-gray-50 cursor-pointer text-gray text-center"
          >
            <td className="border border-gray-300 px-4 py-2">{content.id}</td>
            <td className="border border-gray-300 px-4 py-2">
              {content.caseType}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {content.userName}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {content.status}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {content.completedOn
                ? content.completedOn.toLocaleString()
                : "No data"}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="text"
                value={content.feedback ? content.feedback : ""}
                className="border border-gray-300 px-4 py-2"
                onChange={(e) => {
                  // Update the feedBack in the caseContent array
                  const updatedCaseContent = caseContent.map((item) =>
                    item.id === content.id
                      ? { ...item, feedBack: e.target.value }
                      : item
                  );
                  setCaseContent(updatedCaseContent);
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  // }
  //     <tbody>
  //       {Array.isArray(caseContent) ? (
  //         caseContent.map((content) => (
  //           <tr
  //             key={content.id}
  //             className="hover:bg-gray-50 cursor-pointer text-gray text-center"
  //           >
  //             <td className="border border-gray-300 px-4 py-2">{content.id}</td>
  //             <td className="border border-gray-300 px-4 py-2">
  //               {content.caseType}
  //             </td>
  //             <td className="border border-gray-300 px-4 py-2">
  //               {content.userName}
  //             </td>
  //             <td className="border border-gray-300 px-4 py-2">
  //               {content.status}
  //             </td>
  //             <td className="border border-gray-300 px-4 py-2">
  //               {/* {content.completedOn.toLocaleString()} */}
  //             </td>
  //             <td className="border border-gray-300 px-4 py-2">Chat</td>
  //             <td className="border border-gray-300 px-4 py-2">
  //               {/* {content.feedBack} */}
  //             </td>
  //           </tr>
  //         ))
  //       ) : (
  //         <tr>
  //           <td colSpan={7}>No data available</td>
  //         </tr>
  //       )}
  //     </tbody>
  //   </table>
  // );
};

export default CaseDeatilsPage;
