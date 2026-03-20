"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpStore, setOtpStore] = useState<any>({});
  const [step, setStep] = useState("login");
  const [mode, setMode] = useState("password");
  const [tempUser, setTempUser] = useState<any>(null);

  // ✅ Controlled redirect AFTER successful login
  useEffect(() => {
    if (status !== "authenticated") return;

    const alreadyLogged = localStorage.getItem("provider");

    if (!alreadyLogged) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          email: session?.user?.email,
          name: session?.user?.name,
        })
      );
      localStorage.setItem("provider", "google");
    }

    router.replace("/"); // 🔁 single source of redirect
  }, [status, session, router]);

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
    if (otpStore[tempUser?.phone] === enteredOtp) {
      localStorage.setItem("currentUser", JSON.stringify(tempUser));
      localStorage.setItem("provider", "local");
      document.cookie = "currentUser=true; path=/";

      router.replace("/"); // ✅ consistent redirect
    } else {
      alert("Invalid OTP ❌");
    }
  };

  return (
    <div className="glass-card w-full max-w-md p-8 rounded-3xl shadow-2xl auth-transition border border-white/20">
      <h2 className="text-2xl font-black text-center text-slate-900 mb-1 tracking-tight">
        Welcome Back
      </h2>
      <p className="text-sm text-center text-slate-500 mb-6 font-medium">
        Choose your preferred login method
      </p>

      <div className="flex justify-center mb-6">
        <span
          className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
            step === "login"
              ? "bg-blue-50 text-blue-600"
              : "bg-green-50 text-green-600"
          }`}
        >
          {step === "login"
            ? "Step 1: Credentials"
            : "Step 2: OTP Verification"}
        </span>
      </div>

      {/* ✅ FIXED: removed callbackUrl to avoid double redirect */}
      <button
        onClick={() => signIn("google")}
        disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-slate-700 text-sm"
      >
        <img
          src="https://www.svgrepo.com/show/355037/google.svg"
          className="w-4 h-4"
          alt="Google"
        />
        {status === "loading" ? "Connecting..." : "Continue with Google"}
      </button>

      <div className="relative my-8 text-center">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-100"></span>
        </div>
        <span className="relative bg-white px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Or Secure Local Login
        </span>
      </div>

      {step === "login" && (
        <div className="bg-slate-100/50 p-1.5 rounded-xl flex mb-6">
          <button
            onClick={() => setMode("password")}
            className={`flex-1 py-2 text-xs rounded-lg transition-all font-bold ${
              mode === "password"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500"
            }`}
          >
            Password + OTP
          </button>
          <button
            onClick={() => setMode("otpLogin")}
            className={`flex-1 py-2 text-xs rounded-lg transition-all font-bold ${
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
              className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handlePasswordLogin}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              Login (MFA Required)
            </button>
          </>
        )}

        {step === "login" && mode === "otpLogin" && (
          <>
            <input
              placeholder="Phone Number"
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleOtpLogin}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              Send Verification Code
            </button>
          </>
        )}

        {step === "otpVerification" && (
          <>
            <input
              maxLength={6}
              placeholder="••••••"
              onChange={(e) => setEnteredOtp(e.target.value)}
              className="w-full p-3 rounded-xl text-center text-2xl tracking-[0.5em] font-bold"
            />
            <button
              onClick={verifyOtp}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold"
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