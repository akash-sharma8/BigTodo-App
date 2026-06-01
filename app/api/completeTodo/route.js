import User from "@/models/User";
import CreateTodo from "@/models/Createtodo";
import connectDB from "@/config/Db";

export const completeTodo = async (req, res) => {

    await connectDB();

    const { todoId } = req.body;

    if (!todoId) {
        return res.status(400).json({ error: "todoId missing" });
    }

    const todo = await CreateTodo.findById(todoId);

    if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
    }

    try {

        if (todo.isRecurring) {

            const currentDueDate = new Date(todo.dueDate);
            let nextDueDate = new Date(currentDueDate);

            if (todo.recurrence.frequency === "Daily") {
                nextDueDate.setDate(currentDueDate.getDate() + todo.recurrence.interval);
            }

            else if (todo.recurrence.frequency === "Weekly") {

                if (todo.recurrence.daysOfWeek?.length) {

                    for (let i = 1; i <= 7; i++) {

                        let checkDate = new Date(currentDueDate);
                        checkDate.setDate(currentDueDate.getDate() + i);

                        if (todo.recurrence.daysOfWeek.includes(checkDate.getDay())) {
                            nextDueDate = checkDate;
                            break;
                        }
                    }
                } else {
                    nextDueDate.setDate(nextDueDate.getDate() + 7 * todo.recurrence.interval);
                }
            }

            else if (todo.recurrence.frequency === "Monthly") {
                nextDueDate.setMonth(nextDueDate.getMonth() + todo.recurrence.interval);
            }

            todo.completedDates.push(new Date());
            todo.completed = true;
            todo.statusTracking = "Completed";
            todo.nextOccurrence = nextDueDate;

        } else {

            todo.statusTracking = "Completed";
            todo.completed = true;
        }

        const saved = await todo.save();

        console.log("SAVED TODO:", saved);

        return res.json({
            success: true,
            message: "Todo updated",
            todo: saved
        });

    } catch (err) {

        console.error("SAVE ERROR:", err);

        return res.status(500).json({
            error: "Failed to update todo"
        });
    }
};