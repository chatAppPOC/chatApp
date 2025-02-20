import { CaseStatus } from "@/constants/enum";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type UserInfo = {
  id: number;
  firstName: string;
  lastName: string;
  preferredLanguage: number;
  platform: number;
  title: number;
  email: string;
  enabled: boolean;
};

export function getUserInfo(): UserInfo {
  const data = localStorage.getItem("userInfo");
  if (data) {
    return JSON.parse(data);
  }
  return null;
}

export function getCaseBadge(status: string) {
  switch (status) {
    case CaseStatus.OPEN:
      return {
        label: "Open",
        variant: "text-yellow-700 bg-yellow-50 border-yellow-300",
      };
    case CaseStatus.IN_PROGRESS:
      return {
        label: "In Progress",
        variant: "text-blue-700 bg-blue-50 border-blue-300",
      };
    case CaseStatus.RESOLVED:
      return {
        label: "Resolved",
        variant: "text-green-700 bg-green-50 border-green-300",
      };
    case CaseStatus.RE_OPENED:
      return {
        label: "Re-opened",
        variant: "text-red-700 bg-red-50 border-red-300",
      };
    default:
      return {
        label: status,
        variant: "text-gray-700 bg-gray-50 border-gray-300",
      };
  }
}
