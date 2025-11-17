import { useEffect, useState } from "react";
import { api } from "../api";
import Navbar from "../components/Navbar";

export default function Budgets() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [budgetInputs, setBudgetInputs] = useState({});

  // Load categories and budgets
  useEffect(() => {
    async function fetchData() {
      const [year, monthNum] = month.split("-");
      
      const catData = await api("/categories");
      const budgetData = await api(
        `/budgets?month=${monthNum}&year=${year}`
      );

      setCategories(catData);
      setBudgets(budgetData);

      // Initialize budget inputs
      const inputs = {};
      catData.forEach((cat) => {
        const budget = budgetData.find((b) => b.categoryId === cat._id);
        inputs[cat._id] = budget ? budget.amount : "";
      });
      setBudgetInputs(inputs);
    }

    fetchData();
  }, [month]);

  async function saveBudget(categoryId) {
    const amount = Number(budgetInputs[categoryId]);
    if (!amount || amount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    const [year, monthNum] = month.split("-");

    // Check if budget already exists
    const existingBudget = budgets.find(
      (b) => b.categoryId === categoryId
    );

    if (existingBudget) {
      // Update existing budget
      await api(`/budgets/${existingBudget._id}`, "PUT", {
        amount
      });
    } else {
      // Create new budget
      await api("/budgets", "POST", {
        categoryId,
        month: Number(monthNum),
        year: Number(year),
        amount
      });
    }

    // Reload budgets
    const budgetData = await api(
      `/budgets?month=${monthNum}&year=${year}`
    );
    setBudgets(budgetData);
    alert("Budget saved!");
  }

  async function deleteBudget(budgetId) {
    if (!confirm("Delete this budget?")) return;

    await api(`/budgets/${budgetId}`, "DELETE");

    const [year, monthNum] = month.split("-");
    const budgetData = await api(
      `/budgets?month=${monthNum}&year=${year}`
    );
    setBudgets(budgetData);
    alert("Budget deleted!");
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Month Selector */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Budgets</h2>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Budgets List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {categories.length === 0 ? (
              <p className="text-gray-600 text-center">
                No categories. <a href="/categories" className="text-blue-600 hover:underline">Create one first.</a>
              </p>
            ) : (
              <div className="space-y-4">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="flex items-center justify-between p-4 bg-gray-50 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      ></span>
                      <span className="font-medium">{cat.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        placeholder="Amount"
                        value={budgetInputs[cat._id] || ""}
                        onChange={(e) =>
                          setBudgetInputs({
                            ...budgetInputs,
                            [cat._id]: e.target.value
                          })
                        }
                        className="w-32 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      <button
                        onClick={() => saveBudget(cat._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Save
                      </button>

                      {budgets.some((b) => b.categoryId === cat._id) && (
                        <button
                          onClick={() => {
                            const budget = budgets.find(
                              (b) => b.categoryId === cat._id
                            );
                            deleteBudget(budget._id);
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
