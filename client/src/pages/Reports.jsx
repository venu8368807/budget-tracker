import { useEffect, useState } from "react";
import { api } from "../api";
import Navbar from "../components/Navbar";

export default function Reports() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [report, setReport] = useState([]);

  useEffect(() => {
    async function fetchReport() {
      const data = await api(`/expenses/report/${month}`);
      setReport(data);
    }

    fetchReport();
  }, [month]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Monthly Report</h2>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Report Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Category</th>
                  <th className="px-6 py-4 text-right">Spent</th>
                  <th className="px-6 py-4 text-right">Budget</th>
                  <th className="px-6 py-4 text-right">Remaining</th>
                </tr>
              </thead>
              <tbody>
                {report.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-600">
                      No data for this month
                    </td>
                  </tr>
                ) : (
                  report.map((item) => (
                    <tr
                      key={item.categoryId}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.categoryColor }}
                        ></span>
                        {item.categoryName}
                      </td>
                      <td className="px-6 py-4 text-right">₹{item.spent}</td>
                      <td className="px-6 py-4 text-right">₹{item.budget}</td>
                      <td
                        className={`px-6 py-4 text-right font-semibold ${
                          item.remaining < 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        ₹{item.remaining}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          {report.length > 0 && (
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-gray-600 text-sm">Total Spent</div>
                <div className="text-2xl font-bold">
                  ₹{report.reduce((sum, item) => sum + item.spent, 0)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 text-sm">Total Budget</div>
                <div className="text-2xl font-bold">
                  ₹{report.reduce((sum, item) => sum + item.budget, 0)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 text-sm">Total Remaining</div>
                <div
                  className={`text-2xl font-bold ${
                    report.reduce((sum, item) => sum + item.remaining, 0) < 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  ₹{report.reduce((sum, item) => sum + item.remaining, 0)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
