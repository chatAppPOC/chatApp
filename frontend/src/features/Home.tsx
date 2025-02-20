import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ROUTE_CASES, ROUTE_QA_CONTENT } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { MessageSquare, FileText, Puzzle } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const menuItems = [
    {
      title: "Chat Support",
      description:
        "Get instant help through our chat support system. Connect with our support team and get your questions answered quickly.",
      path: "/chat",
      roles: ["PLAYER"],
      icon: <MessageSquare className="h-6 w-6" />,
      features: [
        { label: "Live Chat", color: "blue" },
        { label: "Quick Support", color: "green" },
        { label: "24/7 Available", color: "purple" },
      ],
    },
    {
      title: "Case Management",
      description:
        "Track and manage support cases efficiently. View case details, update status, and monitor progress all in one place.",
      path: ROUTE_CASES,
      roles: ["ADMIN", "USER"],
      icon: <FileText className="h-6 w-6" />,
      features: [
        { label: "Case Tracking", color: "blue" },
        { label: "Status Updates", color: "green" },
        { label: "Analytics", color: "purple" },
      ],
    },
    {
      title: "Content Builder",
      description:
        "Create and manage interactive chat flows with our intuitive content builder. Design conversational experiences that engage users.",
      path: ROUTE_QA_CONTENT,
      roles: ["ADMIN"],
      icon: <Puzzle className="h-6 w-6" />,
      features: [
        { label: "Flow Builder", color: "yellow" },
        { label: "Templates", color: "pink" },
        { label: "Customization", color: "indigo" },
      ],
    },
  ];

  const hasAccess = (itemRoles: string[]) => {
    return role && itemRoles.includes(role);
  };

  // Filter menu items based on user role
  const accessibleMenuItems = menuItems.filter((item) => hasAccess(item.roles));

  return (
    <div className="min-h-screen">
      {/* Simple Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-6 mb-12">
          <div className="flex items-center justify-between flex-wrap gap-2 w-full border-b pb-4">
            <div className=" ">
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Chat Support
              </h1>
              <p className="text-gray-500">
                {role === "PLAYER"
                  ? "Get instant help and support for your gaming needs"
                  : "Streamline support operations and manage cases efficiently"}
              </p>
            </div>
            <div className="text-sm font-medium">
              <span className="text-gray-500">Role: </span>
              <span className="text-primary">{role}</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div
          className={cn("grid gap-7 md:grid-cols-2 xl:grid-cols-3 lg:gap-8")}
        >
          {accessibleMenuItems.map((item, index) => (
            <Card
              key={index}
              className="relative group overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
              onClick={() => navigate(item.path)}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/5 text-primary">
                      {item.icon}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {item.title}
                    </h2>
                  </div>
                  <svg
                    className="h-6 w-6 text-primary transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 flex-grow text-sm">
                  {item.description}
                </p>
                <div className="mt-4 flex gap-2 text-sm text-gray-500">
                  {item.features.map((feature, featureIndex) => (
                    <span
                      key={featureIndex}
                      className={`inline-flex items-center rounded-full bg-${feature.color}-50 px-2 py-1 text-xs font-medium text-${feature.color}-700`}
                    >
                      {feature.label}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
