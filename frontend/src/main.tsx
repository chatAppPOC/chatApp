import React from "react";
import ReactDOM from "react-dom/client";
import ChatPage from "./chat";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QAContentTable from "./components/QAContent/QAContentTable/QAContentTable";
import QAContentEditor from "./components/QAContent/QAContentEditor/QAContentEditor";
import CaseDetailsTable from "./components/CaseDetails/CaseDetailsGrid/CaseDetailsTable";
import CaseDetailsPage from "./components/CaseDetails/CaseDetailsPage/CaseDetailsPage";
import FeedBackHistoryByCaseId from "./components/FeedbackHistoryByCaseId/FeedBackHistoryByCaseId";
import LoginPage from "./components/Authentication/LoginPage";
import "./app.css";
import "./i18n"; // Import the i18n configuration
import Layout from "./components/Layout";
import FeedBack from "./components/FeedBack/FeedBack"; // Import the FeedBack component
import PrivateRoute from "./components/Authentication/PrivateRoutes";
import ChatPage1 from "./chat copy";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Router>
    <Toaster position="top-right" richColors />
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<ChatPage />} />
        <Route
          path="qa-content-grid"
          element={
            <PrivateRoute allowedRole="ADMIN">
              <QAContentTable />
            </PrivateRoute>
          }
        />
        <Route
          path="qa-content/:id?"
          element={
            <PrivateRoute allowedRole="ADMIN">
              <QAContentEditor />
            </PrivateRoute>
          }
        />
        <Route
          path="case-details-grid"
          element={
            <PrivateRoute allowedRole="USER">
              <CaseDetailsTable />
            </PrivateRoute>
          }
        />
        <Route
          path="feedback"
          element={
            <PrivateRoute allowedRole="PLAYER">
              <FeedBack />
            </PrivateRoute>
          }
        />

        <Route path="feedbackHistory" element={<FeedBackHistoryByCaseId />} />
        <Route
          path="chat/:caseId"
          element={
            <PrivateRoute allowedRole={"USER"}>
              <ChatPage />
            </PrivateRoute>
          }
        />
        <Route
          path="chat"
          element={
            <PrivateRoute allowedRole="PLAYER">
              <ChatPage />
            </PrivateRoute>
          }
        />
        <Route
          path="chat1"
          element={
            <PrivateRoute allowedRole="PLAYER">
              <ChatPage1 />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  </Router>
);
