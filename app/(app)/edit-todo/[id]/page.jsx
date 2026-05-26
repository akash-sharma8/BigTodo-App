"use client"
import React, { useState, useEffect } from 'react';
import { Paperclip, Image, Code, Trash2, ArrowLeft, Save, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation'; // Assuming Next.js App Router

const EditTodo = () => {
  const router = useRouter();
  const { id } = useParams(); // Gets the Todo ID from the URL

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    categoryId: '',
    priorityLevel: 'Medium',
    statusTracking: 'Pending',
    completed: false
  });

  const priorities = ['Low', 'Medium', 'High'];
    const statuses = ['Pending', 'In Progress', 'Completed'];
       
    useEffect(() => {
        const fetchTodo = async () => {
            try {
                const response = await axios.get(`/api/todos/${id}`);
                if (response.data.success) {
                    const { title, description, dueDate, category, priorityLevel, statusTracking } = response.data.todo;
                    setFormData({
                        title,
                        description,    
                        dueDate: dueDate ? new Date(dueDate).toISOString().split('T')[0] : '',
                        categoryId: category._id,
                        priorityLevel: priorityLevel || 'Medium',
                        statusTracking: statusTracking || 'Pending',
                        completed: statusTracking === 'Completed'
                    });
                } else {
                    alert('Failed to fetch task details. Please try again.');
                    router.push('/dashboard');
                }
            } catch (error) {
                console.error('Error fetching todo:', error);
                alert('An error occurred while fetching task details.');
                router.push('/dashboard');
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/categories');
                setCategories(response.data); // Assuming API returns { categories: [...] }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchTodo();
        fetchCategories();
        setLoading(false);
    }
    , [id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.put(`/api/todos/${id}`, formData);
        if (response.data.success) {
            alert('Task updated successfully!');
            router.push('/dashboard');
        }
    } catch (error) {
        console.error('Update failed:', error);
        alert('Error updating task');
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 text-slate-200">
      <div className="w-full max-w-2xl bg-[#1e293b] rounded-xl shadow-2xl p-8 border border-slate-700">
        
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <h1 className="text-2xl font-bold">Edit Task</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-400">Task Title</label>
            <input
              required
              type="text"
              className="w-full bg-[#334155] border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-400">Due Date</label>
              <input
                required
                type="date"
                className="w-full bg-[#334155] border border-slate-600 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            {/* Category */}
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
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-400">Priority Level</label>
              <div className="flex gap-2">
                {priorities.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({ ...formData, priorityLevel: p })}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      formData.priorityLevel === p 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' 
                      : 'bg-[#334155] text-slate-400 border border-slate-600 hover:bg-[#475569]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Tracking */}
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-400">Current Status</label>
              <select
                className={`w-full bg-[#334155] border rounded-lg p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  formData.statusTracking === 'Completed' ? 'border-emerald-500/50 text-emerald-400' : 
                  formData.statusTracking === 'In Progress' ? 'border-blue-500/50 text-blue-400' : 'border-slate-600 text-amber-400'
                }`}
                value={formData.statusTracking}
                onChange={(e) => setFormData({ ...formData, statusTracking: e.target.value })}
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-400">Description</label>
            <div className="bg-[#334155] rounded-lg overflow-hidden border border-slate-600">
              <div className="flex items-center gap-4 px-4 py-2 border-b border-slate-600 text-slate-500">
                <Paperclip size={14} />
                <Image size={14} />
                <Code size={14} />
              </div>
              <textarea
                required
                rows={4}
                className="w-full bg-transparent border-none p-4 focus:ring-0 outline-none resize-none text-sm"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/20"
            >
              <Save size={18} />
              Update Changes
            </button>
            
            <button
              type="button"
              className="px-6 bg-slate-700 hover:bg-red-500/20 hover:text-red-400 text-slate-400 font-bold rounded-lg transition-all border border-slate-600 hover:border-red-500/50"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTodo;