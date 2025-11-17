import { useEffect, useState } from "react";
import { api } from "../api";
import Navbar from "../components/Navbar";
import ExpenseForm from "../components/ExpenseForm";

export default function Dashboard() {
  const [cats, setCats] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const catData = await api("/categories");
      const expenseData = await api(`/expenses?month=${month}`);

      setCats(catData);
      setExpenses(expenseData);
    }

    fetchData();
  }, [month]);

  function getSpent(catId) {
    return expenses
      .filter((e) => e.categoryId === catId)
      .reduce((sum, e) => sum + e.amount, 0);
  }

  async function handleExpenseAdded() {
    const expenseData = await api(`/expenses?month=${month}`);
    setExpenses(expenseData);
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6 relative">

        {/* Header */}
        <div className="max-w-3xl mx-auto mb-4 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">
            {new Date(month).toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>

          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">

          {/* Category Cards */}
          <div className="space-y-4 mb-6">
            {cats.map((c) => {
              const spent = getSpent(c._id);
              const remaining = c.limit - spent;
              const percent = (spent / c.limit) * 100;

              return (
                <div key={c._id} className="p-5 border rounded-xl bg-gray-50">

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">{c.name}</span>
                    <span
                      className="px-3 py-1 rounded-full text-white text-sm"
                      style={{ backgroundColor: c.color }}
                    >
                      {c.color}
                    </span>
                  </div>

                  <div className="w-full bg-gray-300 h-3 rounded-full mt-3">
                    <div
                      className="h-3 rounded-full"
                      style={{
                        width: `${Math.min(percent, 100)}%`,
                        backgroundColor: c.color,
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-between mt-2 text-sm">
                    <span>Spent: ₹{spent}</span>
                    <span>Limit: ₹{c.limit}</span>
                    <span className={remaining < 0 ? "text-red-600 font-bold" : ""}>
                      Remaining: ₹{remaining}
                    </span>
                  </div>

                  {remaining < 0 && (
                    <div className="mt-2 inline-block bg-red-600 text-white px-3 py-1 rounded-full text-xs">
                      OVER BUDGET
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FAB Button */}
        <button
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-8 right-8 bg-blue-600 text-white w-16 h-16 rounded-full shadow-xl text-3xl flex items-center justify-center hover:bg-blue-700 transition"
        >
          +
        </button>

        {/* Expense Form Modal */}
        <ExpenseForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          categories={cats}
          onExpenseAdded={handleExpenseAdded}
        />
      </div>
    </>
  );
}
