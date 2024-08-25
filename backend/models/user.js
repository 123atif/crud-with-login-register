const mongoose = require('mongoose')
const task = require('./task.js')

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null },
    dateofbirth: { type: String, default: null },
    address: { type: String, default: null },
    image: { type: String },
    otp: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "task" }]
})

const model = mongoose.model('users', UserSchema);

module.exports = model;