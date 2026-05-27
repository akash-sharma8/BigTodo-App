"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react"; // Optional: lucide-react for professional icons

export default function ResetPasswordPage() {
  const params = useParams();
  const token = params.token;
  const [password, setPassword] = useState("");
  
  // UI Exclusive States
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(token);
    console.log(password);

    await fetch("/api/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password,
      }),
    });
    
    setIsSubmitted(true); // UI feedback
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-900">
      <div className="w-full max-w-md transform rounded-2xl bg-white p-8 shadow-xl transition-all dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
        
        {/* Conditional rendering for success feedback without breaking your form submit lifecycle */}
        {!isSubmitted ? (
          <>
            {/* Header section */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Create new password
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Your new password must be different from previous passwords.
              </p>
            </div>

            {/* Form execution remains un-altered */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 pr-12 text-sm text-slate-900 outline-none transition duration-150 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-700/50 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
                    required
                  />
                  {/* Password visibility toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md transition duration-150 hover:bg-indigo-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
              >
                Reset Password
              </button>
            </form>
          </>
        ) : (
          /* Clean post-submission success state */
          <div className="flex flex-col items-center text-center py-4 animated fadeIn">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-950/30 dark:text-emerald-400">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
              Password update requested
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              If the token is valid, your credentials have been updated successfully.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}