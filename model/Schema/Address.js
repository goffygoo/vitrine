import mongoose from 'mongoose'

const Schema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    postalCode: {
        type: String,
    },
})

export default Schema;