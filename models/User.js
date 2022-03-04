const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    img: String,
    list: {
        type: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Video'
            }
        ]
    },
    position: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User