import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    nextOccurrence: {
        type: Date
    },

    statusTracking: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    priorityLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
   recurrence: {
    frequency: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
        required: function () {
            return this.isRecurring;
        }
    },

    interval: {
        type: Number,
        default: 1,
        required: function () {
            return this.isRecurring;
        }
    },

    daysOfWeek: [{
        type: Number,
        enum: [0, 1, 2, 3, 4, 5, 6]
    }],

    endDate: {
        type: Date
    }
},
    completedDates: [{ type: Date }]
},

    {
        timestamps: true
    }
)

export default mongoose.models.Todo || mongoose.model("Todo", todoSchema);