import connectDB from "@/config/Db";
import Createtodo from "@/models/Createtodo";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";



export async function GET(request){
    await connectDB();
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const todos = await Createtodo.find({ user: token.sub })
  .populate("category", "name color") // only required fields
  .sort({ createdAt: -1 }).lean(); // latest first
       return NextResponse.json(
  { success: true, todos },
  { status: 200 }
);
    } catch (error) {
        console.error("Error fetching todos:", error);
        return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
    }

}