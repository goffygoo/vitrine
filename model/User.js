import mongoose from 'mongoose'

const Schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["TEACHER", "STUDENT", "ADMIN"],
        required: true,
    },
    refreshToken: {
        type: String,
    },
    tokenEAT: {
        type: Number
    }
})

export default mongoose.model('User', Schema)