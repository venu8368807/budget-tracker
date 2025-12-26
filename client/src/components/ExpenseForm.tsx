import { useState } from "react";
import { api } from "../api";
import { useToast } from "./Toast";

interface Category {
  _id: string;
  name: string;
}

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onExpenseAdded: () => void;
}

export default function ExpenseForm({ isOpen, onClose, categories, onExpenseAdded }: ExpenseFormProps) {
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const { showToast } = useToast();

  async function submit() {
    if (!categoryId || !amount || !date) {
      showToast("Please fill all fields", "error");
      return;
    }

    const res = await api<any>("/expenses", "POST", {
      categoryId,
      amount: Number(amount),
      date
    });

    if (res.error) {
      showToast("Error: " + res.error, "error");
      return;
    }

    // Success! Show toast and close immediately
    const isOver = res.status === "over_budget";
    const message = isOver
      ? `Added! Over budget (₹${res.totalSpent} / ₹${res.budgetAmount})`
      : `Added! Within budget (₹${res.totalSpent} / ₹${res.budgetAmount})`;

    showToast(message, isOver ? "warning" : "success");

    // Reset form
    setCategoryId("");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);

    // Close and refresh immediately
    onExpenseAdded();
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add Expense</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Category Dropdown */}
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Amount */}
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Date */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={submit}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
