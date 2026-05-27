"use client"

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';


const CreateCategories = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        color: '#000000'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Sending to API:', formData);
        try {
            const response = await axios.post('/api/categories', formData);
            console.log('API Response:', response.data);
            if(response.data.success){
                alert('Category created successfully!');
                setFormData({ name: '', color: '#000000' });
                router.push("/create-todo");
            }
        } catch (error) {
            console.error('Error creating category:', error.response?.data || error.message);
            alert('Failed to create category. Please try again.');
        }   
    }

return (
  <div className="flex items-center justify-center min-h-screen 
  bg-gray-100 text-black 
  dark:bg-[#0f172a] dark:text-slate-200">

    <form
     onSubmit={handleSubmit}  className="p-6 rounded shadow-md w-full max-w-sm 
    bg-white border border-gray-300 
    dark:bg-[#1e293b] dark:border-slate-700">

      <h2 className="text-2xl font-bold mb-4 
      text-gray-800 dark:text-white">
        Create New Category
      </h2>

      <div className="mb-4">
        <label className="block font-bold mb-2 
        text-gray-700 dark:text-slate-400">
          Category Name
        </label>

        <input
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="w-full py-2 px-3 rounded border outline-none
          bg-white text-black border-gray-300
          focus:ring-2 focus:ring-blue-500
          dark:bg-[#334155] dark:text-white dark:border-slate-600"
        />
      </div>

      <div className="mb-4">
        <label className="block font-bold mb-2 
        text-gray-700 dark:text-slate-400">
          Category Color
        </label>

        <input
          type="color"
          value={formData.color}
          onChange={(e) =>
            setFormData({ ...formData, color: e.target.value })
          }
          className="w-full h-10 rounded border cursor-pointer
          border-gray-300 
          dark:border-slate-600"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-all"
      >
        Create Category
      </button>
    </form>
  </div>
);
};

export default CreateCategories;