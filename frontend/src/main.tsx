import React from "react";
import ReactDOM from "react-dom/client";
import ChatPage from "./chat";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import QAContentTable from "./features/QuestionnaireFlow/QAContentTable";
import QAContentEditor from "./components/QAContent/QAContentEditor/QAContentEditor";
import CaseDetailsTable from "./features/CaseDetails/CaseDetailsGrid/CaseDetailsTable";
import CaseDetailsPage from "./features/CaseDetails/CaseDetailsPage/CaseDetailsPage";
import LoginPage from "./components/Authentication/LoginPage";
import "./app.css";
import "./i18n"; // Import the i18n configuration
import FeedBack from "./features/FeedBack/FeedBack"; // Import the FeedBack component
import PrivateRoute from "./components/Authentication/PrivateRoutes";
import ChatPage1 from "./chat copy";
import { Toaster } from "sonner";
import DesignSystem from "./features/DesignSystem";
import LayoutNew from "./components/Layout";
import Home from "./features/Home";
import { ROUTE_CASES, ROUTE_QA_CONTENT } from "./constants/routes";
import QuestionnaireFlow from "./features/QuestionnaireFlow";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Router>
    <Toaster position="top-center" richColors />
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/ui" element={<DesignSystem />} />

      <Route path="/" element={<LayoutNew />}>
        <Route index element={<Home />} />
        <Route
          path={ROUTE_QA_CONTENT}
          element={
            <PrivateRoute allowedRole="ADMIN">
              <Outlet />
            </PrivateRoute>
          }
        >
          <Route index element={<QAContentTable />} />
          <Route path=":id?" element={<QuestionnaireFlow />} />
        </Route>

        <Route
          path={ROUTE_CASES}
          element={
            <PrivateRoute allowedRole="USER">
              <Outlet />
            </PrivateRoute>
          }
        >
          <Route index element={<CaseDetailsTable />} />
          <Route path=":caseId" element={<CaseDetailsPage />} />
        </Route>
        <Route
          path="feedback"
          element={
            <PrivateRoute allowedRole="PLAYER">
              <FeedBack />
            </PrivateRoute>
          }
        />

        {/* <Route path="feedbackHistory" element={<FeedBackHistoryByCaseId />} /> */}
        {/* <Route
          path="chat/:caseId"
          element={
            <PrivateRoute allowedRole={"USER"}>
              <ChatPage />
            </PrivateRoute>
          }
        /> */}
        <Route
          path="chat"
          element={
            <PrivateRoute allowedRole="PLAYER">
              <ChatPage />
            </PrivateRoute>
          }
        />
        {/* <Route
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
        /> */}
      </Route>
    </Routes>
  </Router>
);
