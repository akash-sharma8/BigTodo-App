"use client"

import React, { useState } from 'react';
import axios from 'axios';



const CreateCategories = () => {
    const [formData, setFormData] = useState({
        name: '',
        color: '#000000'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Sending to API:', formData);
        try {
            const response = await axios.post('/api/categories', formData);
            console.log('Response from API:', response.data);
            if(response.data.success){
                alert('Category created successfully!');
                setFormData({ name: '', color: '#000000' });
            }
        } catch (error) {
            console.error('Error creating category:', error.response?.data || error.message);
            alert('Failed to create category. Please try again.');
        }   
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Category</h2>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Category Name</label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter category name"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="color" className="block text-gray-700 font-bold mb-2">Category Color</label>
                    <input
                        type="color"
                        id="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Create Category
                </button>
            </form>
        </div>
    );
};

export default CreateCategories;