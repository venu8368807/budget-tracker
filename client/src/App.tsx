import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Categories from "./pages/Categories";

import { ReactNode } from "react";
import { ToastProvider } from "./components/Toast";
import { ConfirmProvider } from "./components/ConfirmModal";
import { MonthProvider } from "./contexts/MonthContext";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ConfirmProvider>
          <MonthProvider>
            <Routes>
              <Route path="/" element={<Auth />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories"
                element={
                  <ProtectedRoute>
                    <Categories />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </MonthProvider>
        </ConfirmProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
