import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GalleryVerticalEnd } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

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

  useEffect(() => {
    if (
      localStorage.getItem("username") &&
      localStorage.getItem("password") &&
      localStorage.getItem("role")
    ) {
      navigate("/", { replace: true });
    }
  }, []);

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
      const response = await fetch(`http://localhost:8080/api/users/@me`, {
        method: "GET",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      });

      const results = await response.json();

      if (response.status == 200) {
        //const role= results[0];
        localStorage.setItem("username", userName);
        localStorage.setItem("password", password);
        localStorage.setItem("id", results.id);
        localStorage.setItem("userInfo", JSON.stringify(results));
      }
    } catch (error) {
      setError("Invalid Userame/Password.");
    }

    try {
      const credentials = btoa(`${userName}:${password}`);
      const response = await fetch(
        `http://localhost:8080/api/users/@me/roles`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/json",
          },
        }
      );

      const results = await response.json();

      if (response.status == 200) {
        const role = results[0];
        localStorage.setItem("role", role);
        navigate("/");
        // if (role === "ADMIN") {
        //   navigate("/case-details-grid");
        // } else if (role === "USER") {
        //   navigate("/case-details-grid");
        // } else if (role === "PLAYER") {
        //   navigate("/chat");
        // } else {
        //   setError("Unable to connect to the server. Please try again later.");
        // }
      }
    } catch (error) {
      setError("Roles not found");
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <div className="flex flex-col items-center pb-10">
          <img
            src="/activision_logo.png"
            alt="Activision Logo"
            className="h-12 w-auto opacity-80"
          />
        </div>
        <div className={cn("flex flex-col gap-6")}>
          <Card className="overflow-hidden">
            <CardContent className="grid p-0">
              <form className="p-6 md:p-8" onSubmit={handleLogin}>
                <div className="flex flex-col gap-10">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-balance text-muted-foreground">
                      Login to your Activision Support account
                    </p>
                  </div>
                  {error && (
                    <p className="text-red-500 text-center text-sm">{error}</p>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="userName"
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="Password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
