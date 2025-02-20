import React, { useState, useEffect } from "react";
import Loader from "../../../components/Loader";
import { getFeedbackById } from "@/api";

import AlertMessage from "../../../components/AlertError";
import { Card } from "../../../components/ui/card";

import { Label } from "../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Separator } from "../../../components/ui/separator";

interface FeedbackContent {
  feedback?: any[];
  description?: string;
  id?: string;
}

const FeedbackHistoryByCaseId: React.FC = (props: any) => {
  const [feedbacks, setFeedbacks] = useState<FeedbackContent>({
    feedback: [],
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackNotAvailable, setFeedbackNotAvailable] = useState("");

  const caseId = props.id;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getFeedbackById("CASE", caseId);
        setFeedbacks(data);
      } catch (error) {
        setFeedbackNotAvailable("Feedback not available");
        console.error("Error fetching feedback data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <Loader />;

  if (feedbackNotAvailable) {
    return <AlertMessage>{feedbackNotAvailable}</AlertMessage>;
  }

  return (
    <Card className="p-5">
      <h1 className="text-xl font-semibold mb-4">
        User Feedback for Case Id : {caseId}
      </h1>

      <div className="space-y-5">
        {feedbacks?.feedback?.map((item, index) => (
          <div key={index} className="space-y-5">
            <Label>{item.question}</Label>
            <RadioGroup defaultValue={item.answer} disabled>
              {item?.responses?.map((data) => (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={data} id={`r${data}`} />
                  <Label htmlFor={`r${data}`}>{data}</Label>
                </div>
              ))}
            </RadioGroup>
            <Separator />
          </div>
        ))}
      </div>

      <div className="pb-4 my-4">
        <h4 className="text-md font-medium mb-2">Comments</h4>
        <div>{feedbacks?.description || "--"}</div>
      </div>
    </Card>
  );
};

export default FeedbackHistoryByCaseId;
