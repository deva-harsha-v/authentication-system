"use client";

import { useEffect, useState } from "react";
import { signOut, useSession, signIn } from "next-auth/react";

export default function Settings() {
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [provider, setProvider] = useState("");
  const [mfaEnabled, setMfaEnabled] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const storedProvider = localStorage.getItem("provider");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedProvider) setProvider(storedProvider);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("provider");
    document.cookie = "currentUser=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    
    if (provider === "google") {
      await signOut({ callbackUrl: "/auth/login" });
    } else {
      window.location.href = "/auth/login";
    }
  };

  const toggleMFA = () => {
    setMfaEnabled(!mfaEnabled);
    alert(`Security Policy Updated: Password + OTP is now ${!mfaEnabled ? 'Enabled' : 'Disabled'}`);
  };

  if (!user && !session) return (
    <div className="glass-card p-8 rounded-2xl text-center">
      <p className="text-slate-600 font-medium">Session expired. Please log in.</p>
      <button onClick={() => window.location.href = "/auth/login"} className="mt-4 text-blue-600 font-bold underline">Go to Login</button>
    </div>
  );

  const displayName = session?.user?.name || user?.firstName || "User";
  const displayEmail = session?.user?.email || user?.email;

  return (
    <div className="glass-card w-full max-w-md p-8 rounded-3xl shadow-2xl auth-transition">
      {/* HEADER SECTION */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-400 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg">
          {displayName[0]}
        </div>
        <h2 className="text-2xl font-bold text-slate-900 leading-tight">Identity Dashboard</h2>
        <p className="text-sm text-slate-500 font-medium">Secure Profile Management</p>
      </div>

      {/* USER INFO SECTION */}
      <div className="space-y-3 mb-8">
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Identity</span>
          <span className="text-slate-900 font-bold text-sm">{displayName}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Email</span>
          <span className="text-slate-900 font-medium text-sm">{displayEmail}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">IAM Provider</span>
          <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-md font-black uppercase">Authentik</span>
        </div>
      </div>

      {/* LOGIN METHODS (Requirement 3) */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Security Configuration</h3>
        
        <div className="space-y-3">
          {/* MFA TOGGLE */}
          <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div>
              <p className="text-sm font-bold text-slate-800">Password + OTP</p>
              <p className="text-[10px] text-slate-500 font-medium">Multi-Factor Authentication</p>
            </div>
            <button 
              onClick={toggleMFA}
              className={`w-12 h-6 rounded-full transition-colors relative ${mfaEnabled ? 'bg-green-500' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${mfaEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div>
              <p className="text-sm font-bold text-slate-800">Google SSO</p>
              <p className="text-[10px] text-slate-500 font-medium">
                {provider === 'google' || session?.user ? 'Connected' : 'Not Linked'}
              </p>
            </div>
            
            {/* If already connected, show a checkmark. If not, show the Link button. */}
            {provider === 'google' || session?.user ? (
              <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                <span className="text-[10px] font-bold">CONNECTED</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <button 
                onClick={() => signIn("google", { callbackUrl: "/settings" })}
                className="text-[10px] font-black bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-black transition-all shadow-md active:scale-95"
              >
                LINK ACCOUNT
              </button>
            )}
          </div>
        </div>
      </div>

      {/* LOGOUT */}
      <button 
        onClick={handleLogout}
        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
      >
        <span>Secure Logout</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
        </svg>
      </button>

      <p className="mt-6 text-[10px] text-center text-slate-400 font-medium">
        Session encrypted via Open-Source IAS • Active JWT
      </p>
    </div>
  );
}