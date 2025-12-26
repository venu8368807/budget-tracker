import { useEffect, useState } from "react";
import { api } from "../api";
import Navbar from "../components/Navbar";
import ExpenseForm from "../components/ExpenseForm";
import { useMonth } from "../contexts/MonthContext";

interface Category {
  _id: string;
  name: string;
  color: string;
  budget: number;
}

interface Budget {
  _id: string;
  categoryId: string;
  month: number;
  year: number;
  amount: number;
}

interface Expense {
  _id: string;
  categoryId: string;
  amount: number;
  date: string;
}

export default function Dashboard() {
  const [cats, setCats] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { month, setMonth, refreshTrigger } = useMonth();
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [year, monthNum] = month.split("-");

      const catData = await api<Category[]>("/categories");
      const budgetData = await api<Budget[]>(`/budgets?month=${monthNum}&year=${year}`);
      const expenseData = await api<Expense[]>(`/expenses?month=${month}`);

      setCats(catData);
      setBudgets(budgetData);
      setExpenses(expenseData);
    }

    fetchData();
  }, [month, refreshTrigger]);

  const userName = localStorage.getItem("user_name");

  function getSpent(catId: string) {
    return expenses
      .filter((e) => e.categoryId === catId)
      .reduce((sum, e) => sum + e.amount, 0);
  }

  function getBudget(catId: string) {
    const budget = budgets.find((b) => b.categoryId === catId);
    return budget ? budget.amount : 0;
  }

  async function handleExpenseAdded() {
    const expenseData = await api<Expense[]>(`/expenses?month=${month}`);
    setExpenses(expenseData);
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6 relative">

        {/* Header */}
        <div className="max-w-3xl mx-auto mb-6 flex flex-wrap justify-between items-end gap-4">
          <div>
            {userName && (
              <h1 className="text-4xl font-extrabold text-blue-700 mb-2 tracking-tight">
                Welcome, {userName}!
              </h1>
            )}
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

        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
          {/* Category Cards */}
          <div className="space-y-4 mb-6">
            {budgets.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-lg">
                <span className="font-semibold text-gray-700">
                  No budgets added yet.
                </span>{" "}
                Add a budget to a category to get started.
              </div>
            ) : (
              cats.filter((c) => getBudget(c._id) > 0).map((c) => {
                const spent = getSpent(c._id);
                const budget = getBudget(c._id);

                let statusColor = c.color;
                let alertMessage = null;

                if (budget > 0 && spent > budget) {
                  statusColor = "#F59E0B"; // Amber/Orange (Warning)
                  alertMessage = (
                    <div className="mt-2 inline-block bg-amber-500 text-white px-3 py-1 rounded-full text-xs">
                      WARNING: BUDGET EXCEEDED
                    </div>
                  );
                }

                const percent = budget > 0 ? (spent / budget) * 100 : 0;
                const remaining = budget - spent;

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

                    <div className="w-full bg-gray-300 h-3 rounded-full mt-3 overflow-hidden">
                      <div
                        className="h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(percent, 100)}%`,
                          backgroundColor: statusColor,
                        }}
                      ></div>
                    </div>

                    <div className="flex justify-between mt-2 text-sm font-medium text-gray-700">
                      <span>Spent: ₹{spent}</span>
                      <span>Budget: ₹{budget}</span>
                      <span className={remaining >= 0 ? "text-green-600" : "text-red-600"}>Remaining: ₹{remaining}</span>
                    </div>

                    {alertMessage}
                  </div>
                );
              })
            )}
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
