import mongoose from 'mongoose'
import { USER_TYPES } from '../constants/index.js'

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
        enum: [USER_TYPES.TEACHER, USER_TYPES.STUDENT, USER_TYPES.ADMIN],
        required: true,
    },
    refreshToken: {
        type: String,
    },
})

export default mongoose.model('User', Schema)