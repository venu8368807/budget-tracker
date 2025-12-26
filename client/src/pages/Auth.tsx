import { useState } from "react";
import { api } from "../api";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [popup, setPopup] = useState("");
  const [popupType, setPopupType] = useState<"info" | "error" | "success">("info");

  function showPopup(message: string, type: "info" | "error" | "success" = "info", duration = 2000) {
    setPopup(message);
    setPopupType(type);
    setTimeout(() => {
      setPopup("");
      setPopupType("info");
    }, duration);
  }

  function validateSignup() {
    if (!name.trim()) {
      showPopup("Name is required", "error");
      return false;
    }

    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      showPopup("Name can only contain letters and spaces", "error");
      return false;
    }

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

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      showPopup(
        "Password must be strong: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol",
        "error",
        4000
      );
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
      const res = await api<any>(`/auth/${wasLogin ? "login" : "signup"}`, "POST", {
        name,
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
            if (res.user?.name) localStorage.setItem("user_name", res.user.name);
            window.location.href = "/dashboard";
          }, 800);

          return;
        }

        showPopup("Unexpected login response", "error");
        return;
      }

      // SIGNUP LOGIC
      if (res?.token) {
        showPopup("Signup successful!", "success");

        setTimeout(() => {
          localStorage.setItem("token", res.token);
          if (res.user?.name) localStorage.setItem("user_name", res.user.name);
          window.location.href = "/dashboard";
        }, 800);

        return;
      }

      if (res?.success) {
        // Fallback for old behaviour if needed, but primarily we expect token now
        showPopup("Signup successful! Please login.", "success");
        setIsLogin(true);
        return;
      }

      showPopup("Unexpected signup response", "error");
    } catch (err: any) {
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

  function toggleMode() {
    setIsLogin(!isLogin);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPopup("");
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

        {!isLogin && (
          <input
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>

        {!isLogin && (
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
        )}

        <button
          onClick={submit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <p
          className="text-center mt-4 text-blue-600 cursor-pointer hover:underline"
          onClick={toggleMode}
        >
          {isLogin ? "New User ? Create" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}
