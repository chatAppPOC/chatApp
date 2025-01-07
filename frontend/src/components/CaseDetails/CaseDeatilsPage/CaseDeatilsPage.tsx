import React, { useEffect, useState } from "react";
import "../../CaseDetails/CaseDeatilsPage/CaseDeatilsPage.css";
import moment from "moment-timezone";

interface CaseDetailsContent {
  id: number;
  caseType: string;
  status: string;
  completedOn: string;
  userName: string;
  feedback: string;
}

interface CaseDeatilsPageProps {
  caseId: number;
}

const CaseDeatilsPage: React.FC<CaseDeatilsPageProps> = ({ caseId }) => {
  const userOptions = [
    { label: "Testuser1", value: "user1" },
    { label: "TestUser2", value: "user2" },
    { label: "Testuser3", value: "user3" },
  ];

  const Statusoptions = [
    { label: " OPEN", value: " OPEN" },
    { label: "RESOLVED", value: "RESOLVED" },
    { label: "IN_PROGRESS", value: "IN_PROGRESS" },
  ];

  const [value, setValue] = useState("");
  const [caseContent, setCaseContent] = useState<CaseDetailsContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [caseType, setCaseType] = useState<string>("");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const handleCaseTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("value", e.target.value);
    setCaseType(e.target.value);
  };
  const handlSelectUserChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    console.log("assigned user value", event.target.value);
    setAssignedTo(event.target.value);
  };

  const handlSelectStatusChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    console.log("status value", event.target.value);
    setStatus(event.target.value);
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
        const response = await fetch(
          "http://localhost:8080/api/case?caseId=" + caseId
        );
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
    <>
      <div
        className="modal-content"
        style={{ display: "block", border: "none", color: "#fff" }}
      >
        {caseContent.map((content) => (
          <div>
            <div className="child">Case Id:</div>
            <div className="childc">{content.id}</div>
            <div className="clear" />

            <div className="child">Description:</div>

            <input
              type="text"
              className="childc"
              value={content.caseType}
              onChange={(e) => handleCaseTypeChange(e)}
            />

            <div className="clear" />
            {/* <div className="childc">{content.caseType}</div>
            <div className="clear" /> */}

            <div className="child">Assigned To:</div>

            <select
              className="childc"
              value={content.userName}
              onChange={handlSelectUserChange}
            >
              {userOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="clear" />

            <div className="child">Completion Date:</div>
            <div className="childc">
              {getFormattedDate(content.completedOn)}
            </div>
            <div className="clear" />

            <div className="child">Estimated resolution Date:</div>
            <div className="childc">2</div>
            <div className="clear" />

            <div className="child">Status</div>
            <select
              className="childc"
              value={content.status}
              onChange={handlSelectStatusChange}
            >
              {Statusoptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="clear" />
          </div>
        ))}
      </div>
    </>
  );
  // }
  //     <tbody>
  //       {Array.isArray(caseContent) ? (
  //         caseContent.map((content) => (
  //           <tr
  //             key={content.id}
  //             classNameName="hover:bg-gray-50 cursor-pointer text-gray text-center"
  //           >
  //             <td classNameName="border border-gray-300 px-4 py-2">{content.id}</td>
  //             <td classNameName="border border-gray-300 px-4 py-2">
  //               {content.caseType}
  //             </td>
  //             <td classNameName="border border-gray-300 px-4 py-2">
  //               {content.userName}
  //             </td>
  //             <td classNameName="border border-gray-300 px-4 py-2">
  //               {content.status}
  //             </td>
  //             <td classNameName="border border-gray-300 px-4 py-2">
  //               {/* {content.completedOn.toLocaleString()} */}
  //             </td>
  //             <td classNameName="border border-gray-300 px-4 py-2">Chat</td>
  //             <td classNameName="border border-gray-300 px-4 py-2">
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
