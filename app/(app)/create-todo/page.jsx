"use client"
import React, { useState, useEffect } from 'react';
import { Paperclip, MapPin, Image, Code, Smile, Calendar, Download, Maximize2, AlertCircle, Link, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Assuming Next.js App Router
const CreateTodo = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    categoryId: '', // Stores the Category ObjectId
    priorityLevel: 'Medium',
    statusTracking: 'Pending',
    completed: false,
    isRecurring: false,
    recurrence: {
      frequency: 'Daily',
      interval: 1,
      daysOfWeek: [], 
  }  });

  const [categories, setCategories] = useState([]);
  useEffect(() => {

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
  const  daysOfWeekLabels=[
    { label: 'S', value: 0 },
    { label: 'M', value: 1 },
    { label: 'T', value: 2 },
    { label: 'W', value: 3 },
    { label: 'T', value: 4 },
    { label: 'F', value: 5 },
    { label: 'S', value: 6 }
  ];

const handleDayToggle = (dayValue) => {
  const currentDays = formData.recurrence.daysOfWeek;

  let updatedDays;

  if (currentDays.includes(dayValue)) {
    updatedDays = currentDays.filter(day => day !== dayValue);
  } else {
    updatedDays = [...currentDays, dayValue];
  }

  setFormData({
    ...formData,
    recurrence: {
      ...formData.recurrence,
      daysOfWeek: updatedDays
    }
  });
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sending to MongoDB:', formData);
    const payload = { ...formData };
    if (!payload.isRecurring) {
      delete payload.recurrence;
    }

    console.log('Sending to MongoDB:', payload);
    try {
      const response = await axios.post('/api/todos/create-todo', payload);
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
          completed: false,
          isRecurring: false,
          recurrence: {
            frequency: 'Daily',
            interval: 1,
            daysOfWeek: []
          }
        });
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-white text-black dark:bg-[#0f172a] dark:text-slate-200">
      <div className="w-full max-w-2xl rounded-xl shadow-2xl p-8 border bg-gray-100 border-gray-300 dark:bg-[#1e293b] dark:border-slate-700">
        
        <h1 className="text-2xl font-bold mb-6">Create New Task</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-slate-400">
              Task Title
            </label>
            <input
              required
              type="text"
              placeholder="What needs to be done?"
              className="w-full rounded-lg p-3 outline-none bg-white border border-gray-300 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:bg-[#334155] dark:border-none dark:text-white dark:placeholder-slate-500"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Row 1: Due Date & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-slate-400">
                Due Date
              </label>
              <input
                required
                type="date"
                className="w-full rounded-lg p-3 text-sm outline-none bg-white border border-gray-300 text-black focus:ring-2 focus:ring-blue-500 dark:bg-[#334155] dark:border-none dark:text-white"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-slate-400">
                Category
              </label>
              <select
                className="w-full rounded-lg p-3 text-sm outline-none bg-white border border-gray-300 text-black focus:ring-2 focus:ring-blue-500 dark:bg-[#334155] dark:border-none dark:text-white"
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

          {/* --- RECURRENCE TOGGLE PANEL --- */}
          <div className="p-4 rounded-lg border bg-gray-50 border-gray-200 dark:bg-[#1b2436] dark:border-slate-700/60 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw size={16} className={formData.isRecurring ? "text-blue-500 animate-spin-slow" : "text-gray-400"} />
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 block">Repeat Task</label>
                  <span className="text-xs text-gray-400">Automatically recreate this task contextually</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Expandable options panel below toggle */}
            {formData.isRecurring && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                
                {/* Frequency Picker */}
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-gray-500 dark:text-slate-400">Frequency</label>
                  <select
                    className="w-full rounded-lg p-2 text-xs bg-white border border-gray-300 text-black outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#334155] dark:border-none dark:text-white"
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

                {/* Interval Input */}
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-gray-500 dark:text-slate-400">
                    Repeat Every {formData.recurrence.interval} {formData.recurrence.frequency.replace('ly', '(s)')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full rounded-lg p-2 text-xs bg-white border border-gray-300 text-black outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#334155] dark:border-none dark:text-white"
                    value={formData.recurrence.interval}
                    onChange={(e) => setFormData({
                      ...formData,
                      recurrence: { ...formData.recurrence, interval: parseInt(e.target.value) || 1 }
                    })}
                  />
                </div>

                {/* Specific days conditionally shown for Weekly */}
                {formData.recurrence.frequency === 'Weekly' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium mb-2 text-gray-500 dark:text-slate-400">Repeat on specific days</label>
                    <div className="flex gap-1.5 justify-between sm:justify-start">
                      {daysOfWeekLabels.map((day) => {
                        const isSelected = formData.recurrence.daysOfWeek.includes(day.value);
                        return (
                          <button
                            type="button"
                            key={day.value}
                            onClick={() => handleDayToggle(day.value)}
                            className={`w-8 h-8 rounded-full text-xs font-bold transition-all border ${
                              isSelected 
                                ? 'bg-blue-600 border-blue-500 text-white' 
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

          {/* Row 2: Priority & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-slate-400">
                Priority
              </label>
              <div className="flex gap-2">
                {priorities.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({ ...formData, priorityLevel: p })}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      formData.priorityLevel === p
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-[#334155] dark:text-slate-400 dark:hover:bg-[#475569]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-slate-400">
                Status
              </label>
              <select
                className="w-full rounded-lg p-3 text-sm outline-none bg-white border border-gray-300 text-black focus:ring-2 focus:ring-blue-500 dark:bg-[#334155] dark:border-none dark:text-white"
                value={formData.statusTracking}
                onChange={(e) => setFormData({ ...formData, statusTracking: e.target.value })}
              >
                {statuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-slate-400">
              Description
            </label>
            <div className="rounded-lg overflow-hidden border bg-white border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 dark:bg-[#334155] dark:border-slate-600">
              <div className="flex items-center gap-4 px-4 py-2 border-b text-gray-500 border-gray-300 dark:border-slate-600 dark:text-slate-500">
                <Paperclip size={14} />
                <Image size={14} />
                <Code size={14} />
              </div>
              <textarea
                required
                placeholder="Describe the task details..."
                rows={4}
                className="w-full bg-transparent border-none p-4 outline-none resize-none text-sm text-black placeholder-gray-400 dark:text-white dark:placeholder-slate-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg transition-all active:scale-[0.98] shadow-xl"
          >
            Save Task to Database
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTodo;