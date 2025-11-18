import { useState } from "react";
import { api } from "../api";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [popup, setPopup] = useState("");
  const [popupType, setPopupType] = useState("info");

  function showPopup(message, type = "info", duration = 2000) {
    setPopup(message);
    setPopupType(type);
    setTimeout(() => {
      setPopup("");
      setPopupType("info");
    }, duration);
  }

  function validateSignup() {
    if (!email.trim()) {
      showPopup("Email is required", "error");
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      showPopup("Enter a valid email address", "error");
      return false;
    }

    if (!password.trim()) {
      showPopup("Password is required", "error");
      return false;
    }

    if (password.length < 6) {
      showPopup("Password must be at least 6 characters", "error");
      return false;
    }

    if (password !== confirmPassword) {
      showPopup("Passwords do not match", "error");
      return false;
    }

    return true;
  }

  async function submit() {
    const wasLogin = isLogin;

    // Validate Signup
    if (!wasLogin) {
      if (!validateSignup()) return;
    }

    try {
      const res = await api(`/auth/${wasLogin ? "login" : "signup"}`, "POST", {
        email,
        password
      });

      console.log("AUTH RESPONSE:", res);

      // LOGIN LOGIC
      if (wasLogin) {
        if (res?.error) {
          showPopup(res.error, "error");
          return;
        }

        if (res?.token) {
          showPopup("Login successful!", "success");

          setTimeout(() => {
            localStorage.setItem("token", res.token);
            window.location.href = "/dashboard";
          }, 800);

          return;
        }

        showPopup("Unexpected login response", "error");
        return;
      }

      // SIGNUP LOGIC
      if (res?.success) {
        showPopup("Signup successful! Please login.", "success");

        setEmail("");
        setPassword("");
        setConfirmPassword("");

        setIsLogin(true);
        return;
      }

      showPopup("Unexpected signup response", "error");
    } catch (err) {
      console.error("AUTH ERROR:", err);

      if (err?.data?.error) {
        showPopup(err.data.error, "error");
      } else if (err?.message) {
        showPopup(err.message, "error");
      } else {
        showPopup("Network error", "error");
      }
    }
  }

  function popupClass() {
    if (popupType === "success") return "bg-green-600 text-white";
    if (popupType === "error") return "bg-red-600 text-white";
    return "bg-blue-600 text-white";
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      {popup && (
        <div
          className={`absolute top-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-md ${popupClass()}`}
        >
          {popup}
        </div>
      )}

      <div
        key={isLogin ? "login-form" : "signup-form"}
        className="bg-white p-6 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <input
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {!isLogin && (
          <input
            type="password"
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        <button
          onClick={submit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <p
          className="text-center mt-4 text-blue-600 cursor-pointer hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Create account" : "Have account? Login"}
        </p>
      </div>
    </div>
  );
}
