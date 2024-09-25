import mongoose, { Schema } from 'mongoose';

const forumPostSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumCategory', required: true },
        createdAt: { type: Date, default: Date.now },
        posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ForumPost' }]
    },
    {
        collection: "ForumPost"
    }
)

const ForumPost = mongoose.models.ForumPost || mongoose.model("ForumPost", forumPostSchema)
export default ForumPost