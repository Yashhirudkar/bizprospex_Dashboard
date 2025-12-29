"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { apiUrl } from "../../constant/api";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // STEP 1: SEND OTP
  const handleEmailSubmit = async () => {
    setMessage("");
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${apiUrl}/admin/request-otp-admin`,
        { email }
      );

      if (res.status === 200) {
        setMessage("OTP sent successfully!");
        setStep("otp");
      } else {
        setError(res.data.message || "Failed to send OTP.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Server error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: VERIFY OTP
  const handleOtpSubmit = async () => {
    setMessage("");
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${apiUrl}/verify-otp-admin`,
        { email, otp },
        { withCredentials: true }
      );

      if (res.status === 200 && res.data.success) {
        setMessage("Login successful!");
        router.push("/upload-data");
      } else {
        setError(res.data.message || "Invalid OTP.");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Server error while verifying OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-md overflow-hidden">
        <div className="p-8 flex flex-col items-center">
          {/* LOGO */}
          <Image
            src="/main-logo.png"
            alt="Logo"
            width={200}
            height={60}
            className="mb-6"
          />

          <h1 className="text-xl font-semibold text-black mb-1">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mb-4">
            Login using OTP
          </p>

          {/* SUCCESS MESSAGE */}
          {message && (
            <div className="w-full bg-green-100 text-green-700 px-4 py-2 rounded mb-3 text-sm">
              {message}
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="w-full bg-red-100 text-red-700 px-4 py-2 rounded mb-3 text-sm">
              {error}
            </div>
          )}

          {/* EMAIL INPUT */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={step === "otp" || loading}
            className="w-full border text-gray-600  rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />

          {step === "email" ? (
            <button
              onClick={handleEmailSubmit}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          ) : (
            <>
              {/* OTP INPUT */}
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
                className="w-full border text-gray-600  rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={handleOtpSubmit}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
              >
                {loading ? "Verifying OTP..." : "Login"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
