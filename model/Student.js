import mongoose from 'mongoose';
import Address from './Schema/Address.js';

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
    address: {
        type: Address,
    },
    classes: {
        type: [ObjectId],
        default: []
    },
})

export default mongoose.model('Student', Schema)