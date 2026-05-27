import User from "@/models/User";
import CreateTodo from "@/app/(app)/create-todo/page";


export const completeTodo = async (req, res) => {
    const { todoId } = req.body;
    const todo = await CreateTodo.findById(todoId);
    if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
    }
    if (todo.isRecurring) {
        const crrentDueDate = new Date(todo.dueDate);
        let nextDueDate = new Date(crrentDueDate);

        if (todo.recurrence.frequency === "Daily") {
            nextDueDate.setDate(crrentDueDate.getDate() + todo.recurrence.interval);
        }
        else if (todo.recurrence.frequency === "Weekly") {
            if (todo.recurrence.daysOfWeek && todo.recurrence.daysOfWeek.length > 0) {
                let foundNextDay = false;

                for (let i = 1; i <= 7; i++) {
                    let checkDate = new Date(crrentDueDate);
                    checkDate.setDate(crrentDueDate.getDate() + i);
                    if (todo.recurrence.daysOfWeek.includes(checkDate.getDay())) {
                        nextDueDate = checkDate;
                        foundNextDay = true;
                        break;
                    }
                }
                if (!foundNextDay) {
                    nextDueDate.setDate(nextDueDate.getDate() + (7 * todo.recurrence.interval))
                }
            }
            else {
                nextDueDate.setDate(nextDueDate.getDate() + (7 * todo.recurrence.interval));
            }
        }
        else if (todo.recurrence.frequency === 'monthly') {
            nextDueDate.setMonth(nextDueDate.getMonth() + todo.recurrence.interval);
        }

        // 2. Save current completion timestamp to history tracking
        todo.completedHistory.push(new Date());

        // 3. Reset status back to Pending and advance the calendar date!
        todo.dueDate = nextDueDate;
        todo.statusTracking = 'Pending';
        todo.completed = false;

        await todo.save();
        return res.json({ success: true, message: "Task advanced to next occurrence!", nextDate: nextDueDate });
    } else {
        // Standard standalone task execution path
        todo.completed = true;
        todo.statusTracking = 'Completed';
        await todo.save();
        return res.json({ success: true, message: "Standard task completed!" });
    }
};