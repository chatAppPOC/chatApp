import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, FileText, ThumbsUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const menuItems = [
    {
      title: "Chat Support",
      description: "Get instant help through our chat support system",
      icon: <MessageSquare className="h-12 w-12" />,
      path: "/chat",
      role: ["PLAYER"],
    },
    {
      title: "Case Management",
      description: "View and manage support cases",
      icon: <FileText className="h-12 w-12" />,
      path: "/case-details-grid",
      role: ["ADMIN", "USER"],
    },
    {
      title: "Question and Answer master",
      description: "View feedback history and ratings",
      icon: <ThumbsUp className="h-12 w-12" />,
      path: "/qa-content-grid",
      role: ["ADMIN"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.role.includes(role as string)
  );

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center mb-10">
        <img
          src="/activision_logo.png"
          alt="Activision Logo"
          className="h-16 mb-6"
        />
        <h1 className="text-2xl font-bold text-center text-muted-foreground">
          Welcome to Chat Support Portal
        </h1>
      </div>
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6">
          {filteredMenuItems.map((item, index) => (
            <Card
              key={index}
              className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-accent min-h-[180px] w-[320px] flex flex-col"
              onClick={() => navigate(item.path)}
            >
              <CardHeader className="flex-1 p-6 pb-4 flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 p-6 mb-4">
                  {item.icon}
                </div>
                <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                <CardDescription className="text-sm">
                  {item.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
