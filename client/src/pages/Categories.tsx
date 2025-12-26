import { useEffect, useState } from "react";
import { api } from "../api";
import Navbar from "../components/Navbar";
import { useToast } from "../components/Toast";
import { useConfirm } from "../components/ConfirmModal";
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

export default function Categories() {
  const [list, setList] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const { showToast } = useToast();
  const { askConfirm } = useConfirm();
  const { month, setMonth, triggerRefresh } = useMonth();

  // Load categories, month-specific budgets, and expenses
  useEffect(() => {
    async function fetchData() {
      const [year, monthNum] = month.split("-");

      const catData = await api<Category[]>("/categories");
      const budgetData = await api<Budget[]>(`/budgets?month=${monthNum}&year=${year}`);
      const expenseData = await api<Expense[]>(`/expenses?month=${month}`);

      setList(catData);
      setBudgets(budgetData);
      setExpenses(expenseData);
    }
    fetchData();
  }, [month]);

  function getMonthBudget(catId: string) {
    const budget = budgets.find((b) => b.categoryId === catId);
    return budget ? budget.amount : 0;
  }

  async function save() {
    if (!name || !budget) {
      showToast("Please fill all fields", "error");
      return;
    }

    const [year, monthNum] = month.split("-");

    if (editId) {
      // Update existing category
      await api(`/categories/${editId}`, "PUT", {
        name,
        color: "#3B82F6", // Default blue
        budget: Number(budget),
      });

      // Update or create budget entry for the current month
      const existingBudget = budgets.find((b) => b.categoryId === editId);

      if (existingBudget) {
        // Update existing budget
        await api(`/budgets/${existingBudget._id}`, "PUT", {
          amount: Number(budget),
        });
      } else {
        // Create new budget entry for this month
        await api("/budgets", "POST", {
          categoryId: editId,
          month: Number(monthNum),
          year: Number(year),
          amount: Number(budget),
        });
      }
    } else {
      // Create new category
      const newCategory = await api<Category>("/categories", "POST", {
        name,
        color: "#3B82F6", // Default blue
        budget: Number(budget),
      });

      // Automatically create a budget entry for the current month
      await api("/budgets", "POST", {
        categoryId: newCategory._id,
        month: Number(monthNum),
        year: Number(year),
        amount: Number(budget),
      });
    }

    // Refresh data
    const catData = await api<Category[]>("/categories");
    const budgetData = await api<Budget[]>(`/budgets?month=${monthNum}&year=${year}`);
    const expenseData = await api<Expense[]>(`/expenses?month=${month}`);

    setList(catData);
    setBudgets(budgetData);
    setExpenses(expenseData);

    showToast(`Category ${editId ? "updated" : "added"} successfully!`, "success");

    // clear inputs
    setName("");
    setBudget("");
    setEditId(null);
  }

  function edit(cat: Category) {
    setName(cat.name);
    setBudget(String(cat.budget));
    setEditId(cat._id);
  }

  async function deleteCategory(id: string) {
    askConfirm({
      title: "",
      message: "Delete this category?",
      confirmText: "Delete",
      onConfirm: async () => {
        await api(`/categories/${id}`, "DELETE");

        // Refresh all data
        const [year, monthNum] = month.split("-");
        const catData = await api<Category[]>("/categories");
        const budgetData = await api<Budget[]>(`/budgets?month=${monthNum}&year=${year}`);
        const expenseData = await api<Expense[]>(`/expenses?month=${month}`);

        setList(catData);
        setBudgets(budgetData);
        setExpenses(expenseData);

        // Trigger refresh on other pages
        triggerRefresh();

        showToast("Category deleted successfully!", "success");
      }
    });
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg">
          {/* Header with Calendar */}
          <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
            <h2 className="text-3xl font-bold text-gray-800">
              Categories
            </h2>
            <div>
              <p className="text-sm text-gray-500 mb-1 text-right">Selected Month</p>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border p-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Summary Header */}
          <div className="mb-6 flex gap-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm">
            <div className="flex-1 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Spent</p>
              <p className="text-lg font-extrabold text-orange-600 leading-none">₹{totalSpent}</p>
            </div>
            <div className="w-[1px] bg-blue-200 self-stretch"></div>
            <div className="flex-1 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Remaining</p>
              <p className={`text-lg font-extrabold leading-none ${totalRemaining >= 0 ? "text-green-600" : "text-red-600"}`}>₹{totalRemaining}</p>
            </div>
            <div className="w-[1px] bg-blue-200 self-stretch"></div>
            <div className="flex-1 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Budget</p>
              <p className="text-lg font-extrabold text-blue-600 leading-none">₹{totalBudget}</p>
            </div>
          </div>

          {/* Input Section */}
          <div className="space-y-4 mb-6">
            <input
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />




            <input
              placeholder="Target Budget (Warning Threshold)"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex gap-3">
              <button
                onClick={save}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                {editId ? "Update" : "Add"} Category
              </button>
              {editId && (
                <button
                  onClick={() => {
                    setName("");
                    setBudget("");
                    setEditId(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <hr className="my-6" />

          {/* Category List */}
          <div className="space-y-3">
            {budgets.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-lg">
                <span className="font-semibold text-gray-700">
                  No categories with budgets for this month.
                </span>{" "}
                Add a category above to get started.
              </div>
            ) : (
              list.filter((c) => getMonthBudget(c._id) > 0).map((c) => {
                return (
                  <div
                    key={c._id}
                    className="flex justify-between items-center p-4 bg-gray-50 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-lg">{c.name}</div>
                      <div className="text-sm text-gray-600">
                        Budget: ₹{c.budget}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => edit(c)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteCategory(c._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div >
    </>
  );
}
