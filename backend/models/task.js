const mongoose = require('mongoose')
const user = require('./user.js')

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    // status: {
    //     type: String,
    //     enum: ['Pending', 'In progress', 'Done'],
    //     // enum to define a set of constants
    //     required: true
    // },
    status: {
        type: Number,
        enum: [0, 1, 2],
        // 0 = Pending, 1 = Inprogress, 2 = Done
        required: true
    },
    start_date: { type: String, required: true, default: null },
    end_date: { type: String, required: true, default: null },
    expiry_status: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "model" }
})

const task = mongoose.model('tasks', taskSchema);

module.exports = task;