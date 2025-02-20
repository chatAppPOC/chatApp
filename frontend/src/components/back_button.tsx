import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRightLeft } from "lucide-react";

type Props = {
  path?: string;
};

const BackButton = ({ path }: Props) => {
  const navigate = useNavigate();
  const backPath = path ? path : -1;
  return (
    <Button variant="outline" size="icon" onClick={() => navigate(backPath)}>
      <ArrowLeft />
    </Button>
  );
};

export default BackButton;
