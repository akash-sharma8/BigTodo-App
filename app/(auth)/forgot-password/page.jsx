"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(
      "/api/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();

    setMessage(data.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-[350px]"
      >

        <h1 className="text-2xl font-bold">
          Forgot Password
        </h1>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e)=>
            setEmail(e.target.value)
          }
          className="border p-2 rounded"
        />

        <button className="bg-black text-white p-2 rounded">
          Send Reset Link
        </button>

        {message && (
          <p>{message}</p>
        )}

      </form>
    </div>
  );
}