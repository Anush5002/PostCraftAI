import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');

const historySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true }, // 'generate' or 'improve'
    inputText: { type: String, required: true },
    outputs: [{
        content: String,
        text: String,
        image: String,
        imageUrl: String
    }],
}, { timestamps: true });

export const History = mongoose.models.History || mongoose.model('History', historySchema, 'history');
