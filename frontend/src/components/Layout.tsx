import React, { useEffect} from "react";
import { Link, Outlet, useNavigate,useLocation,Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Role = "ADMIN" | "USER" | "PLAYER";

const roleLinks: Record<Role, { to: string; label: string }[]> = {
    ADMIN: [
      { to: "/qa-content-grid", label: "Q/A Content Grid" },
      { to: "/case-details-grid", label: "Case Details Grid" },
    ],
    USER: [
    { to: "/case-details-grid", label: "Case Details Grid" },
    ],
    PLAYER: [
      { to: "/chat", label: "Chat Page" },
    ],
  };

const Layout: React.FC = () => {
  const navigate= useNavigate();
  const location =useLocation();
  const role = (sessionStorage.getItem("role") as Role) || ""; 
    const links = role? roleLinks[role] || [] : [];
  const { t, i18n } = useTranslation();

  useEffect(()=>{
    if(!role){
      navigate("/login"); 
   }
   
   else if(location.pathname ===  "/"){
    const defaultPage = role ==="ADMIN" || role ==="USER" ? "/case-details-grid" : "/chat" ;
    navigate(defaultPage);
   }
  },[role, navigate,location.pathname]);


  return (
    <div className="flex min-h-screen">
        {/* Sidebar */}
     {localStorage.getItem("role") !== "PLAYER" &&    <div className="w-1/5 bg-gradient-to-br from-blue-500 to-blue-700 text-white p-8 hidden md:flex flex-col">
            <div className="flex flex-col items-center">
                <img
                    src="/atvilogo-wht.png"
                    alt="Activision Logo"
                    className="h-30 w-auto opacity-80"
                />
               <p className="text-center text-blue-100 ">{t("welcome")}</p>
            </div>
            {/* Navigation Links */}
            <nav className="mt-8">
  <ul className="space-y-4">
    {links.map((link, index) => (
      <li key={index}>
        <Link
          to={link.to}
          className="block px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-bold"
        >
          {link.label}
        </Link>
      </li>
    ))}
  </ul>
</nav>   
        </div>}

        {/* Main Content Area */}
        <div className="flex-1 p-4 bg-gray-100">
            <Outlet />
        </div>
    </div>
);
};

export default Layout;
