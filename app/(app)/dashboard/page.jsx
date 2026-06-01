"use client"
import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Calendar, PencilLine, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('/api/todos');
        if (response.data.success) {
          setTodos(response.data.todos);
        } else {
          console.error('Failed to fetch todos:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    fetchTodos();
  }, []);

  const handleDeleteTodo = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await axios.delete(`/api/todos/${id}`);
      if (response.data.success) {
        setTodos(todos.filter((todo) => todo._id !== id));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleToggleStatus = async (id, newStatus) => {
    try {
      // NOTE: Your backend patch/put handler should check if it's recurring.
      // If it's recurring and newStatus === 'Completed', the backend updates dueDate instead!
      const response = await axios.put(`/api/todos/${id}/status`, { statusTracking: newStatus });
      if (response.data.success) {
        // If it was a recurring item shifted to completed, your backend will return 
        // the modified document with status back to "Pending" but a newer date.
        if (response.data.todo) {
          setTodos(prev =>
            prev.map(todo =>
              todo._id === id ? (response.data.todo || { ...todo, statusTracking: newStatus }) : todo
            )
          );
        } else {
          setTodos(todos.map(todo => todo._id === id ? { ...todo, statusTracking: newStatus } : todo));
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleEditTodo = (id) => {
    router.push(`/edit-todo/${id}`);
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#0f172a] dark:text-slate-200 p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Events</h1>
          <button
            onClick={() => router.push('/create-todo')}
            className="flex items-center gap-2 text-xs font-bold px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all"
          >
            <Plus size={16} /> New Task
          </button>
        </div>

        {/* List */}
        <div className="grid gap-4 max-w-2xl mx-auto">
          {todos.map((todo) => (
            <div
              key={todo._id}
              className={`group border p-5 rounded-xl transition-all duration-300 bg-gray-100 border-gray-300 dark:bg-slate-800/40 dark:border-slate-700/50 ${todo.statusTracking === 'Completed' ? 'opacity-75' : 'hover:border-indigo-500/50'
                }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1 flex-1">

                  {/* Tags Row */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-gray-200 border border-gray-300 dark:bg-slate-900 dark:border-slate-700"
                      style={{ color: todo.category?.color }}
                    >
                      {todo.category?.name || 'General'}
                    </span>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-gray-200 border border-gray-300 dark:bg-slate-900 dark:border-slate-700 ${todo.priorityLevel === 'High' ? 'text-red-500' : 'text-gray-600 dark:text-slate-400'
                      }`}>
                      {todo.priorityLevel}
                    </span>

                    {/* --- RECURRING BADGE --- */}
                    {todo.isRecurring && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 border border-blue-200 text-blue-600 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-400">
                        <RefreshCw size={10} className="animate-spin-slow" />
                        Repeats {todo.recurrence?.frequency}
                      </span>
                    )}
                  </div>

                  <h2 className={`text-lg font-semibold transition-all ${todo.statusTracking === 'Completed' ? 'text-gray-400 line-through dark:text-slate-500' : 'text-gray-900 dark:text-slate-100'
                    }`}>
                    {todo.title}
                  </h2>

                  <p className={`text-sm leading-relaxed ${todo.statusTracking === 'Completed' ? 'text-gray-400 dark:text-slate-600' : 'text-gray-600 dark:text-slate-400'
                    }`}>
                    {todo.description}
                  </p>

                  {/* Optional Next Occurrence Indicator */}
                  {todo.isRecurring && todo.dueDate && (
                    <p className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1 pt-1">
                      <Calendar size={12} /> Next due: {new Date(todo.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => handleEditTodo(todo._id)}
                    className="p-2 text-gray-500 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-all"
                  >
                    <PencilLine size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo._id)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-300 dark:border-slate-700/30">
                <div className="flex items-center gap-3">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">Status:</label>
                  <select
                    value={todo.statusTracking}
                    onChange={(e) => handleToggleStatus(todo._id, e.target.value)}
                    className={`text-xs font-bold py-1 px-3 rounded-md border bg-white dark:bg-slate-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${todo.statusTracking === 'Completed'
                        ? 'text-emerald-500 border-emerald-400'
                        : todo.statusTracking === 'In Progress'
                          ? 'text-blue-500 border-blue-400'
                          : 'text-amber-500 border-amber-400'
                      }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <span className="text-[11px] text-gray-400 dark:text-slate-600 italic">
                  ID: {todo._id.slice(-6)}
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;