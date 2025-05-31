import React from "react";
import { useEffect } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Projects from "./pages/Projects";
import Settings from "./pages/Settings";
import NewProject from "./pages/NewProject";
import PointSurvey from "./pages/PointSurvey";
import ProjectDetails from "./pages/ProjectDetails";
import TakenPoints from "./pages/TakenPoints";
import Layout from "./components/Layout";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import RegisterNewDevice from "./pages/RegisterNewDevice";
import "leaflet/dist/leaflet.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { Context } from "../src/context/Context";
import Notifications from "./pages/Notifications";
import DeviceDetails from "./pages/DeviceDetails";

const App = () => {
  return (
    <div>
      <ToastContainer />

      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/devices" element={<Devices />} />

            <Route path="/devices/:deviceId" element={<DeviceDetails />} />

            <Route path="/projects" element={<Projects />} />

            <Route path="/settings" element={<Settings />} />

            <Route path="/projects/:userId/newproject" element={<NewProject />} />

            <Route path="/projects/pointsurvey/:projectId" element={<PointSurvey />} />

            <Route path="/projects/takenpoints/:projectId" element={<TakenPoints />} />

            <Route path="/projects/:projectId" element={<ProjectDetails />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route
              path="/devices/register-device/:userId"
              element={<RegisterNewDevice />}
            />
          </Route>
        </Route>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
};

export default App;
