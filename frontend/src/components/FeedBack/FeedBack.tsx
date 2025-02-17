import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./FeedBack.css";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { generateBasicAuthHeader } from "src/utils/basicAuth";
import { toast } from "sonner";

Modal.setAppElement("#root");

function Spinner() {
  return (
    <div className="spinner-overlay fixed inset-0 flex justify-center items-center bg-white bg-opacity-75">
      <div className="spinner-container flex flex-col justify-center items-center">
        <FaSpinner className="spinner-icon animate-spin text-4xl" />
        <div className="ml-2 mt-2">Loading...</div>
      </div>
    </div>
  );
}

const FeedBack: React.FC = () => {
  const [searchParams] = useSearchParams();
  console.log("get case id from location url ", searchParams.get("chatId"));
  const chatId = searchParams.get("chatId");
  const caseId = searchParams.get("caseId");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedbackData, setFeedbackData] = useState<any[]>([]);
  let count = 0;

  useEffect(() => {
    // Fetch feedback question and answers from API
    const fetchFeedbackData = async () => {
      //  setLoading(true); // Start spinner
      try {
        const response = await fetch(
          `http://localhost:8080/api/feedback/content`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              // Authorization: "Basic " + btoa(`admin@test.com:admin123`),
              ...generateBasicAuthHeader(),
            },
          }
        );
        const data = await response.json();
        console.log(" feedback data:", data);
        setFeedbackData(data);
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };

    fetchFeedbackData();
  }, []);

  const Navigate = useNavigate();
  const handleSubmit = () => {
    // Simulate a successful submission

    setIsSubmitted(true);

    const feedbackGiven = localStorage.getItem("feedbackGiven");
    if (feedbackGiven === "true") {
      Navigate(`/chat`);
      return;
    }
  };

  const closeModal = () => {
    setIsSubmitted(false);
  };

  const [comments, setComments] = useState("");

  const onFeedbackSubmit = async () => {
    window.scrollTo(0, 0);
    setLoading(true); // Show loader
    const selectedFeedback = feedbackData.filter((_, index) =>
      [0, 5, 7, 8, 9].includes(index)
    );
    const payload = {
      //playerFeedbackComments: comments?.value || "",
      issueResolved: true,
      playerFeedbackComments:
        (
          document.querySelector(
            `textarea[name="comments"]`
          ) as HTMLTextAreaElement
        )?.value || "",
      questionAndAnswer: selectedFeedback.map((course) => {
        const selectedAnswer = document.querySelector(
          `input[name="question-${course.id}"]:checked`
        ) as HTMLInputElement;

        return {
          question: course.content,
          answer: selectedAnswer
            ? selectedAnswer.parentElement?.textContent?.trim()
            : null,
          score: selectedAnswer
            ? course.answers.find(
                (answer: any) => answer.id == selectedAnswer.value
              )?.score || "0"
            : "0",
        };
      }),
    };

    if (chatId) {
      console.log("chatId", chatId);
      try {
        const response = await fetch(
          `http://localhost:8080/api/CHAT/feedback/${chatId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              ...generateBasicAuthHeader(),
            },
            body: JSON.stringify(payload),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to submit feedback");
        }
        handleSubmit();
      } catch (error) {
        console.error("Error submitting feedback:", error);
        toast.error("Error submitting feedback");
      }
    }

    if (caseId) {
      console.log("caseId", caseId);

      try {
        const response = await fetch(
          `http://localhost:8080/api/CASE/feedback/${caseId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              ...generateBasicAuthHeader(),
            },
            body: JSON.stringify(payload),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to submit feedback");
        }
        handleSubmit();
      } catch (error) {
        toast.error("Error submitting feedback");
        console.error("Error submitting feedback:", error);
      }
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto  m-10">
      <h1 className="text-4xl font-bold mb-4 text-center">Chat Feedback</h1>
      <div>
        {loading && <Spinner />}
        {feedbackData ? (
          feedbackData
            .filter((_, index) => [0, 5, 7, 8, 9].includes(index))
            .map((course) => (
              <div
                className="feedbackSection bg-white p-4 rounded-lg shadow-sm my-4"
                key={course.id}
              >
                <h3 className="text-lg font-semibold mb-2">
                  Question {course.id}
                </h3>
                <p className="mb-4">{course.content}</p>
                <h4 className="text-md font-medium mb-2">Choose the Answer</h4>
                <div className="flex flex-wrap">
                  {course.answers.map((answer: any) => (
                    <label
                      key={answer.id}
                      className="flex items-center mr-4 mb-2"
                    >
                      <input
                        type="radio"
                        name={`question-${course.id}`}
                        value={answer.id}
                        className="mr-2"
                      />
                      {answer.content}
                    </label>
                  ))}
                </div>
              </div>
            ))
        ) : (
          <p>Loading feedback data...</p>
        )}
        <div>
          <h4 className="text-md font-medium mb-2">Comments</h4>
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            rows={4}
            name="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          ></textarea>
        </div>

        {isSubmitted && (
          <div className="feedbackPopup fixed inset-0 flex justify-center items-center bg-green-500 text-white p-4 text-center">
            <div className="flex flex-col items-center">
              <p>Your feedback has been submitted successfully.</p>
              <button
                onClick={closeModal}
                className="mt-2 bg-blue-500 text-white p-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="">
        <button
          onClick={onFeedbackSubmit}
          className="bg-blue-500 fixed bottom-3 right-4  text-white p-2 rounded"
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default FeedBack;
