import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import { fetchFeedbackData, postFeedback } from "@/api";

import { Button } from "../../components/ui/button";
import FeedbackForm from "./FeedbackForm";
import { getUserInfo } from "@/lib/utils";
import Loader from "../../components/Loader";

const FeedBack: React.FC = () => {
  const [searchParams] = useSearchParams();
  const chatId = searchParams?.get("chatId");
  const caseId = searchParams?.get("caseId");
  const [feedbackData, setFeedbackData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = getUserInfo();
  const navigate = useNavigate();

  const [feedbackNotAvailable, setFeedbackNotAvailable] = useState(false);

  const feedbackType = caseId ? "CASE" : "CHAT";
  const getData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchFeedbackData(
        feedbackType,
        userInfo?.title,
        userInfo?.preferredLanguage
      );
      if (!data.content) throw new Error("Feedback data not available");
      setFeedbackData(data.content || []);
    } catch (error) {
      setFeedbackNotAvailable(true);
      console.error("Error fetching feedback data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const Navigate = useNavigate();
  const handleSubmit = () => {
    toast.success("Feedback submitted successfully");
    Navigate(`/chat`);
  };

  const onFeedbackSubmit = async (data: any) => {
    window.scrollTo(0, 0);
    setIsLoading(true); // Show loader
    const payload = {
      playerFeedbackComments: data.playerFeedbackComments,
      issueResolved: data.issueResolved,
      questionAndAnswer: data.questionAndAnswer,
    };
    const id = feedbackType === "CASE" ? caseId : chatId;
    try {
      await postFeedback(feedbackType, id, payload);
      handleSubmit();
    } catch (error) {
      console.error("Error posting feedback:", error);
      toast.error("Error posting feedback");
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (feedbackNotAvailable) {
    return (
      <div className="w-full py-24 flex flex-col gap-5 items-center justify-center ">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md space-y-10">
          <p className="text-red-600">
            Sorry, Feedback not available at the moment
          </p>
        </div>
        <Button onClick={() => navigate("/")} variant="outline">
          Go Home
        </Button>
      </div>
    );
  }

  if (feedbackData) {
    return (
      <div className="container mx-auto max-w-4xl  m-10 space-y-10">
        <h1 className="text-4xl font-bold mb-4 text-center">Chat Feedback</h1>
        <FeedbackForm
          feedbackType={feedbackType}
          feedbackContent={feedbackData}
          onSubmit={onFeedbackSubmit}
        />
      </div>
    );
  }
};

export default FeedBack;
