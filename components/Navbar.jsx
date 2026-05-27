"use client"
import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react';
import { signIn, signOut } from 'next-auth/react';
import { ModeToggle } from './mode-toggle';
const Navbar = () => {
    const { data: session } = useSession();
    return (
        <nav className="sticky top-0 z-10 backdrop-blur-md border-b 
  bg-white/80 text-black border-gray-200
  dark:bg-slate-900/80 dark:text-white dark:border-slate-700">

            <div className="flex justify-between items-center w-full px-4 py-3">

                {/* Logo */}
                <Link href="/dashboard">
                    <h1 className="text-xl md:text-2xl font-bold">
                        Todo App
                    </h1>
                </Link>

                {/* Buttons */}
                <div className="flex items-center gap-3">

                    <Link href="/create-todo">
                        <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-heading rounded-xl group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                            <span className=" relative px-4 py-2.5 transition-all ease-in duration-75 bg-neutral-primary-soft rounded-xl group-hover:bg-transparent group-hover:dark:bg-transparent leading-5">
                                Create Todo
                            </span>
                        </button>
                    </Link>

                    <ModeToggle />

                    {session ? (
                        <button onClick={() => signOut()} className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-heading rounded-xl group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-heading focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400">
                            <span className=" relative px-4 py-2.5 transition-all ease-in duration-75 bg-neutral-primary-soft rounded-xl group-hover:bg-transparent group-hover:dark:bg-transparent leading-5">
                                Sign Out
                            </span>
                        </button>
                    ) : (
                        <button onClick={() => signIn()} className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-heading rounded-xl group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                            <span className=" relative px-4 py-2.5 transition-all ease-in duration-75 bg-neutral-primary-soft rounded-xl group-hover:bg-transparent group-hover:dark:bg-transparent leading-5">
                                Sign In
                            </span>
                        </button>
                    )}

                </div>
            </div>
        </nav>
    )
}
export default Navbar
// vlc
// chromium