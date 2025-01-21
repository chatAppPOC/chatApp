import React from "react";
import ReactDOM from "react-dom/client";
import ChatPage from "./chat";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QAContentTable from "./components/QAContent/QAContentTable/QAContentTable";
import QAContentEditor from "./components/QAContent/QAContentEditor/QAContentEditor";
import CaseDetailsTable from "./components/CaseDetails/CaseDetailsGrid/CaseDetailsTable";
import CaseDetailsPage from "./components/CaseDetails/CaseDetailsPage/CaseDetailsPage";
import "./app.css";
import "./i18n"; // Import the i18n configuration
import Layout from "./components/Layout";
import FeedBack from "./components/FeedBack/FeedBack"; // Import the FeedBack component

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Router>
    <Routes>
      {/* Routes with the Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<ChatPage />} />
        <Route path="qa-content-grid" element={<QAContentTable />} />
        <Route path="qa-content/:id" element={<QAContentEditor />} />
        <Route path="case-details-grid" element={<CaseDetailsTable />} />
        <Route path="feedback" element={<FeedBack />} />
      </Route>
    </Routes>
  </Router>
);
