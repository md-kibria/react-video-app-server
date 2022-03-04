const Comment = require('../models/Comment')
const errRes = require('../utils/errRes')
const Video = require('../models/Video')

// create comment
const createComment = async (req, res) => {
    const {comment} = req.body
    const {video} = req.params

    // if comment is undefined
    if(!comment) {
        res.status(400).json({
            errors: {
                msg: 'Please submit your comment'
            }
        })
    }

    // if comment is empty string
    if(comment.length === 0 ) {
        res.status(400).json({
            errors: {
                msg: 'Please submit your comment'
            }
        })
    }
    
    const newComment = new Comment({
        text: comment,
        video,
        author: req.user._id
    })

    try {

        const videoRes = await Video.findById(video)

        if(!videoRes) {
            res.status(404).json({
                status: 'not found',
                msg: 'video not found for comment'
            })
        }

        const commentRes = await newComment.save()

        res.status(201).json({
            status: 'ok',
            msg: 'comment successfully',
            comment: commentRes
        })

    } catch (error) {
        errRes(res, error)
    }
}

// find comment 
const findComment = async (req, res) => {
    const {video} = req.params

    try {
        const comments = await Comment.find({video}).populate('author', 'name email img')

        if(comments.length !== 0) {
            res.status(200).json({
                status: 'ok',
                msg: 'All comments about this video',
                total: comments.length,
                comments
            })
        } else {
            res.status(200).json({
                status: 'not found',
                msg: 'There are no comment for this video',
                total: 0,
                comments: []
            })
        }

    } catch (error) {
        errRes(res, error)
    }
}

// delete comment
const deleteComment = async (req, res) => {
    const {id} = req.params

    try {
        const comment = await Comment.findByIdAndDelete(id)

        if(comment) {
            res.status(200).json({
                status: 'ok',
                msg: 'Comment deleted successfylly',
                comment
            })
        } else {
            res.status(404).json({
                status: 'not found',
                msg: 'Comment is not found for delete'
            })
        }

    } catch (error) {
        errRes(res, error)
    }
}

module.exports = {
    createComment,
    findComment,
    deleteComment
}