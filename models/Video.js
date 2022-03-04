const mongoose = require('mongoose')

const videoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    desc: {
        type: String,
        required: true,
        trim: true
    },
    video: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        required: true,
        default: 0
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

videoSchema.statics = {
    // search function
    search: function(q) {
        return this.find({
            $or: [
                { 'title': { $regex: q, $options: 'i' } },
                { 'desc': { $regex: q, $options: 'i' } }
            ]
        })
    }
}

const Video = mongoose.model('Video', videoSchema)

module.exports = Video