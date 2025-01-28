import React, { useEffect, useState } from "react";
import "../../CaseDetails/CaseDetailsPage/CaseDetailsPage.css";
import moment from "moment-timezone";
import MyDatePicker from "../../shared/DatePicker/MyDatePicker";
import "../../CaseDetails/CaseDetailsGrid/CaseDetailsTable.css";
import Modal from "react-modal";
import userNameMapping from "../../../../public/userNameMapping.json";
// import ChatPage from "src/chat";
import { useNavigate } from "react-router-dom";

interface CaseDetailsContent {
  id: number;
  chatId: number;
  caseType: string;
  status: string;
  completedOn: string;
  startedOn: string;
  userName: string;
  userId: number;
}

interface CaseDetailsPageProps {
  caseId: number;
  isModalOpen: boolean;
  closeModal: () => void;
}

const CaseDetailsPage: React.FC<CaseDetailsPageProps> = ({
  caseId,
  isModalOpen,
  closeModal,
}) => {
  const [caseContent, setCaseContent] = useState<CaseDetailsContent>({
    id: 0,
    chatId: 0,
    caseType: "",
    status: "",
    completedOn: "",
    startedOn: "",
    userName: "",
    userId: 0,
    // date: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [estimatedDays, setEstimatedDays] = useState<number>(0);
  const [userOptions, setUserOptions] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCompltedDate, setSelectedCompletedDate] =
    useState<Date | null>(null);

  const statusOptions = [
    { label: "OPEN", value: "OPEN" },
    { label: "RESOLVED", value: "RESOLVED" },
    { label: "IN_PROGRESS", value: "IN_PROGRESS" },
  ];

  const navigate = useNavigate();
  const handelGoToChat = () =>{
    navigate(`/chat/${caseId}`);
  }

  const handleCaseTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedContent = { ...caseContent, caseType: event.target.value };
    setCaseContent(updatedContent);
  };

  const handleAssignedToChange = (id: number) => {
    const updatedUser = { ...caseContent, userId: id };
    setCaseContent(updatedUser);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedContent = { ...caseContent, status: event.target.value };
    setCaseContent(updatedContent);
  };

  const handleCloseModal = () => {
    closeModal();
  };

  useEffect(() => {
    fetchCaseContent(caseId);
  }, [caseId]);

  useEffect(() => {
    const username = userNameMapping.find(
      (user) => user.id === caseContent.userId
    )?.name;
    if (username) setCaseContent((prev) => ({ ...prev, userName: username }));
  }, [caseContent.userId]);

  useEffect(() => {
    fetchUsersList();
  }, []);

  useEffect(() => {
    console.log(
      "startdate",
      caseContent.startedOn,
      "and completed date ",
      caseContent.completedOn
    );
    if (caseContent.startedOn && caseContent.completedOn) {
      const numberOfDays = moment(caseContent.completedOn).diff(
        moment(caseContent.startedOn),
        "days"
      );
      setEstimatedDays(numberOfDays);
    } else {
      setEstimatedDays(0); // or set a default message if needed
    }
  }, [selectedDate, selectedCompltedDate]);

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
      );
      const data = await response.json();
      setCaseContent(data[0]);
      setSelectedDate(data[0].startedOn);
      setSelectedCompletedDate(data[0].completedOn);
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

  const fetchUsersList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: "Basic " + btoa(`admin@test.com:admin123`),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users list");
      }

      const data = await response.json();
      const userOptionsData = data.map((user: any) => ({
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user.id,
      }));
      setUserOptions(userOptionsData);
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
      const { chatId, ...filteredCaseContent } = caseContent;
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

  const handleFeedbackClick = () => {
    // Navigate to CaseDetailsTable component
    window.location.href = `feedback?caseId=${caseId}`; // Correct path to CaseDetailsTable component with caseId
  };
  return (
    <>
      {isModalOpen && !loading && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
            content: {
              width: "630px",
              height: "560px",
              margin: "50px auto",
              padding: "20px",
              background: "linear-gradient(to bottom, #000000, #333333)",
              borderRadius: "10px",
            },
          }}
        >
          <div className="modal" key={caseId}>
            <div className="modal-header">
              <h1 className="modal-title">Case-{caseId} Details</h1>
              <button onClick={closeModal} className="modal-close-button">
                ×
              </button>
            </div>
            <div
              className="modal-content"
              style={{ display: "block", border: "none", color: "#fff" }}
            >
              <div key={caseId}>
                <div className="child">Description:</div>
                <input
                  onChange={handleCaseTypeChange}
                  className="childc"
                  value={caseContent.caseType}
                  type="text"
                />
                <div className="clear" />

                <div className="child">Assigned To:</div>
                <select
                  className="childc"
                  value={caseContent.userId}
                  onChange={(e) =>
                    handleAssignedToChange(Number(e.target.value))
                  }
                >
                  <option
                    key={""}
                    value={""}
                    // onClick={() => handleAssignedToChange(userName.id)}
                  >
                    {"Select User"}
                    {/* {caseContent.userName} */}
                  </option>
                  {userOptions.map((userName) => (
                    <option
                      key={userName.userId}
                      value={userName.userId}
                      // onClick={() => handleAssignedToChange(userName.id)}
                    >
                      {`${userName.firstName} ${userName.lastName}`}
                      {/* {caseContent.userName} */}
                    </option>
                  ))}
                </select>
                <div className="clear" />

                <div className="child">Start Date:</div>
                <MyDatePicker
                  startedDt={selectedDate}
                  onChange={
                    (selectedDate: Date | null) => {
                      // const updatedContent = {
                      //   ...caseContent,
                      //   startedOn: selectedDate,
                      // };
                      //setCaseContent(updatedContent);
                      if (!selectedDate) {
                        const updatedContent = {
                          ...caseContent,
                          startedOn: caseContent.startedOn,
                        };
                        setCaseContent(updatedContent);
                      } else {
                        const updatedContent = {
                          ...caseContent,
                          startedOn: selectedDate
                            ? selectedDate.toISOString()
                            : caseContent.startedOn,
                        };
                        setCaseContent(updatedContent);
                        setSelectedDate(selectedDate);
                      }
                    }
                    // onBlur={() => {
                    //   if (!selectedDate) {
                    //     const updatedContent = {
                    //       ...caseContent,
                    //       startedOn: caseContent.startedOn,
                    //     };
                    //     setCaseContent(updatedContent);
                    //   } else {
                    //     const updatedContent = {
                    //       ...caseContent,
                    //       startedOn: selectedDate
                    //         ? selectedDate.toISOString()
                    //         : caseContent.startedOn,
                    //     };
                    //     setCaseContent(updatedContent);
                    //   }
                    // }
                  }
                />
                <div className="clear" />

                <div className="clear" />
                <div className="child">Completion Date:</div>
                <MyDatePicker
                  completedOn={selectedCompltedDate}
                  onChange={
                    (selectedCompltedDate: Date | null) => {
                      // const updatedContent = {
                      //   ...caseContent,
                      //   startedOn: selectedDate,
                      // };
                      //setCaseContent(updatedContent);
                      if (!selectedCompltedDate) {
                        const updatedContent = {
                          ...caseContent,
                          completedOn: caseContent.completedOn,
                        };
                        setCaseContent(updatedContent);
                      } else {
                        const updatedContent = {
                          ...caseContent,
                          completedOn: selectedCompltedDate
                            ? selectedCompltedDate.toISOString()
                            : caseContent.startedOn,
                        };
                        setCaseContent(updatedContent);
                        setSelectedCompletedDate(selectedCompltedDate);
                      }
                    }
                    // onBlur={() => {
                    //   if (!selectedCompltedDate) {
                    //     const updatedContent = {
                    //       ...caseContent,
                    //       completedOn: caseContent.completedOn,
                    //     };
                    //     setCaseContent(updatedContent);
                    //   } else {
                    //     const updatedContent = {
                    //       ...caseContent,
                    //       completedOn: selectedCompltedDate
                    //         ? selectedCompltedDate.toISOString()
                    //         : caseContent.startedOn,
                    //     };
                    //     setCaseContent(updatedContent);
                    //   }
                    // }
                  }
                />
                <div className="clear" />

                <div className="child">Estimated Days:</div>
                <div className="childc estimatedDays">{estimatedDays}</div>
                <div className="clear" />

                <div className="child">Status</div>
                <select
                  className="childc"
                  value={caseContent.status}
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
              {/*<button
                onClick={handleFeedbackClick}
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "30px",
                  marginRight: "10px",
                }}
              >
                FeedBack
              </button>*/}

              <button
                onClick={submitDate}
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "30px",
                  marginRight: "10px",
                }}
              >
                Submit
              </button>
              <button
                onClick={handelGoToChat}
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "30px",
                  marginRight: "10px",
                }}
              >
                Go to Chat
              </button>
              <button
                onClick={handleCloseModal}
                style={{
                  backgroundColor: "#007bff",
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
        </Modal>
      )}
    </>
  );
};

export default CaseDetailsPage;
