import connectDB from "@/config/Db";
import Category from "@/models/Category";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(request){
    await connectDB();
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    try {
        const categories = await Category.find({ user: token.sub });
        return new NextResponse(JSON.stringify(categories), { status: 200 });
    }
    catch (error) { 
        console.error("Error fetching categories:", error);
        return new NextResponse(JSON.stringify({ error: "Failed to fetch categories" }), { status: 500 });
    }
}

export async function POST(request){
    await connectDB();
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if(!token){
        return NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });    
    }
    console.log("TOKEN:", token);
    const body = await request.json();
    try {
        const category = await Category.create({
            name: body.name,
            user: token.sub,
            color: body.color
        });
        console.log("Created category:", category);
        return NextResponse.json({ success: true, category }, { status: 201 });
        
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}