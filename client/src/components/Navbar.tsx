import { Link, useLocation } from "react-router-dom";
import { useConfirm } from "./ConfirmModal";

export default function Navbar() {
  const location = useLocation();
  const { askConfirm } = useConfirm();

  function handleLogout() {
    askConfirm({
      title: "",
      message: "Are you sure you want to log out?",
      onConfirm: () => {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    });
  }

  const isActive = (path: string) => location.pathname === path ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700 hover:text-blue-600";

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Budget Tracker</h1>

        <div className="flex gap-6">
          <Link to="/dashboard" className={`py-2 transition ${isActive("/dashboard")}`}>
            Dashboard
          </Link>
          <Link to="/categories" className={`py-2 transition ${isActive("/categories")}`}>
            Categories
          </Link>

          <Link to="/reports" className={`py-2 transition ${isActive("/reports")}`}>
            Reports
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
