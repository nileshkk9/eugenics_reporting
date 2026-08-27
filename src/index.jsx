import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Main from "./components/Main/Main";
import Login from "./components/Login/Login";
import NotFound from "./components/NotFound/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import ChangePassword from "./components/ChangePassword/ChangePassword";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import Register from "./components/Register/Register";
import InviteUser from "./components/InviteUser/InviteUser";
import TakeInput from "./components/Main/TakeInput";
import ViewReport from "./components/ViewReport/ViewReport";
import DownloadCsv from "./components/DownloadCSV/DownloadCsv";
import RegionalReport from "./components/RegionalReport/RegionalReport";

const routing = (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route element={<PrivateRoute />}>
        <Route path="main" element={<Main />}>
          <Route path="upload" element={<TakeInput />} />
          <Route path="reports" element={<ViewReport />} />
          <Route path="download" element={<DownloadCsv />} />
          <Route path="regional-report" element={<RegionalReport />} />
          <Route path="invite-user" element={<InviteUser />} />
        </Route>
      </Route>

      <Route path="/:email/:token" element={<ChangePassword />} />
      <Route path="/register/:token" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

const container = document.getElementById("root");
const root = createRoot(container);
root.render(routing);
