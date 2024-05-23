const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    password: {
        type: String,
        required: true
    },
    role: { 
        type: String, 
        required: true, 
        enum: ['user', 'admin'], 
        default: 'user' 
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;