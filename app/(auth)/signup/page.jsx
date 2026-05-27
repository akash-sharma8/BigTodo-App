"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const SignUp = () => {

  const router = useRouter();

  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e) => {

    e.preventDefault();

    if(
    formdata.password !==
    formdata.confirmPassword
  ){
    alert("Passwords do not match");
    return;
  }

    const res = await fetch("/api/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        name: formdata.name,
        email: formdata.email,
        password: formdata.password
      }),
    });

    const data = await res.json();

    console.log(data);

    if(res.ok){
      router.push("/login");
    }
  };
  return (
    <div>
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center px-6 py-8">
      
          <div className="w-full max-w-md bg-white rounded-lg shadow 
          dark:bg-gray-800 dark:border dark:border-gray-700">
      
            <div className="p-6 space-y-6 sm:p-8">
      
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create an account
              </h1>
      
              <form className="space-y-4">
      
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your Name
                  </label>
      
                  <input
                    type="text"
                    id="name"
                    value={formdata.name}
                    onChange={(e) =>
                      setFormdata({ ...formdata, name: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg border 
                    bg-gray-50 text-gray-900 border-gray-300
                    focus:ring-2 focus:ring-blue-500
                    dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    placeholder="John Doe"
                    required
                  />
                </div>
      
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your email
                  </label>
      
                  <input
                    type="email"
                    id="email"
                    value={formdata.email}
                    onChange={(e) =>
                      setFormdata({ ...formdata, email: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg border 
                    bg-gray-50 text-gray-900 border-gray-300
                    focus:ring-2 focus:ring-blue-500
                    dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    placeholder="name@company.com"
                    required
                  />
                </div>
      
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
      
                  <input
                    type="password"
                    id="password"
                    value={formdata.password}
                    onChange={(e) =>
                      setFormdata({ ...formdata, password: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg border 
                    bg-gray-50 text-gray-900 border-gray-300
                    focus:ring-2 focus:ring-blue-500
                    dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    required
                  />
                </div>
      
                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Confirm password
                  </label>
      
                  <input
                    type="password"
                    id="confirm-password"
                    value={formdata.confirmPassword}
                    onChange={(e) =>
                      setFormdata({ ...formdata, confirmPassword: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg border 
                    bg-gray-50 text-gray-900 border-gray-300
                    focus:ring-2 focus:ring-blue-500
                    dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    required
                  />
                </div>
      
                {/* Terms */}
                <div className="flex items-start gap-2">
                  <input
                    id="terms"
                    type="checkbox"
                    className="mt-1"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-500 dark:text-gray-300">
                    I accept the{" "}
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
      
                {/* Button */}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition"
                >
                  Create an account
                </button>
      
                {/* Login link */}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <a href="/login" className="text-blue-600 hover:underline dark:text-blue-400">
                    Login here
                  </a>
                </p>
      
              </form>
            </div>
          </div>
        </section>
    </div>
  )
}
  
  export default SignUp
