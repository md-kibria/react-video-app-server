const {check, validationResult} = require('express-validator')
const {unlink} = require('fs')
const createError = require('http-errors')

// upload video validator 
const uploadVideoValidator = [
    // check title
    check('title')
        .isLength({min: 1})
        .withMessage('Title is required'),
    // check desc
    check('desc')
        .isLength({min: 1})
        .withMessage('Description is required'),
    // check video
    check('video')
        .custom((value, {req}) => {
            // console.log(Object.keys(req.files).length !== 0)
            if(req.files.video[0]) {
                if(req.files.video[0].mimetype !== 'video/mp4') {
                    throw createError('Please select a video')
                }
                return true
            } else {
                throw createError('Please select a video')
            }
        })
        .withMessage('Please select a video'),
    // check thumbnail
    check('thumbnail')
        .custom((value, {req}) => {
            // console.log(Object.keys(req.files).length !== 0)
            if(req.files.thumbnail[0]) {
                if(req.files.thumbnail[0].mimetype !== 'image/png' && req.files.thumbnail[0].mimetype !== 'image/jpeg') {
                    throw createError('Please select a thumbnail image')
                }
                return true
            } else {
                throw createError('Please select a thumbnail image')
            }
        })
        .withMessage('Please select a thumbnail image')
]

const uploadVideoValidatorHandler = (req, res, next) => {
    const errors = validationResult(req)

    if(Object.keys(errors.errors).length === 0) {
        next()
    } else {
        if(req.files.video) {
            unlink(`${__dirname}/../../public/uploads/${req.files.video[0].filename}`, err => {
                if(err) console.log(err)
            })
        }

        if(req.files.thumbnail) {
            unlink(`${__dirname}/../../public/uploads/${req.files.thumbnail[0].filename}`, err => {
                if(err) console.log(err)
            })
        }


        res.status(400).json({
            errors: errors.formatWith(err => ({
                msg: err.msg
            })).mapped()
        })
    }
}

module.exports = {
    uploadVideoValidator,
    uploadVideoValidatorHandler
}