import React from "react";
import { Routes, Route ,BrowserRouter as Router} from "react-router-dom";
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

const App = () => {
  return (
    <div>
      <ToastContainer />

     
      <Routes>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/devices" element={<Devices />} />

          <Route path="/projects" element={<Projects />} />

          <Route path="/settings" element={<Settings />} />

          <Route path="/:userId/newproject" element={<NewProject />} />

          <Route path="/pointsurvey/:projectId" element={<PointSurvey />} />

          <Route path="/projectdetails" element={<ProjectDetails />} />

          <Route path="/takenpoints/:projectId" element={<TakenPoints />} />

          <Route path="/project/:projectId" element={<ProjectDetails />} />
          <Route path="/devices/register-device/:userId" element={<RegisterNewDevice />} />
        </Route>
        {/* routes **outside** the sidebar  */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>

      

      
    </div>
  );
};

export default App;
