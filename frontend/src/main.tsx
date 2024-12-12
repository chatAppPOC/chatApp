import React from "react";
import ReactDOM from "react-dom/client";
import ChatPage from "./chat";
import "./app.css";
import "./i18n"; // Import the i18n configuration

ReactDOM.createRoot(document.getElementById("root")!).render(<ChatPage />);
