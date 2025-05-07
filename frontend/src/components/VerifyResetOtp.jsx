import React, { useRef } from "react";
import { toast } from "react-toastify";

const VerifyResetOtp = ({ otp, setOtp, setIsOtpSubmitted }) => {
  const inputsRef = useRef([]);

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

  const onSubmitOTP = e => {
    e.preventDefault();
    if (otp.some((d) => d === "")) return toast.error("Enter all six digits");
    const code = otp.join("");
    setIsOtpSubmitted(true);
  };

  return (
    <div>
      {/* Welcome text */}
      <h2 className="mt-4 text-center text-4xl font-semibold text-gray-900">
        Reset Password OTP
      </h2>
      <p className="mt-1 text-center text-base text-gray-600">
        Enter the 6-digit code we sent to your email
      </p>

      {/* OTP inputs */}
      <form
        onSubmit={onSubmitOTP}
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
          className="mt-6 w-32 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Verify email
        </button>
      </form>
    </div>
  );
};

export default VerifyResetOtp;
