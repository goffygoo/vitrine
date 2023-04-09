import mongoose from 'mongoose'

const { ObjectId } = mongoose.Schema.Types

const Schema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    classes: {
        type: [ObjectId],
        default: []
    },
})

export default mongoose.model('Student', Schema)