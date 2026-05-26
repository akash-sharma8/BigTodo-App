import connectDB from "@/config/Db";
import Createtodo from "@/models/Createtodo";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function PUT(request, context) {
    await connectDB();

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    });

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const { statusTracking } = await request.json();

    if (!statusTracking) {
        return NextResponse.json({ error: "Status required" }, { status: 400 });
    }

    try {
        const todo = await Createtodo.findOneAndUpdate(
            { _id: id, user: token.sub },
            { statusTracking },
            { new: true }
        );

        if (!todo) {
            return NextResponse.json({ error: "Todo not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, todo });

    } catch (error) {
        console.error("Error updating status:", error);
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
}