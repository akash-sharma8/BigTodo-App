import { NextResponse } from "next/server";
import connectDB from "@/config/Db";
import Category from "@/models/Category";
import { getToken } from "next-auth/jwt";


export async function GET(request, { params }) {
    await connectDB();
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const category = await Category.findOne({
            _id: params.id,
            user: token.sub
        });
        if (!params.id) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }
        if (!category) {
            return new NextResponse(JSON.stringify({ error: "Category not found" }), { status: 404 });
        }
        return new NextResponse(JSON.stringify(category), { status: 200 });
    } catch (error) {
        console.error("Error fetching category:", error);
        return new NextResponse(JSON.stringify({ error: "Failed to fetch category" }), { status: 500 });
    }

}

export async function PUT(request, { params }) {
    await connectDB();

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const body = await request.json();
    try {
        const updated = await Category.findOneAndUpdate(
            { _id: params.id, user: token.sub },
            { name: body.name, color: body.color },
            { new: true }
        );
        if (!params.id) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }
        if (!updated) {
            return new NextResponse(JSON.stringify({ error: "Category not found" }), { status: 404 });
        }
        return new NextResponse(JSON.stringify(updated), { status: 200 });
    } catch (error) {
        console.error("Error updating category:", error);
        return new NextResponse(JSON.stringify({ error: "Failed to update category" }), { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    await connectDB();

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const deleted = await Category.findOneAndDelete({
            _id: params.id,
            user: token.sub
        });
        if (!params.id) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }
        if (!deleted) {
            return new NextResponse(JSON.stringify({ error: "Category not found" }), { status: 404 });
        }
        return new NextResponse(JSON.stringify({ message: "Category deleted successfully" }), { status: 200 });
    } catch (error) {
        console.error("Error deleting category:", error);
        return new NextResponse(JSON.stringify({ error: "Failed to delete category" }), { status: 500 });
    }
}