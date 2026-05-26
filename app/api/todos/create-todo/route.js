import Createtodo from "@/models/Createtodo";
import connectDB from "@/config/Db";
import { getToken } from "next-auth/jwt";
import Category from "@/models/Category";
import { NextResponse } from "next/server";


export async function POST(request) {
    await connectDB();
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, categoryId, dueDate, priorityLevel,statusTracking,completed } = body;
    console.log(body);

    if (!title?.trim() || !description?.trim() || !categoryId) {
        return NextResponse.json({ error: "Title, description, and category are required" }, { status: 400 });
    }

    const category = await Category.findOne({
        _id: categoryId,
        user: token.sub
    });
    if (!category) {
        return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const todo = await Createtodo.create({
        title,
        description,
        category: categoryId,
        user: token.sub,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priorityLevel: priorityLevel || "Medium",
        statusTracking: statusTracking || "Pending",
        completed: completed || false
    });

    try {
        return NextResponse.json({ success: true, todo }, { status: 201 });
    } catch (error) {
        console.error("Error creating todo:", error);
        return NextResponse.json({ error: "Failed to create todo" }, { status: 500 });
    }

}


