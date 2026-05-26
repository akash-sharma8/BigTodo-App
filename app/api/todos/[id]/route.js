import Createtodo from "@/models/Createtodo";
import connectDB from "@/config/Db";
import { getToken } from "next-auth/jwt";
import Category from "@/models/Category";
import { NextResponse } from "next/server";


export async function PUT(request,context){
    await connectDB();

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });    
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const {id} = await context.params;
    const body = await request.json();
    const { title, description, categoryId, dueDate, priorityLevel, statusTracking } = body;

    if (!title || !description || !categoryId || !priorityLevel || !statusTracking) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingTodo = await Createtodo.findOne({
        _id: id,
        user: token.sub
    });
    if (!existingTodo) {
        return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    const category = await Category.findOne({
        _id: categoryId,
        user: token.sub
    });
    if (!category) {
        return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    try {
        const updatedTodo = await Createtodo.findByIdAndUpdate(
            id,
            {
                 title, description, category: categoryId, dueDate: dueDate ? new Date(dueDate) : undefined, priorityLevel, statusTracking},
            {
                 new: true 
            }
        );
        return NextResponse.json({ success: true, todo: updatedTodo }, { status: 200 });
    } catch (error) {
        console.error("Error updating todo:", error);
        return NextResponse.json({ error: "Failed to update todo" }, { status: 500 });
    }

}

export async function DELETE(request, context) {
    await connectDB();

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    });

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params; // ✅ FIXED

    if (!id) {
        return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const todo = await Createtodo.findOne({
        _id: id,
        user: token.sub
    });

    if (!todo) {
        return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    await Createtodo.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
}

export async function GET(request, context){
    await connectDB();
    try {
        const { id } = await context.params; // ✅ FIXED
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        });
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const todo = await Createtodo.findOne({
            _id: id,
            user: token.sub
        }).populate("category", "name color").lean();
        if (!todo) {
            return NextResponse.json({ error: "Todo not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, todo }, { status: 200 });
    } catch (error) {
        console.error("Error fetching todo:", error);
        return NextResponse.json({ error: "Failed to fetch todo" }, { status: 500 });
    }
}

