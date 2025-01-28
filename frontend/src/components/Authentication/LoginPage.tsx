import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setRoles] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
 
  const validateUserName = (userName: string): boolean => {
    const userNameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return userNameRegex.test(userName);
  };
  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUserName(userName)) {
      setError("Please enter a valid UserName.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError("");

    try {
        const credentials = btoa(`${userName}:${password}`);
        const response = await fetch(`http://localhost:8080/api/users/@me?/roles`,
          {
            method: "GET",
            headers: {
            'Authorization': `Basic ${credentials}`,
              "Content-Type": "application/json",
            },
          }
        );

      const results = await response.json();


      if(response.status==200){
        const role= results.roles[0].name??""; 
        const roleId= results.roles[0].id??""; 
     await localStorage.setItem("username", userName); 
     await sessionStorage.setItem("username", userName); 
    await localStorage.setItem("password", password);
     await sessionStorage.setItem("role",role);
    await localStorage.setItem("role",role);
    await localStorage.setItem("roleId",roleId);
    await localStorage.setItem("id",results.id);  
    
    
        
        if (role === "ADMIN") {
            navigate("/case-details-grid");
          } else if (role === "USER") {
            navigate("/case-details-grid");
          } else if (role === "PLAYER") {
            navigate("/chat");
          } else {
            setError("Unable to connect to the server. Please try again later.");
          }
        }
    } catch (error) {
      setError("Invalid Userame/Password.");
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-10 hidden md:flex flex-col">
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-8 hidden md:flex flex-col"> 
            <div className="flex flex-col items-center">
              <img
                src="/atvilogo-wht.png"
                alt="Activision Logo"
                className="h-30 w-auto opacity-80"
              />
            </div>
          </div> 
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
                <div>
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    id="userName"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Enter your username"
                  />
                </div>
                <div>
                  <label htmlFor="Password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="Password"
                    type="password"
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value);}}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Enter your password"
                  />
                </div>
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                name ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-400 text-gray-700 cursor-allowed"
              }`}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
