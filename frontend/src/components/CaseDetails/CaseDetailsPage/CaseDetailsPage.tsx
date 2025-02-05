import React, { useEffect, useState } from "react";
import "../../CaseDetails/CaseDetailsPage/CaseDetailsPage.css";
import moment from "moment-timezone";
import MyDatePicker from "../../shared/DatePicker/MyDatePicker";
import { useNavigate } from "react-router-dom";
import "../../CaseDetails/CaseDetailsGrid/CaseDetailsTable.css";
import Modal from "react-modal";
//import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import userNameMapping from "../../../../public/userNameMapping.json";
import { LuCaseUpper } from "react-icons/lu";
// import ChatPage from "src/chat";
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
  status: string;
}

const CaseDetailsPage: React.FC<CaseDetailsPageProps> = ({
  caseId,
  isModalOpen,
  closeModal,
  status,
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

  const [feedbacks, setFeedbacks] = useState<FeedbackContent>({
    feedback: [],
    description: "",
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [estimatedDays, setEstimatedDays] = useState<number>(0);
  const [userOptions, setUserOptions] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCompltedDate, setSelectedCompletedDate] =
    useState<Date | null>(null);
  const [caseStatus, setCaseStatus] = useState<{ status: string }>({
    status: "",
  });
  const [alertMsg, setAlertMsg] = useState<boolean>(true);

  const [errorMsg, setErrorMsg] = useState<boolean>(false);
  const [SubmitButton, setSubmitButton] = useState<boolean>(false);

  const statusOptions = [
    { label: "OPEN", value: "OPEN" },
    { label: "RESOLVED", value: "RESOLVED" },
    { label: "IN_PROGRESS", value: "IN_PROGRESS" },
    { label: "RE_OPENED", value: "RE_OPENED" },
  ];

  const handleCaseTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedContent = { ...caseContent, caseType: event.target.value };
    setCaseContent(updatedContent);
  };
  const handleCaseTypeChangeTextArea = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
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
    setSubmitButton(true);
  };

  const handleCloseModal = () => {
    closeModal();
  };

  // useEffect(() => {
  //   fetchCaseContent(caseId);
  // }, []);

  useEffect(() => {
    LuCaseUpper;
  });

  useEffect(() => {
    fetchCaseContent(caseId);
    checkIsFeedBackAvailable(caseId);
  }, [isModalOpen]);

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

    if (caseContent.status !== "RESOLVED") {
      setSubmitButton(true);
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
      data[0].status !== "RESOLVED"
        ? setSubmitButton(true)
        : setSubmitButton(false);
      setCaseContent(data[0]);
      setSelectedDate(data[0].startedOn);
      setSelectedCompletedDate(data[0].completedOn);
      // setCaseStatus((prev) => ({ ...prev, status: data[0].status }));
      setCaseStatus(data[0].status);
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

  const checkIsFeedBackAvailable = async (caseId: number) => {
    const fetchFeedbacksByCaseId = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/CASE/feedback/${caseId}`,
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
        // const feedbackArray = data
        // Object.keys(data).map((key) =>
        // .map((feedback: any) => { });
        //console.error(" data:", data);

        setFeedbacks(data);

        console.log(" feedbacks data:", feedbacks);
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };
    fetchFeedbacksByCaseId();
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

  // const handleFeedbackClick = () => {
  //   // Navigate to CaseDetailsTable component
  //   window.location.href = `feedback?caseId=${caseId}`; // Correct path to CaseDetailsTable component with caseId
  // };

  const handleFeedbackClick = () => {
    // Navigate to CaseDetailsTable component
    window.location.href = `feedbackHistory?caseId=${caseId}`; // Correct path to CaseDetailsTable component with caseId
  };
  return (
    <>
      {isModalOpen && !loading && (
        <Modal
          className="react-modal"
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
              <h2 className="modal-title">Case-{caseId} Details</h2>
              <button onClick={closeModal} className="modal-close-button">
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="row rows">
                <div className="col-md-6 child">Description:</div>
                <div className="col-md-6 childc">
                  {/* <input
                    onChange={handleCaseTypeChange}
                    className="childs"
                    value={caseContent.caseType}
                    type="text"
                  /> */}

                  <textarea
                    maxLength={255}
                    onChange={handleCaseTypeChangeTextArea}
                    className="w-half h-20 border border-gray-300 p-2"
                    value={caseContent.caseType}
                  ></textarea>
                </div>
              </div>
              <div className="clear" />
              <div className="row rows">
                <div className="col-md-6 child">Assigned To:</div>

                <div className="col-md-6 childc">
                  <select
                    className="childs"
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
                </div>
              </div>
              <div className="clear" />
              <div className="row rows">
                <div className="col-md-6 child">Start Date:</div>

                <div className="col-md-6 childc">
                  <MyDatePicker
                    startedDt={selectedDate}
                    onChange={(selectedDate: Date | null) => {
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
                    }}
                  />
                </div>
              </div>
              <div className="clear" />

              <div className="row rows">
                <div className="col-md-6 child">Completion Date:</div>
                {errorMsg && (
                  <div
                    style={{ fontWeight: "bold", color: "red", float: "right" }}
                  >
                    {"Completion date must be greater than start date"}
                  </div>
                )}
                <div className="col-md-6 childc">
                  <MyDatePicker
                    completedOn={selectedCompltedDate}
                    onChange={(selectedCompltedDate: Date | null) => {
                      if (!selectedCompltedDate) {
                        setCaseContent((prev) => ({
                          ...prev,
                          completedOn: prev.completedOn,
                        }));
                      } else if (
                        selectedCompltedDate > new Date(caseContent.startedOn)
                      ) {
                        setCaseContent((prev) => ({
                          ...prev,
                          completedOn: selectedCompltedDate.toISOString(),
                        }));
                        setSelectedCompletedDate(selectedCompltedDate);
                      } else {
                        setErrorMsg(true);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="clear" />

              <div className="row rows">
                <div className="col-md-6 child">Estimated Days:</div>
                <div className="col-md-6 childc estimatedDays">
                  {estimatedDays}
                </div>
              </div>
              <div className="clear" />

              <div className="row rows">
                <div className="col-md-6 child">Status:</div>
                <div className="col-md-6 childc">
                  <select
                    className="childs"
                    value={caseContent.status}
                    onChange={handleStatusChange}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="clear" />
            </div>

            <div
              className="footer"
              style={{
                textAlign: "right",
                position: "relative",

                //right: "20px",
                //width: "calc(100% - 40px)",
              }}
            >
              {feedbacks.feedback ? (
                <button
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
                </button>
              ) : null}

              <button
                onClick={() => {
                  // Navigate to ChatPage component
                  window.location.href = "/chat";
                }}
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
              {SubmitButton ? (
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
              ) : (
                ""
              )}
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
