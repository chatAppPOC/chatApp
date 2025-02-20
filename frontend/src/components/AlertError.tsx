import { AlertCircle } from "lucide-react";
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

type Props = {
  children: React.ReactNode;
  type?: "default" | "destructive";
  title?: string;
};

const AlertMessage = (props: Props) => {
  const { title = "Message", children, type = "default" } = props;
  return (
    <Alert variant={type}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
};

export default AlertMessage;
