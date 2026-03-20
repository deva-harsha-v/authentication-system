"use client";

import { useState } from "react";

export default function Signup() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    displayName: "", // ✅ ADDED
    email: "",
    phone: "",
    password: "",
    terms: false,
  });

  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [verified, setVerified] = useState(false);

  // 🔹 Handle input change
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 🔹 Generate OTP
  const sendOtp = () => {
    if (!form.phone) {
      alert("Enter phone number first");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setOtpSent(true);

    alert(`OTP sent to phone (demo): ${otp}`); // ✅ Updated wording
  };

  // 🔹 Verify OTP
  const verifyOtp = () => {
    if (enteredOtp === generatedOtp) {
      setVerified(true);
      alert("OTP Verified ✅");
    } else {
      alert("Invalid OTP ❌");
    }
  };

  // 🔹 Submit form
  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!form.terms) {
      alert("Accept terms & conditions");
      return;
    }

    if (!verified) {
      alert("Verify OTP first");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // ❗ Prevent duplicate users
    const userExists = existingUsers.find(
      (u: any) => u.email === form.email
    );

    if (userExists) {
      alert("User already exists ❌");
      return;
    }

    existingUsers.push(form);

    localStorage.setItem("users", JSON.stringify(existingUsers));

    alert("Signup Successful 🎉");

    window.location.href = "/auth/login";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            style={styles.input}
          />

          {/* ✅ NEW FIELD */}
          <input
            name="displayName"
            placeholder="Display Name"
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="email"
            placeholder="Email"
            type="email"
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="password"
            placeholder="Password"
            type="password"
            onChange={handleChange}
            style={styles.input}
          />
          <p style={{ fontSize: "12px", color: "#555" }}>
            Password should be at least 6 characters. OTP verification is required for account creation.
          </p>

          {/* OTP Section */}
          {!otpSent ? (
            <button type="button" onClick={sendOtp} style={styles.button}>
              Send OTP
            </button>
          ) : (
            <>
              <input
                placeholder="Enter OTP"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                style={styles.input}
              />
              <button type="button" onClick={verifyOtp} style={styles.button}>
                Verify OTP
              </button>
            </>
          )}

          <label style={styles.checkbox}>
            <input
              type="checkbox"
              name="terms"
              onChange={handleChange}
            />
            Accept Terms & Conditions
          </label>

          

          {/* ✅ GDPR / Data awareness */}
          <p style={{ fontSize: "12px", color: "#555" }}>
            This application stores user data locally in your browser for demonstration purposes only. 
            No personal data is transmitted or shared with external servers. 
            In a production system, data would be securely stored and processed in compliance with GDPR regulations.
          </p>
          <p style={{ fontSize: "12px", color: "#555" }}>
            User data is temporarily stored in browser localStorage for this demo system.
          </p>

          <button type="submit" style={styles.submit}>
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f5f5f5",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "350px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    background: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  submit: {
    padding: "10px",
    background: "green",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  checkbox: {
    fontSize: "14px",
  },
};