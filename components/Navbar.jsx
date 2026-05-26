"use client"
import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react';
import { signIn,signOut } from 'next-auth/react';
import { ModeToggle } from './mode-toggle';
const Navbar = () => {
    const { data: session } = useSession();
    return (
        <nav className='sticky top-0 z-10'>
            <div className="relative h-15 flex justify-between items-center text-zinc-900 w-full p-2 px-4 bg-blue-200">
                <Link href="/dashboard">
                    <h1 className="text-2xl font-bold">Todo App</h1>
                </Link>
                <div className='btns flex gap-3'>
                    <Link href="/create-todo">
                       <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium text-sm  px-4 rounded-md  py-2.5  text-center leading-5">Create Todo</button>
                    </Link>
                    <ModeToggle />
                    {session ? (
                        <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium text-sm  px-4 rounded-md  py-2.5  text-center leading-5" onClick={() => signOut()}>
                            Sign Out
                        </button>
                    ) : (
                        <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium text-sm  px-4 rounded-md  py-2.5  text-center leading-5" onClick={() => signIn()}>
                            Sign In
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