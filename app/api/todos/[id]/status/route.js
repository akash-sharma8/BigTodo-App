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
            {
                _id: id,
                user: token.sub
            },
        );

        if (!todo) {
            return NextResponse.json({ error: "Todo not found" }, { status: 404 });
        }
        if (statusTracking === "Completed" && todo.isRecurring) {
            let nextDueDate = todo.dueDate ? new Date(todo.dueDate) : new Date();
            const interval = todo.recurrence?.interval || 1;
            const freq = todo.recurrence?.frequency || 'Daily';

            if (freq === 'Daily') {
                nextDueDate.setDate(nextDueDate.getDate() + interval);
            }
            else if (freq === 'Weekly') {
                const daysOfWeek = todo.recurrence?.daysOfWeek || [];
                if (daysOfWeek.length > 0) {
                    let matchFound = false;
                    // Look up to 7 days ahead to find the next active weekday match
                    for (let i = 1; i <= 7; i++) {
                        let candidateDate = todo.dueDate ? new Date(todo.dueDate) : new Date();
                        candidateDate.setDate(candidateDate.getDate() + i);
                        if (daysOfWeek.includes(candidateDate.getDay())) {
                            nextDueDate = candidateDate;
                            matchFound = true;
                            break;
                        }
                    }
                    if (!matchFound) {
                        nextDueDate.setDate(nextDueDate.getDate() + (7 * interval));
                    }
                } else {
                    nextDueDate.setDate(nextDueDate.getDate() + (7 * interval));
                }
            }
            else if (freq === 'Monthly') {
                nextDueDate.setMonth(nextDueDate.getMonth() + interval);
            }

            // Update parameters to cycle task forward safely
            todo.dueDate = nextDueDate;
            todo.statusTracking = 'Pending'; // Cycle status back to Pending for the next day

            // Push current date timestamp into historical tracking array if it exists in your schema
            if (todo.completedHistory) {
                todo.completedHistory.push(new Date());
            }

            await todo.save();

            // Populate category details so dashboard rendering doesn't break
            const populatedTodo = await Createtodo.findById(todo._id).populate("category", "name color");


            return NextResponse.json({ success: true, populatedTodo });

        }
        if (statusTracking === "Completed") {
            todo.statusTracking = "Completed";
            todo.completed = true;
        } else {
            todo.statusTracking = statusTracking;
            todo.completed = false; 
        }

        await todo.save();


        const populatedStandardTodo = await Createtodo.findById(todo._id).populate("category", "name color");
        return NextResponse.json({ success: true, todo: populatedStandardTodo });
    } catch (error) {
        console.error("Error updating status:", error);
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
}