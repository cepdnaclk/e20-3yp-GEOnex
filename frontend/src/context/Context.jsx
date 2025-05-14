import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;
import { toast } from "react-toastify";

export const Context = createContext();

const ContextProvider = (props) => {
  const navigate = useNavigate();
  const [showPointRecorded, setShowPointRecorded] = useState(false);
  const [showConfirmDiscard, setShowConfirmDiscard] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [projects, setProjects] = useState([]);
  const [points, setPoints] = useState([]);
  const [loadingPoints, setLoadingPoints] = useState(false);

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/is-auth");
      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
      }else{
        setIsLoggedin(false);
        if(data.message === "Please verify your account first."){
          toast.info(data.message);
          navigate('/email-verify');
        } else if(data.message === "Not Authorized.Login Again"){
          navigate("/login")
        }
      }
    } catch (error) {
      setIsLoggedin(false);
      toast.error(error.message);
      navigate("/login");
    }finally{
      setIsLoading(false)
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data");
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getProjectsData = async (userId) => {
    try {
      if (userId !== undefined) {
        const response = await axios.get(backendUrl + `/api/projects/recentprojects/${userId}`);

      if (response.data.success) {
        setProjects(response.data.projects);
      } else {
        toast.error(response.data.message);
      }

      }
      
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error(error.message);
    }
  };

  const removeProject = async (projectId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/projects/${projectId}`
      );
      if (response.data.success) {
        toast.success(response.data.message);
        getProjectsData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Function to fetch points by project id
  const fetchPoints = async (projectId) => {
    setLoadingPoints(true);
    setPoints([]);
    try {
      const response = await axios.get(`${backendUrl}/api/points/${projectId}`);
      if (response.data.success) {
        setPoints(response.data.points);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching points:", error);
    } finally {
      setLoadingPoints(false);
    }
  };

  const deletePoint = async (projectId, pointId) => {
    console.log(projectId, pointId);
    try {
      const response = await axios.delete(
        `${backendUrl}/api/points/${projectId}/${pointId}`
      );
      if (response.data.message) {
        toast.success(response.data.message);
        // Remove the deleted point from the local state
        setPoints((prevPoints) =>
          prevPoints.filter((point) => point._id !== pointId)
        );
      } else {
        toast.error("Failed to delete point.");
      }
    } catch (error) {
      console.error("Error deleting point:", error);
      toast.error("Failed to delete point.");
    }
  };

  useEffect(() => {
    getProjectsData();
    getAuthState();
  }, []);

  // 🔍 watch auth state change
  useEffect(() => {
    console.log("userData changed ➜", userData);
  }, [userData]);

  useEffect(() => {
    console.log("isLoggedin changed ➜", isLoggedin);
  }, [isLoggedin]);

  const value = {
    navigate,
    showPointRecorded,
    setShowPointRecorded,
    showConfirmDiscard,
    setShowConfirmDiscard,
    backendUrl,
    projects,
    getProjectsData,
    removeProject,
    points,
    loadingPoints,
    fetchPoints,
    setPoints,
    deletePoint,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    isLoading
  };

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
};

export default ContextProvider;
