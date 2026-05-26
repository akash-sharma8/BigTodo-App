"use client"
import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Calendar, PencilLine } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
const Dashboard = () => {

  const router = useRouter();

  const handleEditTodo = (id) => {
    router.push(`/edit-todo/${id}`);
  };
  // fetch all todo created by the user and display them in a list
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('/api/todos');
        const data = await response.json();
        if (data.success) {
          setTodos(data.todos);
        } else {
          console.error('Failed to fetch todos:', data.error);
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




  const handleToggleStatus = async(id, newStatus)=>{
    try {
      const response = await axios.put(`/api/todos/${id}/status`, { statusTracking: newStatus });
      if (response.data.success) {
        setTodos(todos.map(todo => todo._id === id ? { ...todo, statusTracking: newStatus } : todo));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }



  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6">
      <div className="max-w-3xl mx-auto">

        {/* Simple Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Events</h1>

        </div>

        {/* The List */}
        <div className="grid gap-4 max-w-2xl mx-auto">
          {todos.map((todo) => (
            <div
              key={todo._id}
              className={`group bg-slate-800/40 border p-5 rounded-xl transition-all duration-300 ${todo.statusTracking === 'Completed' ? 'border-slate-800 opacity-75' : 'border-slate-700/50 hover:border-indigo-500/50'
                }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1 flex-1">
                  {/* Category Tag */}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700"
                      style={{ color: todo.category?.color }}
                    >
                      {todo.category?.name || 'General'}
                    </span>

                    {/* Priority Indicator */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 ${todo.priorityLevel === 'High' ? 'text-red-400' : 'text-slate-400'
                      }`}>
                      {todo.priorityLevel}
                    </span>
                  </div>

                  <h2 className={`text-lg font-semibold transition-all ${todo.statusTracking === 'Completed' ? 'text-slate-500 line-through' : 'text-slate-100'
                    }`}>
                    {todo.title}
                  </h2>
                  <p className={`text-sm leading-relaxed ${todo.statusTracking === 'Completed' ? 'text-slate-600' : 'text-slate-400'
                    }`}>
                    {todo.description}
                  </p>
                </div>

                {/* Action Icons */}
                <div  className="flex items-center gap-1 ml-4">
                  <button onClick={() => handleEditTodo(todo._id)} className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-all" title="Edit Task">
                    <PencilLine size={18} />
                  </button>
                  <button onClick={() => handleDeleteTodo(todo._id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all" title="Delete Task">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700/30">
                <div className="flex items-center gap-3">
                  <label className="text-[11px] font-uppercase font-bold text-slate-500 uppercase tracking-tight">Status:</label>

                  {/* Status Dropdown/Select */}
                  <select
                    value={todo.statusTracking}
                    onChange={(e) => handleToggleStatus(todo._id, e.target.value)}
                    className={`text-xs font-bold py-1 px-3 rounded-md border bg-slate-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors ${todo.statusTracking === 'Completed' ? 'text-emerald-400 border-emerald-500/30' :
                        todo.statusTracking === 'In Progress' ? 'text-blue-400 border-blue-500/30' :
                          'text-amber-400 border-amber-500/30'
                      }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <span className="text-[11px] text-slate-600 italic">
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