const router = require('express').Router()
const {createComment, findComment, deleteComment} = require('../controller/comment')
const authenticate = require('../utils/authentication')

router.post('/create/:video', authenticate, createComment)

router.get('/:video', findComment)

router.delete('/delete/:id', authenticate, deleteComment)

module.exports = router