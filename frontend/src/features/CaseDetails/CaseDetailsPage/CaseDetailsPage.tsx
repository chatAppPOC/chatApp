import React, { useEffect, useState } from "react";
import "../../CaseDetails/CaseDetailsPage/CaseDetailsPage.css";
import moment from "moment-timezone";
import MyDatePicker from "../../../components/shared/DatePicker/MyDatePicker";
import { useNavigate, useParams } from "react-router-dom";
// import "../../CaseDetails/CaseDetailsGrid/CaseDetailsTable.css";
import userNameMapping from "../../../../public/userNameMapping.json";
import FeedbackHistoryByCaseId from "@/features/CaseDetails/CaseDetailsPage/FeedBackHistoryByCaseId";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// import ChatPage from "src/chat";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { generateBasicAuthHeader } from "@/utils/basicAuth";
import { toast } from "sonner";
import { TabsList, TabsTrigger, TabsContent, Tabs } from "@/components/ui/tabs";
import CaseChatHistory from "./CaseChatHistory";
import { getAllUsers, getCaseById } from "@/api";
import BackButton from "@/components/back_button";
interface CaseDetailsContent {
  id: number;
  chatId: number;
  caseType: string;
  status: string;
  completedOn: string;
  startedOn: string;
  reopenedOn: string | null;
  userName: string;
  userId: number;
  title: number;
}

interface Title {
  id: number;
  name: string;
}

//test
const CaseDetailsPage = (props) => {
  const [caseContent, setCaseContent] = useState<CaseDetailsContent>({
    id: 0,
    chatId: 0,
    caseType: "",
    status: "",
    completedOn: "",
    startedOn: "",
    reopenedOn: "",
    userName: "",
    userId: 0,
    // date: "",
    title: 0,
  });

  const params = useParams();
  const caseId = params.caseId || props.caseId;
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [estimatedDays, setEstimatedDays] = useState<number>(0);
  const [userOptions, setUserOptions] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [reopenDate, setReopenDate] = useState<Date | null>(null);
  const [selectedCompltedDate, setSelectedCompletedDate] =
    useState<Date | null>(null);
  const [caseStatus, setCaseStatus] = useState<{ status: string }>({
    status: "",
  });
  const [alertMsg, setAlertMsg] = useState<boolean>(true);

  const [errorMsg, setErrorMsg] = useState<boolean>(false);
  const [SubmitButton, setSubmitButton] = useState<boolean>(false);
  const [reopened, setReopend] = useState<boolean>(false);

  const statusOptions = [
    { label: "OPEN", value: "OPEN" },
    { label: "RESOLVED", value: "RESOLVED" },
    { label: "IN_PROGRESS", value: "IN_PROGRESS" },
    { label: "RE_OPENED", value: "RE_OPENED" },
  ];

  const navigate = useNavigate();

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

  const handleStatusChange = (value: string) => {
    if (value === "RE_OPENED") {
      const newReopnedDate = new Date().toISOString().split("T")[0];
      // const newReopnedDate = new Date().toLocaleDateString("en-US");
      console.log("currnt date", new Date().toISOString().split("T")[0]);
      setReopenDate(new Date(newReopnedDate));
      const updatedContent = {
        ...caseContent,
        status: value,
        reopenedOn: newReopnedDate ? newReopnedDate.toString() : null,
        completedOn: null,
      };

      console.log("updatedContent, ", updatedContent);
      setCaseContent(updatedContent);

      setReopend(true);
    } else {
      const updatedContent = { ...caseContent, status: value };
      setCaseContent(updatedContent);
    }
    setSubmitButton(true);
  };

  useEffect(() => {
    fetchCaseContent(caseId);
  }, []);

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
    if (
      caseContent.startedOn &&
      caseContent.completedOn &&
      !caseContent.reopenedOn
    ) {
      const numberOfDays = moment(caseContent.completedOn).diff(
        moment(caseContent.startedOn),
        "days"
      );
      if (numberOfDays >= 0) {
        setEstimatedDays(numberOfDays);
      } else {
        setErrorMsg(true);
        const updatedContent = { ...caseContent, completedOn: "" };
        setCaseContent(updatedContent);
      }
    } else if (
      caseContent.startedOn &&
      caseContent.reopenedOn &&
      caseContent.completedOn
    ) {
      const formattedReopenedOn = moment(caseContent.reopenedOn).format(
        "MM/DD/YYYY"
      );
      const formattedCompletedOn = moment(caseContent.completedOn).format(
        "MM/DD/YYYY"
      );
      console.log(
        `Reopened On: ${formattedReopenedOn}, Completed On: ${formattedCompletedOn}`
      );
      const numberOfDays = moment(formattedCompletedOn).diff(
        moment(formattedReopenedOn),
        "days"
      );
      if (numberOfDays >= 0) {
        setEstimatedDays(numberOfDays);
      } else {
        setErrorMsg(true);
        const updatedContent = { ...caseContent, completedOn: "" };
        setCaseContent(updatedContent);
      }
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
      let data = await getCaseById(caseno);
      data = data;
      console.log("data", data);

      data.status !== "RESOLVED"
        ? setSubmitButton(true)
        : setSubmitButton(false);
      setCaseContent(data);
      setSelectedDate(data.startedOn);
      setSelectedCompletedDate(data.completedOn);
      // setCaseStatus((prev) => ({ ...prev, status: data.status }));
      setCaseStatus(data.status);
      setReopenDate(data.reopenedOn);
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
      const data = await getAllUsers();
      const userOptionsData = data.map((user: any) => ({
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user.id,
        hasUserRole: user.roles.some((role: any) => role.name === "USER"),
      }));
      console.log("userOptionsData", userOptionsData);
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
      console.log("caseContent", caseContent);
      const { chatId, ...filteredCaseContent } = caseContent;
      const response = await fetch(`http://localhost:8080/api/case/re-assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          ...generateBasicAuthHeader(),
        },
        body: JSON.stringify(filteredCaseContent),
      });

      if (!response.ok) {
        throw new Error("Failed to update case details");
      }

      const result = await response.json();
      if (props.refresh) props.refresh();
      console.log("Case details updated successfully:", result);
      toast.success("Case details updated successfully");
    } catch (error) {
      console.error("Error updating case details:", error);
      toast.error("Error updating case details");
    }
  };

  return (
    <div className="h-full   ">
      <Tabs defaultValue="details" className="">
        <TabsList className="">
          <TabsTrigger value="details">Case Details</TabsTrigger>
          <TabsTrigger value="history">Chat History</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <div className="h-[80vh] overflow-y-auto">
          <TabsContent value="details" className="">
            <div className="p-10">
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 items-start">
                  <label className="text-sm font-medium text-right col-span-3 pt-2">
                    Description:
                  </label>
                  <div className="col-span-9">
                    <Textarea
                      maxLength={255}
                      onChange={handleCaseTypeChangeTextArea}
                      className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      value={caseContent.caseType}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 items-center">
                  <label className="text-sm font-medium text-right col-span-3">
                    Assigned To:
                  </label>
                  <div className="col-span-9">
                    <Select
                      value={caseContent.userId}
                      onValueChange={(e) => handleAssignedToChange(Number(e))}
                    >
                      <SelectTrigger className="w-[280px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {userOptions
                          .filter((userName) => userName.hasUserRole)
                          .map((userName) => (
                            <SelectItem
                              key={userName.userId}
                              value={userName.userId}
                            >
                              {`${userName.firstName} ${userName.lastName}`}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 items-center">
                  <label className="text-sm font-medium text-right col-span-3">
                    Start Date:
                  </label>
                  <div className="col-span-9">
                    <MyDatePicker
                      startedDt={selectedDate}
                      onChange={(selectedDate: Date | null) => {
                        if (!selectedDate) {
                          setCaseContent({
                            ...caseContent,
                            startedOn: caseContent.startedOn,
                          });
                        } else {
                          setCaseContent({
                            ...caseContent,
                            startedOn: selectedDate.toISOString(),
                          });
                          setSelectedDate(selectedDate);
                        }
                      }}
                      reopend={reopened}
                    />
                  </div>
                </div>

                {(reopened || caseContent.reopenedOn) && (
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <label className="text-sm font-medium text-right col-span-3">
                      Reopen Date:
                    </label>
                    <div className="col-span-9">
                      <input
                        type="text"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        value={moment(caseContent.reopenedOn).format(
                          "MM/DD/YYYY"
                        )}
                        onChange={(e) => {
                          const date = e.target.value
                            ? new Date(e.target.value)
                            : null;
                          if (!date) {
                            setCaseContent({
                              ...caseContent,
                              reopenedOn: caseContent.reopenedOn,
                            });
                          } else {
                            setCaseContent({
                              ...caseContent,
                              reopenedOn: date.toISOString(),
                            });
                            setReopenDate(date);
                          }
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-12 gap-4 items-center">
                  <label className="text-sm font-medium text-right col-span-3">
                    Completion Date:
                  </label>
                  <div className="col-span-9">
                    {errorMsg && (
                      <p className="text-sm text-destructive mb-1">
                        Completion date must be greater than start date
                      </p>
                    )}
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
                          setErrorMsg(false);
                        } else if (
                          selectedCompltedDate >
                          new Date(caseContent.reopenedOn?.toString() || "")
                        ) {
                          setErrorMsg(false);
                        } else {
                          setErrorMsg(true);
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 items-center">
                  <label className="text-sm font-medium text-right col-span-3">
                    Estimated Days:
                  </label>
                  <div className="col-span-9">
                    <span className="text-sm text-muted-foreground">
                      {estimatedDays}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 items-center">
                  <label className="text-sm font-medium text-right col-span-3">
                    Status:
                  </label>
                  <div className="col-span-9">
                    <Select
                      value={caseContent.status}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-8 pt-4 border-t">
                {SubmitButton && (
                  <Button variant="default" onClick={submitDate}>
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="history" className="m-0 p-4">
            <CaseChatHistory chatId={caseContent.chatId} />
          </TabsContent>
          <TabsContent value="feedback" className="m-0 p-4">
            <FeedbackHistoryByCaseId id={caseId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default CaseDetailsPage;
