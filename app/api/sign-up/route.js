import UserModel from "@/models/User"
import connectDB from "@/config/Db"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server";
export async function POST(req) {
    try {
        await connectDB()
        const {name, email, password} = await req.json();
        const existingUser = await UserModel.findOne({ email })
        if(existingUser){
            return NextResponse.json({ message: "User already exists" }, { status: 400 })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            
        })
        const token = jwt.sign({ email }, process.env.NEXTAUTH_SECRET, { expiresIn: "1h" })
        const response = NextResponse.json({ message: "User created successfully" , success: true}, { status: 200 })
                response.cookies.set("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 3600, // 1 hour
                })
        
                return response;
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}