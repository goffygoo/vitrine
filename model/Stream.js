import mongoose from 'mongoose'

const { ObjectId } = mongoose.Schema.Types

const Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["RICH_DOC", "VIDEO", "PDF", "IMAGE"],
        required: true,
    },
    url: {
        type: String,
    },
    document: {
        type: Number
    }
})

export default mongoose.model('Class', Schema)