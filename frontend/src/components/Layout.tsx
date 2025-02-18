import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function LayoutNew() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = (localStorage.getItem("role") as string) || "";
  const username = (localStorage.getItem("username") as string) || "";
  useEffect(() => {
    if (!role || !username) {
      toast.error("Authentication Failed. Please Login Again");
      navigate("/login");
    }
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/login");
  };

  return (
    <main>
      <header className="fixed top-0 w-full bg-white flex h-16 shrink-0 items-center justify-between gap-2 border-b">
        <div className="flex items-center gap-2 px-3">
          <img
            src="/activision_logo.png"
            alt="Activision Logo"
            className="h-7  w-auto opacity-80"
          />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h2>Chat Support</h2>
        </div>
        <div className="px-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 font-medium cursor-pointer hover:bg-slate-100 rounded-md p-2">
                <Avatar>
                  <AvatarFallback>
                    {username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">{username}</p>
                  <p className="text-muted-foreground text-xs">{role}</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="min-h-[100vh] pt-16 flex-1  md:min-h-min container mx-auto">
        <Outlet />
      </div>
    </main>
  );
}
