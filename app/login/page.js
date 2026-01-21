"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { apiUrl } from "../../constant/api";

// Set global axios defaults for cookies
axios.defaults.withCredentials = true;

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Check if already logged in on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // You should create this endpoint in backend: /api/admin/verify
        const res = await axios.get(`${apiUrl}/admin/verify`);
        if (res.status === 200) {
          router.push("/upload-data");
        }
      } catch (err) {
        // Not logged in, stay on login page
        console.log("No active session found");
      }
    };
    checkSession();
  }, [router]);

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
        { email },
        { withCredentials: true } // Added for consistency
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
        `${apiUrl}/admin/verify-otp-admin`,
        { email, otp },
        { withCredentials: true } // CRITICAL: Allows browser to save the authToken cookie
      );

      if (res.status === 200 && res.data.success) {
        // If your backend sends a short-lived downloadToken in the body,
        // you can store it in localStorage as it's not a sensitive session cookie.
        if (res.data.downloadToken) {
          localStorage.setItem("downloadToken", res.data.downloadToken);
        }

        setMessage("Login successful!");
        // Small delay to ensure cookie is set before redirect
        setTimeout(() => {
          router.push("/upload-data");
        }, 500);
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
            priority
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
            onKeyDown={(e) => { if (e.key === 'Enter' && !loading) handleEmailSubmit(); }}
            disabled={step === "otp" || loading}
            className="w-full border text-gray-600 rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
                onKeyDown={(e) => { if (e.key === 'Enter' && !loading) handleOtpSubmit(); }}
                disabled={loading}
                className="w-full border text-gray-600 rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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