import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../context/Context";

const UpdatePassword = ({ isOpen, onClose }) => {
  const { backendUrl } = useContext(Context);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!currentPw || !newPw || !confirmPw) {
      toast.info("Please fill every field");
      return;
    }
    if (newPw !== confirmPw) {
      toast.info("Passwords do not match");
      return;
    }
    if (newPw.length < 6) {
      toast.info("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axios.post(
        backendUrl+ "/api/user/change-password",
        {
          currentPassword: currentPw,
          newPassword: newPw,
          confirmPassword: confirmPw,
        }
      );

      if (data.success) {
        toast.success("Password has changed");
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Server error");
    } finally {
      setIsSubmitting(false);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    }
  };

  useEffect(() => {
      const onKey = (e) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", onKey, { passive: true });
      return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[5px] z-[2000]
                 flex items-center justify-center"
        onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div className="bg-white dark:bg-gray-800 w-11/12 max-w-md rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Change Password</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Current password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            className="w-full border rounded px-3 py-2 dark:text-gray-800"
          />
          <input
            type="password"
            placeholder="New password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            className="w-full border rounded px-3 py-2 dark:text-gray-800"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            className="w-full border rounded px-3 py-2 dark:text-gray-800"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
