import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface FeedbackContent {
  feedback?: any[];
  description?: string;
}

const FeedbackHistoryByCaseId: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackContent>({
    feedback: [],
    description: "",
  });
  const location = useLocation();
  const { gameName, desc } = location.state || {}; // Handle undefined state

  const queryParams = new URLSearchParams(location.search);
  const caseId = queryParams.get("caseId");
  console.log(
    "get case id from location url ",
    caseId,
    gameName,
    desc,
    location.state
  );

  // const [feedbackData, setFeedbackData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    // Fetch feedbacks by caseId from API
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
        console.log(" data:", data);

        // Object.values(data).forEach((feedback: any) => {
        //   console.log(" feedback:", feedback);
        //   setFeedbacks(feedback);
        // });

        // const data = await response.json();
        // console.error(" feedback data:", data);
        setFeedbacks(data);
        console.log(" feedbacks data:", data);
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };
    fetchFeedbacksByCaseId();
  }, []);

  // useEffect(() => {
  //   // Fetch feedback question and answers from API
  //   const fetchFeedbackData = async () => {
  //     //  setLoading(true); // Start spinner
  //     try {
  //       const response = await fetch(
  //         `http://localhost:8080/api/feedback/content`,
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //             "Access-Control-Allow-Origin": "*",
  //             // Authorization: "Basic " + btoa(`admin@test.com:admin123`),
  //             Authorization: "Basic " + btoa(`player@test.com:player123`),
  //           },
  //         }
  //       );
  //       const data = await response.json();
  //       console.error(" feedback data:", data);
  //       setFeedbackData(data);
  //     } catch (error) {
  //       console.error("Error fetching feedback data:", error);
  //     }
  //   };

  //   fetchFeedbackData();
  // }, []);
  return (
    <>
      <h2>Feedback History</h2>
      <br></br>
      <h1>
        <b>
          Cased Id: 1- {gameName}-{desc}
        </b>
      </h1>

      {feedbacks ? (
        <>
          {feedbacks.feedback?.map((desc: any, index: number) => (
            <div
              className="feedbackSection bg-gray-100 p-4 rounded shadow-md my-4"
              key={index}
            >
              <h3 className="text-lg font-semibold mb-2">
                Question {index + 1}
              </h3>
              <p className="mb-4">{desc.question}</p>
              <h4 className="text-md font-medium mb-2">Selected Answer</h4>
              <div className="flex flex-wrap">
                {desc.responses.map((options: any, optionIndex: number) => (
                  <label
                    key={optionIndex}
                    className="flex items-center mr-4 mb-2"
                  >
                    <input
                      type="radio"
                      name={`question-${index + 1}`}
                      value={optionIndex}
                      className="mr-2"
                      checked={
                        desc.answer?.toLowerCase() ===
                        options?.toString().toLowerCase()
                      }
                      disabled={
                        desc.answer?.toLowerCase() !==
                        options?.toString().toLowerCase()
                      }
                      style={{ accentColor: "grey" }} // Remove default blue color
                    />
                    {options}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div>
            {feedbacks?.description && (
              <>
                <h4 className="text-md font-medium mb-2">Comments</h4>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded"
                  rows={4}
                  name="comments"
                  value={feedbacks.description}
                  readOnly
                ></textarea>
              </>
            )}
          </div>
          <button
            className="fixed bottom-0 right-4 bg-blue-500 text-white p-2 rounded"
            style={{ width: 100 }} // Remove default blue color
            onClick={() => window.history.back()}
          >
            Back
          </button>
        </>
      ) : (
        <p>Loading feedback data...</p>
      )}
    </>
  );
};

export default FeedbackHistoryByCaseId;
