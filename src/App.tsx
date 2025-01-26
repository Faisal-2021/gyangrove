import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  ArrowUpDown,
  Edit2,
  Trash2,
  Package,
} from "lucide-react";
import type { InventoryItem, SortDirection } from "./types";

function App() {
  const [items, setItems] = useState<InventoryItem[]>([
    {
      id: "1",
      name: "Laptop",
      category: "Electronics",
      quantity: 5,
      price: 999.99,
      description: "High-performance laptop",
    },
    {
      id: "2",
      name: "Desk Chair",
      category: "Furniture",
      quantity: 15,
      price: 199.99,
      description: "Ergonomic office chair",
    },
  ]);

  const [filter, setFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(items.map((item) => item.category));
    return ["all", ...Array.from(cats)];
  }, [items]);

  const filteredAndSortedItems = useMemo(() => {
    return items
      .filter(
        (item) =>
          (selectedCategory === "all" || item.category === selectedCategory) &&
          (item.name.toLowerCase().includes(filter.toLowerCase()) ||
            item.description.toLowerCase().includes(filter.toLowerCase()))
      )
      .sort((a, b) => {
        const modifier = sortDirection === "asc" ? 1 : -1;
        return (a.quantity - b.quantity) * modifier;
      });
  }, [items, filter, selectedCategory, sortDirection]);

  const handleAddItem = (item: Omit<InventoryItem, "id">) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
    };
    setItems((prev) => [...prev, newItem]);
    setIsModalOpen(false);
  };

  const handleEditItem = (updatedItem: InventoryItem) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Inventory Management
            </h1>
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Item
          </button>
        </div>

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  />
                </div>
              </div>

              <div className="sm:w-48 w-full">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 text-sm font-medium"
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="hover:bg-indigo-50"
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() =>
                        setSortDirection((prev) =>
                          prev === "asc" ? "desc" : "asc"
                        )
                      }
                      className="inline-flex items-center"
                    >
                      Quantity
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedItems.map((item) => (
                  <tr
                    key={item.id}
                    className={item.quantity < 10 ? "bg-red-50" : undefined}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${item.price.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsModalOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 ">
          <div className="bg-white rounded-lg max-w-md w-full p-6 border-2 border-blue-400/40 shadow-blue-400/40 shadow-xl">
            <h2 className="text-lg font-medium mb-4 text-blue-500">
              {editingItem ? "Edit Item" : "Add New Item"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const itemData = {
                  name: formData.get("name") as string,
                  category: formData.get("category") as string,
                  quantity: parseInt(formData.get("quantity") as string, 10),
                  price: parseFloat(formData.get("price") as string),
                  description: formData.get("description") as string,
                };

                if (editingItem) {
                  handleEditItem({ ...itemData, id: editingItem.id });
                } else {
                  handleAddItem(itemData);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingItem?.name}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm placeholder-gray-400"
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  placeholder="Enter item category"
                  type="text"
                  name="category"
                  defaultValue={editingItem?.category}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  defaultValue={editingItem?.quantity}
                  required
                  min="0"
                  placeholder="Enter item quantity"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  defaultValue={editingItem?.price}
                  required
                  min="0"
                  step="0.01"
                  placeholder="Enter item price"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={editingItem?.description}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 text-sm placeholder-gray-400"
                  placeholder="Enter item description"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {editingItem ? "Save Changes" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
