import { useEffect, useState } from "react";
import { api } from "../api";
import Navbar from "../components/Navbar";
import { useMonth } from "../contexts/MonthContext";

interface ReportItem {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  spent: number;
  budget: number;
  remaining: number;
}

export default function Reports() {
  const { month, setMonth, refreshTrigger } = useMonth();
  const [report, setReport] = useState<ReportItem[]>([]);

  useEffect(() => {
    async function fetchReport() {
      const data = await api<ReportItem[]>(`/expenses/report/${month}`);
      setReport(data);
    }

    fetchReport();
  }, [month, refreshTrigger]);

  const totalSpent = report.reduce((sum, item) => sum + item.spent, 0);
  const totalBudget = report.reduce((sum, item) => sum + item.budget, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex flex-wrap justify-between items-end gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Monthly Report</h2>
              <p className="text-xl text-gray-500 font-medium ml-1">
                {new Date(month).toLocaleString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex gap-6 bg-white p-3 px-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Spent</p>
                  <p className="text-lg font-extrabold text-orange-600 leading-none">₹{totalSpent}</p>
                </div>
                <div className="w-[1px] bg-gray-200 h-8 self-center"></div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Remaining</p>
                  <p className={`text-lg font-extrabold leading-none ${totalRemaining >= 0 ? "text-green-600" : "text-red-600"}`}>₹{totalRemaining}</p>
                </div>
                <div className="w-[1px] bg-gray-200 h-8 self-center"></div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Budget</p>
                  <p className="text-lg font-extrabold text-blue-600 leading-none">₹{totalBudget}</p>
                </div>
              </div>

              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border p-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white h-[58px]"
              />
            </div>
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
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-600">
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
                        className={`px-6 py-4 text-right font-semibold ${item.remaining < 0
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
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6 grid grid-cols-3 gap-4 border border-gray-100">
              <div className="text-center">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Spent</div>
                <div className="text-2xl font-extrabold text-orange-600">
                  ₹{totalSpent}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Remaining</div>
                <div
                  className={`text-2xl font-extrabold ${totalRemaining < 0
                    ? "text-red-600"
                    : "text-green-600"
                    }`}
                >
                  ₹{totalRemaining}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Budget</div>
                <div className="text-2xl font-extrabold text-blue-600">
                  ₹{totalBudget}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
