import { useEffect, useState } from "react";
import { api } from "../api";
import Navbar from "../components/Navbar";

export default function Categories() {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [limit, setLimit] = useState("");
  const [editId, setEditId] = useState(null);

  // Load categories 
  useEffect(() => {
    async function fetchData() {
      const data = await api("/categories");
      setList(data);
    }
    fetchData();
  }, []);

  async function save() {
    if (!name || !color || !limit) {
      alert("Fill all fields");
      return;
    }

    if (editId) {
      // Update existing
      await api(`/categories/${editId}`, "PUT", {
        name,
        color,
        limit: Number(limit),
      });
    } else {
      // Create new
      await api("/categories", "POST", {
        name,
        color,
        limit: Number(limit),
      });
    }

    // reload list
    const updated = await api("/categories");
    setList(updated);

    // clear inputs
    setName("");
    setColor("");
    setLimit("");
    setEditId(null);
  }

  function edit(cat) {
    setName(cat.name);
    setColor(cat.color);
    setLimit(cat.limit);
    setEditId(cat._id);
  }

  async function deleteCategory(id) {
    if (!confirm("Delete this category?")) return;
    await api(`/categories/${id}`, "DELETE");
    const updated = await api("/categories");
    setList(updated);
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            Categories
          </h2>

          {/* Input Section */}
          <div className="space-y-4 mb-6">
            <input
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              placeholder="Color (ex: #ff0000)"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              placeholder="Monthly Limit (ex: 5000)"
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
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
                    setColor("");
                    setLimit("");
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
            {list.map((c) => (
              <div
                key={c._id}
                className="flex justify-between items-center p-4 bg-gray-50 border rounded-lg"
              >
                <div>
                  <div className="font-medium text-lg">{c.name}</div>
                  <div className="text-sm text-gray-600">
                    Limit: ₹{c.limit}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-white text-sm"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.color}
                  </span>

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
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
