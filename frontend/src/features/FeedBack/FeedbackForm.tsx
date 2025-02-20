import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";

interface FeedbackQuestion {
  question: string;
  responses: {
    [key: string]: number;
  };
}

interface FeedbackFormData {
  playerFeedbackComments: string;
  issueResolved: boolean;
  questionAndAnswer: {
    question: string;
    answer: string;
    score: number;
    responses: string[];
  }[];
}

interface FeedbackFormProps {
  feedbackType: string;
  feedbackContent: FeedbackQuestion[];
  onSubmit: (data: FeedbackFormData) => void;
}

export default function FeedbackForm({
  feedbackType,
  feedbackContent,
  onSubmit,
}: FeedbackFormProps) {
  const [comments, setComments] = useState("");
  const [issueResolved, setIssueResolved] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});

  const handleAnswerChange = (question: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [question]: answer,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const questionAndAnswer = feedbackContent.map((item) => {
      const selectedAnswer = selectedAnswers[item.question] || "";
      const score = item.responses[selectedAnswer] || 0;
      const responses = Object.keys(item.responses).sort(
        (a, b) => item.responses[b] - item.responses[a]
      );

      return {
        question: item.question,
        answer: selectedAnswer,
        score,
        responses,
      };
    });

    const formData: FeedbackFormData = {
      playerFeedbackComments: comments,
      issueResolved,
      questionAndAnswer,
    };

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Feedback Form</CardTitle>
          <CardDescription>
            Please provide your feedback to help us improve our service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {feedbackType == "CASE" && (
            <div className="space-y-3">
              <Label>Was your issue resolved?</Label>
              <CardDescription>
                Please let us know if the chat was able to resolve your issue.
                If you select "No", Case will be reopened.
              </CardDescription>
              <RadioGroup
                value={issueResolved ? "yes" : "no"}
                onValueChange={(value) => setIssueResolved(value === "yes")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="issue-resolved-yes" />
                  <Label htmlFor="issue-resolved-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="issue-resolved-no" />
                  <Label htmlFor="issue-resolved-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {feedbackContent.map((item, index) => (
            <div key={index} className="space-y-3">
              <Label>{item.question}</Label>
              <RadioGroup
                onValueChange={(value) =>
                  handleAnswerChange(item.question, value)
                }
                value={selectedAnswers[item.question]}
              >
                {Object.entries(item.responses)
                  .sort(([, a], [, b]) => b - a)
                  .map(([response], responseIndex) => (
                    <div
                      key={responseIndex}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={response}
                        id={`${index}-${responseIndex}`}
                      />
                      <Label htmlFor={`${index}-${responseIndex}`}>
                        {response}
                      </Label>
                    </div>
                  ))}
              </RadioGroup>
            </div>
          ))}

          <div className="space-y-3">
            <Label>Additional Comments</Label>
            <Textarea
              placeholder="Please share any additional feedback..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Submit Feedback
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
