"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const { status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpStore, setOtpStore] = useState<any>({});
  const [step, setStep] = useState("login");
  const [mode, setMode] = useState("password");
  const [tempUser, setTempUser] = useState<any>(null);

  const generateOTP = (phone: string) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpStore((prev: any) => ({ ...prev, [phone]: otp }));
    alert("OTP sent to phone (demo): " + otp);
    return otp;
  };

  const handlePasswordLogin = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u: any) =>
        (u.email === email || u.phone === email) &&
        u.password === password
    );

    if (user) {
      setTempUser(user);
      generateOTP(user.phone);
      setStep("otpVerification");
    } else {
      alert("Invalid credentials ❌");
    }
  };

  const handleOtpLogin = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: any) => u.phone === phone);

    if (!user) {
      alert("User not found ❌");
      return;
    }

    setTempUser(user);
    generateOTP(phone);
    setStep("otpVerification");
  };

  const verifyOtp = () => {
    if (!tempUser) {
      alert("Session expired ❌. Please log in again.");
      setStep("login");
      return;
    }

    const cleanOtp = enteredOtp.replace(/\s/g, "");
    
    if (otpStore[tempUser.phone] === cleanOtp) {
      // 1. Storage
      localStorage.setItem("currentUser", JSON.stringify(tempUser));
      localStorage.setItem("provider", "local");
      
      // 2. Set Cookie (Ensure it's exactly what Middleware looks for)
      // We set 'currentUser=true' so the middleware isAuthenticated check works
      document.cookie = "currentUser=true; path=/; max-age=86400; SameSite=Lax";

      // 3. Use window.location for a fresh page load to trigger middleware
      window.location.href = "/dashboard"; 
    } else {
      alert("Invalid OTP ❌. Use the 6-digit code sent to your alert box.");
    }
  };

  return (
    <div className="glass-card w-full max-w-md p-8 rounded-3xl shadow-2xl border border-white/20">
      <h2 className="text-2xl font-black text-center text-slate-900 mb-1">
        Welcome Back
      </h2>

      <p className="text-sm text-center text-slate-500 mb-6">
        Choose your preferred login method
      </p>

      <div className="flex justify-center mb-6">
        <span className="px-4 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600">
          {step === "login"
            ? "Step 1: Credentials"
            : "Step 2: OTP Verification"}
        </span>
      </div>

      {/* Google Login */}
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-3 py-3 border rounded-xl font-bold text-sm"
      >
        <img
          src="https://www.svgrepo.com/show/355037/google.svg"
          className="w-4 h-4"
          alt="Google"
        />
        {status === "loading" ? "Connecting..." : "Continue with Google"}
      </button>

      <div className="my-6 text-center text-xs text-gray-400">
        OR Secure Local Login
      </div>

      {step === "login" && (
        <div className="bg-slate-100/50 p-1.5 rounded-xl flex mb-6">
          <button
            onClick={() => setMode("password")}
            className={`flex-1 py-2 text-xs rounded-lg font-bold ${
              mode === "password"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500"
            }`}
          >
            Password + OTP
          </button>

          <button
            onClick={() => setMode("otpLogin")}
            className={`flex-1 py-2 text-xs rounded-lg font-bold ${
              mode === "otpLogin"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500"
            }`}
          >
            OTP Only
          </button>
        </div>
      )}

      <div className="space-y-4">
        {step === "login" && mode === "password" && (
          <>
            <input
              placeholder="Email or Phone"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border"
            />
            <button
              onClick={handlePasswordLogin}
              className="w-full py-3 bg-blue-600 text-white rounded-xl"
            >
              Login
            </button>
          </>
        )}

        {step === "login" && mode === "otpLogin" && (
          <>
            <input
              placeholder="Phone Number"
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-xl border"
            />
            <button
              onClick={handleOtpLogin}
              className="w-full py-3 bg-blue-600 text-white rounded-xl"
            >
              Send OTP
            </button>
          </>
        )}

        {step === "otpVerification" && (
          <>
            <input
              maxLength={6}
              placeholder="••••••"
              onChange={(e) =>
                setEnteredOtp(e.target.value.replace(/\s/g, ""))
              }
              className="w-full p-3 text-center text-2xl tracking-[0.5em] rounded-xl border"
            />
            <button
              onClick={verifyOtp}
              className="w-full bg-green-600 text-white py-3 rounded-xl"
            >
              Verify & Enter Dashboard
            </button>
          </>
        )}
      </div>

      <div className="mt-8 pt-6 border-t text-center">
        <p className="text-sm text-slate-500 font-medium">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600 font-bold">
            Sign Up
          </Link>
        </p>
      </div>

    </div>
  );
}