const router = require('express').Router()
const { signupUser, loginUser, getAllUsers, getSingleUser, deleteSingleUser, updateUser, addFav } = require('../controller/user')
const upload = require('../utils/upload')
const { signupValidator, signupValidatorHandler } = require('../utils/validator/signup-validator')
const { loginValidator, loginValidatorHandler } = require('../utils/validator/login-validator')
const authenticate = require('../utils/authentication')

// get all users
router.get('/', getAllUsers)

// get single user
router.get('/:id', getSingleUser)

// signup user
router.post('/signup', upload.single('img'), signupValidator, signupValidatorHandler, signupUser)

// login user
router.post('/login', loginValidator, loginValidatorHandler, loginUser)

// update single user
router.put('/update/:id', authenticate, upload.single('img'), updateUser)

// add video to favourite list
router.put('/addfav/:id', authenticate, addFav)

// delete single user
router.delete('/delete/:id', authenticate, deleteSingleUser)

module.exports = router