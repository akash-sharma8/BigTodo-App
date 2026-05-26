import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    color: {
        type: String,
        default: '#3B82F6'
    }
},
{
        timestamps: true
    }
)
categorySchema.index({ name: 1, user: 1 }, { unique: true });

export default mongoose.models.Category || mongoose.model("Category", categorySchema);