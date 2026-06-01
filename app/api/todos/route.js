import connectDB from "@/config/Db";
import Createtodo from "@/models/Createtodo";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import Category from "@/models/Category";

export async function GET(request){
    await connectDB();
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {

         const now = new Date();

        const recurringTodos = await Createtodo.find({
            user: token.sub,
            isRecurring: true,
            completed: true,
            nextOccurrence: { $lte: now }
        });

        for (const todo of recurringTodos) {

            todo.completed = false;

            todo.statusTracking = "Pending";

            // move task to next cycle
            todo.dueDate = todo.nextOccurrence;

            await todo.save();
        }

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        const startOfToday = new Date();

        startOfToday.setHours(0, 0, 0, 0);
        const todos = await Createtodo.find({ user: token.sub,
            $or: [
                { 
                    dueDate: { $lte: endOfToday }, statusTracking: { $ne: 'Completed' } },
                { 
                    dueDate: { $exists: false } 
                },
                { 
                    statusTracking: 'Completed', updatedAt: { 
                        $gte: startOfToday 
                    } 
                }
            ]
        })
        .populate("category", "name color")
        .sort({ dueDate: 1 }).lean();
       return NextResponse.json(
  { success: true, todos },
  { status: 200 }
);
    } catch (error) {
        console.error("Error fetching todos:", error);
        return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
    }

}