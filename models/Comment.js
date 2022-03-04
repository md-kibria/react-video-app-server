const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    video: {
        type: mongoose.Types.ObjectId,
        ref: 'Video'
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['comment', 'reply'],
        default: 'comment'
    }
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment