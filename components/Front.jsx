"use client";
import React from "react";
import { motion } from "framer-motion";

const Front = () => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center
    bg-white text-black 
    dark:bg-slate-950 dark:text-white">

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl md:text-6xl font-bold text-center
        bg-[radial-gradient(circle_400px_at_50%_100px,#cbd5f5,transparent)]
        dark:bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]"
      >
        Welcome to the Todo App
      </motion.div>

    </div>
  );
};

export default Front;