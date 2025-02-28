import React, { useState, useRef, useEffect, useContext } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { assets } from "../assets/assets";
import PointRecorded from "./PointRecorded";
import ConfirmDiscard from "./ConfirmDiscard";
import { Context } from "../context/Context";

const MapSection = () => {
  const [center, setCenter] = useState({ lat: 7.254822, lng: 80.59215 });
  const ZOOM_LEVEL = 24;
  const mapRef = useRef();

  const {
    navigate,
    showPointRecorded,
    setShowPointRecorded,
    showConfirmDiscard,
    setShowConfirmDiscard,
  } = useContext(Context);

  return (
    <div className="w-full h-[500px] relative">
      <MapContainer
        center={center}
        zoom={ZOOM_LEVEL}
        ref={mapRef}
        className="w-full h-full"
      >
        <TileLayer
          url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=adWhcNjZozsvPpfwl4Zo"
          //https://api.maptiler.com/maps/outdoor-v2/256/{z}/{x}/{y}.png?key=adWhcNjZozsvPpfwl4Zo
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapFix />
      </MapContainer>

      {/* Buttons on the bottom right */}
      <div className="absolute bottom-4 right-2 flex flex-col gap-2 z-[1000] items-center">
        {/* Button 1 */}
        <button className="bg-black p-3 rounded-full shadow-md w-12 h-12 flex items-center justify-center "
        onClick={() => {
          navigate("/takenpoints");
        }}>
          <img src={assets.filter} alt="Button 1" className="w-6 h-6" />
        </button>

        {/* Button 2 */}
        <button
          className="bg-orange-500 p-3 rounded-full shadow-md w-12 h-12 flex items-center "
          onClick={() => setShowConfirmDiscard(true)}
        >
          <img src={assets.reverse} alt="Button 2" className="w-6 h-6" />
        </button>

        {/* Button 3 */}
        <button
          className="bg-blue-500 p-4 rounded-full shadow-md w-16 h-16 flex items-center "
          onClick={() => setShowPointRecorded(true)}
        >
          <img src={assets.add_location} alt="Button 3" className="w-8 h-8" />
        </button>
      </div>

      {/* Show Point Recorded Popup */}
      {showPointRecorded && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[5px] z-[2000]">
          <PointRecorded />
        </div>
      )}

      {/* Show Confirm Discard Popup */}
      {showConfirmDiscard && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[5px] z-[2000]">
          <ConfirmDiscard />
        </div>
      )}
    </div>
  );
};

// Custom component to invalidate size on load
const MapFix = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 400); // Small delay ensures proper resizing
  }, [map]);
  return null;
};

export default MapSection;
