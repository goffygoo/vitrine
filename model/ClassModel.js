import mongoose from 'mongoose'

const { ObjectId } = mongoose.Schema.Types

const Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    backgroundImage: {
        type: String,
    },
    teacher: {
        type: ObjectId,
        required: true,
    },
    students: {
        type: [ObjectId],
        default: []
    },
    streams: {
        type: [ObjectId],
        default: []
    },
    greenBoard: {
        type: [ObjectId],
        default: []
    },
    shelf: {
        type: [{
            name: {
                type: String,
            },
            files: [ObjectId]
        }],
        default: []
    },
    events: {
        type: [ObjectId],
        default: []
    },
})

export default mongoose.model('Class', Schema)