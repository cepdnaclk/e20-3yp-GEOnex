import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Context } from "../context/Context";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const inputsRef = useRef([]);

  const [cooldown, setCooldown] = useState(0);

  const {
    navigate,
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    getUserData,
    userData,
  } = useContext(Context);

  // Move focus as the user types
  const handleChange = (value, idx) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[idx] = value;
      setOtp(newOtp);
      if (value && idx < 5) inputsRef.current[idx + 1].focus();
    }
  };

  // Backspace ⇽ move focus left
  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1].focus();
    }
  };

  /* paste handler that works for 1-6 digits */
  const handlePaste = (e) => {
    e.preventDefault();
    const raw = e.clipboardData.getData("text").replace(/\D/g, ""); // digits only
    if (!raw) return;

    const activeIndex = inputsRef.current.findIndex(
      (input) => input === document.activeElement
    );
    const start = activeIndex === -1 ? 0 : activeIndex; // fallback first box
    const digits = raw.slice(0, 6 - start).split("");

    const newOtp = [...otp];
    digits.forEach((d, i) => (newOtp[start + i] = d));
    setOtp(newOtp);

    // reflect visually
    digits.forEach((d, i) => {
      inputsRef.current[start + i].value = d;
    });

    const nextPos = Math.min(start + digits.length, 5);
    inputsRef.current[nextPos].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.some((d) => d === "")) return toast.error("Enter all six digits");
    const code = otp.join("");
    try {
      setSubmitting(true);

      const { data } = await axios.post(backendUrl+ "/api/auth/verify-email", {
        otp: code,
      });
      if (data.success) {
        toast.success(data.message);
        setIsLoggedin(true);
        await getUserData();
        navigate("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return; // prevent spam
    try {
      const { data } = await axios.get(backendUrl+ "/api/auth/sendverifyotp", {
        withCredentials: true,
      });

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }

      // Start cooldown (e.g., 60s)
      setCooldown(60);
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error("Failed to resend OTP");
    }
  };

  useEffect(() => {
    isLoggedin &&
      userData &&
      userData.isAccountVerified &&
      navigate("/dashboard");
  }, [isLoggedin, userData]);

  return (
    <div
      className="min-h-dvh flex items-center justify-center
      sm:bg-[rgba(47,47,48,1)]"
    >
      <div
        className=" w-full min-h-dvh
      sm:min-h-fit sm:w-[26rem] sm:px-8
      sm:rounded-xl sm:shadow-lg 
      px-6 py-10
      bg-[rgba(217,217,217,1)]
      flex flex-col justify-center"
      >
        {/* Logo */}
        <h1 onClick={() => navigate("/login")}
        className="text-center text-3xl font-light text-gray-900 cursor-pointer">
          <span className="font-semibold">GEO</span>nex
        </h1>

        {/* Welcome text */}
        <h2 className="mt-4 text-center text-4xl font-semibold text-gray-900">
          OTP verification
        </h2>
        <p className="mt-1 text-center text-base text-gray-600">
          Enter the 6-digit code we sent to your email
        </p>

        {/* OTP inputs */}
        <form
          onSubmit={handleSubmit}
          onPaste={handlePaste}
          className="mt-6 flex flex-col items-center"
        >
          <div className="flex gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputsRef.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="w-10 h-12 md:w-12 md:h-14 rounded-md border border-gray-400 bg-transparent text-center text-xl font-semibold tracking-widest focus:border-indigo-500 focus:outline-none"
              />
            ))}
          </div>

          {/* submit */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-32 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "..." : "Submit"}
          </button>
        </form>

        {/* Resend option with cooldown */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Didn't receive the OTP?{" "}
          <span
            onClick={handleResend}
            className={`font-semibold ${
              cooldown
                ? "text-gray-400 cursor-not-allowed"
                : "text-indigo-600 hover:underline cursor-pointer"
            }`}
          >
            {cooldown ? `Resend in ${cooldown}s` : "Resend"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default EmailVerify;
