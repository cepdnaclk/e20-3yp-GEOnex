import React, { useContext, useState, useEffect }  from "react";
import { Context } from "../context/Context";
import MapSection from "../components/MapSection";
import axios from "axios";
import { toast } from "react-toastify";
const Notifications = () => {
  const { navigate, backendUrl} = useContext(Context);
  
  
 

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Section */}
      <PageTopic
        topic="Notifications"
        intro="See all your notifications here"
      />
      </div>
  );
};

export default Notifications;
