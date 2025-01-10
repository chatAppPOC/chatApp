import React, { useEffect, useState } from "react";
import "../../CaseDetails/CaseDeatilsPage/CaseDeatilsPage.css";
import moment from "moment-timezone";
import MyDatePicker from "../../../../src/components/shared/DatePicker/MyDatePicker"; // Adjust the import path as necessary
import "../../CaseDetails/CaseDetailsGrid/CaseDetailsTable.css";
import Modal from "react-modal";

interface CaseDetailsContent {
  id: number;
  chatId: number;
  caseType: string;
  status: string;
  completedOn: string;
  startedOn: string;
  userName: string;
  feedback: string;
}

interface CaseDeatilsPageProps {
  caseId: number;
  isModalOpen: boolean;
  closeModal: () => void;
}

const CaseDeatilsPage: React.FC<CaseDeatilsPageProps> = ({
  caseId,
  isModalOpen,
  closeModal,
}) => {
  const [caseDetails, setCaseDetails] = useState<CaseDetailsContent[]>([]);

  useEffect(() => {
    fetch(`https://localhost:7171/api/CaseDetails/${caseId}`)
      .then((response) => response.json())
      .then((data) => setCaseDetails(data))
      .catch((error) => console.error("Error fetching case details:", error));
  }, [caseId]);
  const userOptions = [
    { label: "Testuser1", value: "user1" },
    { label: "TestUser2", value: "user2" },
    { label: "Testuser3", value: "user3" },
  ];

  // const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  const statusOptions = [
    { label: "OPEN", value: "OPEN" },
    { label: "RESOLVED", value: "RESOLVED" },
    { label: "IN_PROGRESS", value: "IN_PROGRESS" },
  ];

  const [caseType, setCaseType] = useState<string>("");
  const [completedDate, setCompletedDate] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [caseContent, setCaseContent] = useState<CaseDetailsContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [estimatedDays, setEstimatedDays] = useState<number>();

  const handleCaseTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const updatedContent = caseContent.map((item) =>
      item.id === id ? { ...item, caseType: event.target.value } : item
    );
    setCaseContent(updatedContent);
  };

  const handleAssignedToChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setAssignedTo(event.target.value);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
  };

  const getFormattedDate = (date: string | null | undefined): string | null => {
    if (!date) {
      return null;
    }
    try {
      const timestampInPDT = moment(date).tz("America/Los_Angeles");
      const format = "MMM DD YYYY hh:mm:ss a z";
      return timestampInPDT
        .format(format)
        .replace(/\bam\b/, "AM")
        .replace(/\bpm\b/, "PM");
    } catch (error) {
      console.error("Error formatting date:", error);
      return null;
    }
  };

  const handleCloseModal = () => {
    closeModal();
  };

  useEffect(() => {
    fetchCaseContent(caseId);
  }, [caseId]);

  const fetchCaseContent = async (caseno: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8080/api/case?caseId=${caseno}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: "Basic " + btoa(`admin@test.com:admin123`),
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setCaseContent(data);
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const submitDate = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    event.preventDefault();
    try {
      const filteredCaseContent = caseContent.map(
        ({ feedback, chatId, ...rest }) => rest
      );

      const response = await fetch(`http://localhost:8080/api/case/re-assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: "Basic " + btoa(`admin@test.com:admin123`),
        },
        body: JSON.stringify(filteredCaseContent),
      });

      if (!response.ok) {
        throw new Error("Failed to update case details");
      }

      const result = await response.json();
      console.log("Case details updated successfully:", result);
      closeModal();
    } catch (error) {
      console.error("Error updating case details:", error);
    }
  };
  return (
    <>
      {isModalOpen && !loading && (
        <Modal
          isOpen={isModalOpen} // or false, depending on your logic
          onRequestClose={closeModal}
          // className="w-1/4 bg-gradient-to-br from-blue-500 to-blue-700"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
            content: {
              width: "630px",
              height: "560px",
              margin: "50px auto",
              padding: "20px",
              //backgroundColor: "#000000",
              background: "linear-gradient(to bottom, #000000, #333333)",
              //border: "1px solid #ddd",
              borderRadius: "10px",
              // boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <>
            {caseContent.map((content) => (
              <div className="modal" key={content.id}>
                <div className="modal-header">
                  <h1 className="modal-title">Case-{content.id} Deatils</h1>
                  <button onClick={closeModal} className="modal-close-button">
                    ×
                  </button>
                </div>
                <div
                  className="modal-content"
                  style={{ display: "block", border: "none", color: "#fff" }}
                >
                  <div key={content.id}>
                    {/* <div className="child">Case Id:</div>
                  <div className="childc">{content.id}</div>
                  <div className="clear" /> */}

                    <div className="child">Description:</div>

                    <input
                      onChange={(event) =>
                        handleCaseTypeChange(event, content.id)
                      }
                      className="childc"
                      value={content.caseType}
                      type="text"
                    />

                    <div className="clear" />

                    <div className="child">Assigned To:</div>

                    <select
                      className="childc"
                      value={content.userName}
                      onChange={handleAssignedToChange}
                    >
                      {userOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="clear" />
                    <div className="child">Start Date:</div>

                    <MyDatePicker
                      selectedDate={content.startedOn}
                      onChange={(date) => {
                        const updatedContent = caseContent.map((item) =>
                          item.id === content.id
                            ? { ...item, startedOn: date }
                            : item
                        );
                        setCaseContent(updatedContent);
                        setStartDate(date);
                      }}
                    />

                    <div className="clear" />

                    <div className="child">Completion Date:</div>

                    <MyDatePicker
                      completedOn={content.completedOn}
                      onChange={(date) => {
                        const updatedContent = caseContent.map((item) =>
                          item.id === content.id
                            ? { ...item, completedOn: date }
                            : item
                        );
                        setCaseContent(updatedContent);
                        setCompletedDate(date);
                        const estimatedDaysElement =
                          document.querySelector(".estimatedDays");
                        if (estimatedDaysElement) {
                          estimatedDaysElement.textContent = moment(
                            completedDate
                          )
                            .diff(moment(startDate), "days")
                            .toString();
                        }

                        // Update estimated days

                        const estimatedDays = moment(completedDate).diff(
                          moment(startDate),
                          "days"
                        );
                        // const updatedContentWithDays = updatedContent.map(
                        //   (item) =>
                        //     item.id === content.id
                        //       ? { ...item, estimatedDays }
                        //       : item
                        // );
                        //setCaseContent(updatedContentWithDays);

                        setEstimatedDays(estimatedDays);
                      }}
                    />

                    <div className="clear" />

                    <div className="child">Estimated Days:</div>
                    <div className="childc estimatedDays"></div>

                    <div className="clear" />

                    <div className="child">Status</div>
                    <select
                      className="childc"
                      value={content.status}
                      onChange={handleStatusChange}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <div className="clear" />
                  </div>
                </div>
                <div className="footer" style={{ textAlign: "right" }}>
                  <button
                    onClick={submitDate}
                    style={{
                      backgroundColor: "#007bff", // Primary color
                      color: "#fff",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginTop: "30px",
                      marginRight: "10px", // Add margin to the right
                    }}
                  >
                    Submit
                  </button>
                  <button
                    onClick={handleCloseModal}
                    style={{
                      backgroundColor: "#007bff", // Primary color
                      color: "#fff",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginTop: "30px",
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            ))}
          </>
        </Modal>
      )}
    </>
  );
};
export default CaseDeatilsPage;
