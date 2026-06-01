"use client"
import React, { useState, useEffect } from 'react';
import { Paperclip, Image, Code, Trash2, ArrowLeft, Save, Loader2, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';

const EditTodo = () => {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  
  // 1. Setup default structural matching targets for recurrence rules
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    categoryId: '',
    priorityLevel: 'Medium',
    statusTracking: 'Pending',
    completed: false,
    isRecurring: false,
    recurrence: {
      frequency: 'daily',
      interval: 1,
      daysOfWeek: []
    }
  });

  const priorities = ['Low', 'Medium', 'High'];
  const statuses = ['Pending', 'In Progress', 'Completed'];
  const daysOfWeekLabels = [
    { label: 'S', value: 0 },
    { label: 'M', value: 1 },
    { label: 'T', value: 2 },
    { label: 'W', value: 3 },
    { label: 'T', value: 4 },
    { label: 'F', value: 5 },
    { label: 'S', value: 6 }
  ];

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await axios.get(`/api/todos/${id}`);
        if (response.data.success) {
          const todo = response.data.todo;
          
          setFormData({
            title: todo.title || '',
            description: todo.description || '',
            dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '',
            categoryId: todo.category?._id || todo.categoryId || '',
            priorityLevel: todo.priorityLevel || 'Medium',
            statusTracking: todo.statusTracking || 'Pending',
            completed: todo.statusTracking === 'Completed',
            // Load recurrence options safely via optional chaining rules
            isRecurring: todo.isRecurring || false,
            recurrence: {
              frequency: todo.recurrence?.frequency || 'daily',
              interval: todo.recurrence?.interval || 1,
              daysOfWeek: todo.recurrence?.daysOfWeek || []
            }
          });
        } else {
          alert('Failed to fetch task details.');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching todo:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchTodo();
    fetchCategories();
  }, [id, router]);

  const handleDayToggle = (dayValue) => {
    const currentDays = [...formData.recurrence.daysOfWeek];
    const index = currentDays.indexOf(dayValue);
    if (index > -1) {
      currentDays.splice(index, 1);
    } else {
      currentDays.push(dayValue);
    }
    setFormData({
      ...formData,
      recurrence: { ...formData.recurrence, daysOfWeek: currentDays.sort() }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If user disabled repeating rule, pull it from payload explicit states
    const payload = { ...formData };
    if (!payload.isRecurring) {
      payload.recurrence = { frequency: 'daily', interval: 1, daysOfWeek: [] };
    }

    try {
      const response = await axios.put(`/api/todos/${id}`, payload);
      if (response.data.success) {
        alert('Task updated successfully!');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Update failed:', error);
      alert('Error updating task');
    }
  };

  const handleDeleteTodo = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await axios.delete(`/api/todos/${id}`);
      if (response.data.success) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100 text-black dark:bg-[#0f172a] dark:text-slate-200">
      <div className="w-full max-w-2xl rounded-xl shadow-2xl p-8 border bg-white border-gray-300 dark:bg-[#1e293b] dark:border-slate-700">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-black dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <h1 className="text-2xl font-bold">Edit Task</h1>
          <div className="w-10"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-slate-400">Task Title</label>
            <input
              required
              type="text"
              className="w-full p-3 rounded-lg border outline-none bg-white text-black border-gray-300 focus:ring-2 focus:ring-indigo-500 dark:bg-[#334155] dark:text-white dark:border-slate-600"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Due Date & Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-slate-400">Due Date</label>
              <input
                required
                type="date"
                className="w-full p-3 rounded-lg border outline-none bg-white text-black border-gray-300 focus:ring-2 focus:ring-indigo-500 dark:bg-[#334155] dark:text-white dark:border-slate-600"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-slate-400">Category</label>
              <select
                className="w-full p-3 rounded-lg border outline-none bg-white text-black border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-[#334155] dark:text-white dark:border-slate-600"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* --- EDIT RECURRENCE INTEGRATED SECTION --- */}
          <div className="p-4 rounded-lg border bg-gray-50 border-gray-200 dark:bg-[#1b2436] dark:border-slate-700/60 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw size={16} className={formData.isRecurring ? "text-indigo-500" : "text-gray-400"} />
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 block">Repeat Task</label>
                  <span className="text-xs text-gray-400">Manage automation loop rules for this todo</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {formData.isRecurring && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-gray-500 dark:text-slate-400">Frequency</label>
                  <select
                    className="w-full rounded-lg p-2 text-xs bg-white border border-gray-300 text-black outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-[#334155] dark:border-none dark:text-white"
                    value={formData.recurrence.frequency}
                    onChange={(e) => setFormData({
                      ...formData,
                      recurrence: { ...formData.recurrence, frequency: e.target.value, daysOfWeek: [] }
                    })}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 text-gray-500 dark:text-slate-400">Repeat Every X Days/Weeks/Months</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full rounded-lg p-2 text-xs bg-white border border-gray-300 text-black outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-[#334155] dark:border-none dark:text-white"
                    value={formData.recurrence.interval}
                    onChange={(e) => setFormData({
                      ...formData,
                      recurrence: { ...formData.recurrence, interval: parseInt(e.target.value) || 1 }
                    })}
                  />
                </div>

                {formData.recurrence.frequency === 'Weekly' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium mb-2 text-gray-500 dark:text-slate-400">Repeat on specific days</label>
                    <div className="flex gap-1.5 justify-start">
                      {daysOfWeekLabels.map((day) => {
                        const isSelected = formData.recurrence.daysOfWeek.includes(day.value);
                        return (
                          <button
                            type="button"
                            key={day.value}
                            onClick={() => handleDayToggle(day.value)}
                            className={`w-8 h-8 rounded-full text-xs font-bold transition-all border ${
                              isSelected 
                                ? 'bg-indigo-600 border-indigo-500 text-white' 
                                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100 dark:bg-[#334155] dark:border-slate-600 dark:text-slate-300 dark:hover:bg-[#475569]'
                            }`}
                          >
                            {day.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Priority & Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-slate-400">Priority Level</label>
              <div className="flex gap-2">
                {priorities.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({ ...formData, priorityLevel: p })}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      formData.priorityLevel === p ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600 border border-gray-300 hover:bg-gray-300 dark:bg-[#334155] dark:text-slate-400 dark:border-slate-600 dark:hover:bg-[#475569]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-slate-400">Current Status</label>
              <select
                className={`w-full p-3 rounded-lg border text-sm font-bold outline-none bg-white text-black border-gray-300 focus:ring-2 focus:ring-indigo-500 dark:bg-[#334155] dark:border-slate-600 ${
                  formData.statusTracking === "Completed" ? "text-emerald-500 dark:text-emerald-400" : formData.statusTracking === "In Progress" ? "text-blue-500 dark:text-blue-400" : "text-amber-500 dark:text-amber-400"
                }`}
                value={formData.statusTracking}
                onChange={(e) => setFormData({ ...formData, statusTracking: e.target.value })}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-slate-400">Description</label>
            <div className="rounded-lg overflow-hidden border bg-white border-gray-300 dark:bg-[#334155] dark:border-slate-600">
              <div className="flex items-center gap-4 px-4 py-2 border-b text-gray-400 border-gray-300 dark:text-slate-500 dark:border-slate-600">
                <Paperclip size={14} /> <Image size={14} /> <Code size={14} />
              </div>
              <textarea
                required
                rows={4}
                className="w-full p-4 outline-none resize-none text-sm bg-transparent"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all"
            >
              <Save size={18} /> Update Changes
            </button>
            <button
              type="button"
              onClick={handleDeleteTodo}
              className="px-6 rounded-lg border font-bold transition-all border-gray-300 text-gray-500 hover:text-red-500 hover:border-red-500 dark:border-slate-600 dark:text-slate-400"
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