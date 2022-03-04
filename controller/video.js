const Video = require('../models/Video')
const errRes = require('../utils/errRes')
const fs = require('fs')

// upload video
const uploadVideo = async (req, res) => {
    const { title, desc } = req.body
    const video = req.files.video[0].filename
    const thumbnail = req.files.thumbnail[0].filename

    const newVideo = new Video({
        title,
        desc,
        video,
        thumbnail,
        author: req.user._id
    })

    try {

        const video = await newVideo.save()

        res.status(201).json({
            status: 'ok',
            msg: 'video uploaded successfully',
            video
        })

    } catch (error) {
        errRes(res, error)
    }
}

// get all videos 
const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find().populate('author', '_id name email').select({ __v: 0 })

        if (!videos.length !== 0) {
            res.status(200).json({
                status: 'ok',
                msg: 'All videos',
                total: videos.length,
                videos: videos.reverse()
            })
        } else {
            res.status(200).json({
                status: 'not found',
                msg: 'not video found'
            })
        }

    } catch (error) {
        errRes(res, error)
    }
}

// get single video
const getSingleVideo = async (req, res) => {
    const { id } = req.params

    try {
        const video = await Video.findById(id).populate('author')

        if (video) {

            // update views
            const updateVideo = await Video.findByIdAndUpdate(id, { $set: { views: video.views + 1 } }, { new: true })

            res.status(200).json({
                status: 'ok',
                msg: 'single video',
                video: updateVideo
            })
        } else {
            res.status(404).json({
                status: 'not found',
                msg: 'video not found'
            })
        }

    } catch (error) {
        errRes(res, error)
    }
}

// update video
const updateVideo = async (req, res) => {
    const { id } = req.params
    const { title, desc } = req.body
    const videoSrc = req.files && req.files.video && req.files.video[0].mimetype === 'video/mp4' && req.files.video[0].filename
    const thumbnailSrc = req.files && req.files.thumbnail && req.files.thumbnail[0]
    const thumbnailMimeType = thumbnailSrc ? thumbnailSrc.mimetype === 'image/png' || thumbnailSrc.mimetype === 'image/jpeg' : null
    const thumbnail = thumbnailMimeType ? req.files.thumbnail[0].filename : null

    try {
        const video = await Video.findById(id)

        const updateVideo = {
            title: title || video.title,
            desc: desc || video.desc,
            video: videoSrc || video.video,
            thumbnail: thumbnail || video.thumbnail
        }

        if (video) {

            // delete previous video
            if (videoSrc) {
                fs.unlink(`${__dirname}/../public/uploads/${video.video}`, err => {
                    if (err) console.log(err)
                })
            }

            // delete previous thumbnail image
            if (thumbnail) {
                fs.unlink(`${__dirname}/../public/uploads/${video.thumbnail}`, err => {
                    if (err) console.log(err)
                })
            }

            const updatedVideo = await Video.findByIdAndUpdate(id, { $set: updateVideo }, { new: true })

            res.status(200).json({
                status: 'ok',
                msg: 'video updated successfully',
                video: updatedVideo
            })

        } else {

            // delete current uploaded video
            if (videoSrc) {
                fs.unlink(`${__dirname}/../public/uploads/${videoSrc}`, err => {
                    if (err) console.log(err)
                })
            }

            // delete current uploaded thumbnail img
            if (thumbnail) {
                fs.unlink(`${__dirname}/../public/uploads/${thumbnail}`, err => {
                    if (err) console.log(err)
                })
            }

            res.status(404).json({
                status: 'not found',
                msg: 'video not found for update'
            })
        }

    } catch (error) {
        // delete current uploaded video
        if (videoSrc) {
            fs.unlink(`${__dirname}/../public/uploads/${videoSrc}`, err => {
                if (err) console.log(err)
            })
        }

        // delete current uploaded thumbnail img
        if (thumbnail) {
            fs.unlink(`${__dirname}/../public/uploads/${thumbnail}`, err => {
                if (err) console.log(err)
            })
        }
        errRes(res, error)
    }
}

// search video
const searchVideo = async (req, res) => {
    const { q } = req.query

    try {
        const videos = await Video.search(q)

        if (videos.length !== 0) {
            res.status(200).json({
                status: 'ok',
                msg: `search result for ${q}`,
                total: videos.length,
                videos: videos.reverse()
            })
        } else {
            res.status(200).json({
                status: 'not found',
                msg: 'No result found'
            })
        }
    } catch (error) {
        errRes(res, error)
    }
}

// delete video
const deleteVideo = async (req, res) => {
    const { id } = req.params

    try {
        const video = await Video.findByIdAndDelete(id)

        if (video) {

            // delete video from server
            fs.unlink(`${__dirname}/../public/uploads/${video.video}`, err => {
                if (err) console.log(err)
            })

            res.status(200).json({
                status: 'ok',
                msg: 'video deleted successfully',
                video
            })
        } else {
            res.status(404).json({
                status: 'not found',
                msg: 'video not found for delete'
            })
        }

    } catch (error) {
        errRes(res, error)
    }
}

module.exports = {
    uploadVideo,
    getAllVideos,
    getSingleVideo,
    deleteVideo,
    updateVideo,
    searchVideo
}