import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email']
        },
        password: {
            type: String,
        },
        googleId: {
            type: String
        },
        avatar: {
            type: String,
            default: "https://static.thenounproject.com/png/363639-200.png"
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: "user"
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        refreshToken: { type: String },
        reptiles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reptile" }],
        threads: [{ type: mongoose.Schema.Types.ObjectId, ref: "ForumThread" }],
        posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "ForumPost" }]
    },
    {
        collection: "User"
    }
)

const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User