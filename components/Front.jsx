"use client";
import React from 'react'
import { motion } from 'framer-motion';
const Front = () => {
  return (


    <div className="relative h-[91.7vh] w-full flex bg-slate-950">
      <div className="absolute bottom-0 left-0 text-orange-500 text-8xl flex justify-center items-center right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]"><motion.div 
        // Start small and invisible
        initial={{ scale: 0.5, opacity: 0 }} 
        // Animate to full size and visible
        animate={{ scale: 1, opacity: 1 }} 
        // Optional: fine-tune the "feel"
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute bottom-0 left-0 text-orange-500 text-8xl flex justify-center items-center right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]"
      >
        Welcome to the Todo App
      </motion.div>
      </div>
    </div>


  )
}

export default Front
