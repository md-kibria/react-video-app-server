const router = require('express').Router()
const {uploadVideo, getAllVideos, getSingleVideo, deleteVideo, updateVideo, searchVideo} = require('../controller/video')
const {uploadVideoValidator, uploadVideoValidatorHandler} = require('../utils/validator/uploadVideo-validator')
const authenticate = require('../utils/authentication')
const upload = require('../utils/upload')

router.get('/', getAllVideos)

router.get('/search', searchVideo)

router.get('/:id', getSingleVideo)

router.post('/upload', authenticate, upload.fields([
    {
        name: 'video',
        maxCount: 1
    },
    {
        name: 'thumbnail',
        maxCount: 1
    }
]), uploadVideoValidator, uploadVideoValidatorHandler, uploadVideo)

router.put('/update/:id', upload.fields([
    {
        name: 'video',
        maxCount: 1
    },
    {
        name: 'thumbnail',
        maxCount: 1
    }
]), authenticate, updateVideo)

router.delete('/delete/:id', authenticate, deleteVideo)

module.exports = router