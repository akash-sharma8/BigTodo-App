"use client"
import React, { useState, useEffect } from 'react';
import { Paperclip, MapPin, Image, Code, Smile, Calendar, Download, Maximize2, AlertCircle, Link } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Assuming Next.js App Router
const CreateTodo = () => {
  const router = useRouter();
  // 1. Updated state to match Mongoose Schema
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    categoryId: '', // Stores the Category ObjectId
    priorityLevel: 'Medium',
    statusTracking: 'Pending',
    completed: false
  });

  // Mock categories (In a real app, fetch these from your /api/categories)
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        console.log(response.data);
        setCategories(response.data); // Assuming API returns { categories: [...] }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const priorities = ['Low', 'Medium', 'High'];
  const statuses = ['Pending', 'In Progress', 'Completed'];


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sending to MongoDB:', formData);

    try {
      const response = await axios.post('/api/todos/create-todo', formData);
      console.log('Response from API:', response.data);
      if (response.data.success) {
        alert('Task saved successfully!');
        setFormData({
          title: '',
          description: '',
          dueDate: '',
          categoryId: '',
          priorityLevel: 'Medium',
          statusTracking: 'Pending',
          completed: false
        })
        router.push('/dashboard');
      } else {
        alert('Failed to save task. Please try again.');
      }

    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 text-slate-200">
      <div className="w-full max-w-2xl bg-[#1e293b] rounded-xl shadow-2xl p-8 border border-slate-700">
        <h1 className="text-2xl font-bold mb-6">Create New Task</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title (Required) */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-400">Task Title</label>
            <input
              required
              type="text"
              placeholder="What needs to be done?"
              className="w-full bg-[#334155] border-none rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none placeholder-slate-500"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Due Date (Required) */}
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-400">Due Date</label>
              <input
                required
                type="date"
                className="w-full bg-[#334155] rounded-lg p-3 border-none text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            {/* Category Selection (Required - Links to Category Schema) */}
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-400">Category</label>
              <select
              className="w-full bg-[#334155] border-none rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.categoryId}
                onChange={(e) => {
                  if (e.target.value === "add-new") {
                    router.push("/create-categories");
                  } else {
                    setFormData({ ...formData, categoryId: e.target.value });
                  }
                }}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
                <option value="add-new">+ Add New Category</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Priority Level */}
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-400">Priority</label>
              <div className="flex gap-2">
                {priorities.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({ ...formData, priorityLevel: p })}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${formData.priorityLevel === p
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                        : 'bg-[#334155] text-slate-400 hover:bg-[#475569]'
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Tracking */}
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-400">Status</label>
              <select
                className="w-full bg-[#334155] border-none rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.statusTracking}
                onChange={(e) => setFormData({ ...formData, statusTracking: e.target.value })}
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Description (Required) */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-400">Description</label>
            <div className="bg-[#334155] rounded-lg overflow-hidden border border-slate-600 focus-within:ring-2 focus-within:ring-blue-500">
              <div className="flex items-center gap-4 px-4 py-2 border-b border-slate-600 text-slate-500">
                <Paperclip size={14} />
                <Image size={14} />
                <Code size={14} />
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Rich Text</span>
                </div>
              </div>
              <textarea
                required
                placeholder="Describe the task details..."
                rows={4}
                className="w-full bg-transparent border-none p-4 focus:ring-0 outline-none resize-none placeholder-slate-500 text-sm"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg transition-all active:scale-[0.98] shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2"
          >
            Save Task to Database
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTodo;