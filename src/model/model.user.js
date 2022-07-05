const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: false
    },
    name: {
        type: String,
        required: true,
        unique: false
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female'],
        unique: false
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
});

module.exports = mongoose.model('User', userSchema);