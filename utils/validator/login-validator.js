const {check, validationResult} = require('express-validator')
const User = require('../../models/User')
const createError = require('http-errors')
const bcrypt = require('bcrypt')

// login validator
const loginValidator = [
    // check email
    check('email')
        .isLength({min: 1})
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .custom(async (value) => {
            try {
                const user = await User.findOne({email: value})

                if(!user) {
                    throw createError('User not found')
                } else {
                    return true
                }
            } catch (error) {
                throw createError(error.message)
            }
        })
        .withMessage('User not found'),

    // check password
    check('password')
        .isLength({min: 1})
        .withMessage('Password is required')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: req.body.email})
                const pass = await bcrypt.compare(value, user.password)

                if(!pass) {
                    throw createError('Password dosen\'t match')
                } else {
                    return true
                }

            } catch (error) {
                throw createError(error.message)
            }
        })
        .withMessage('Password dosen\'t match')
]

// login validator handler
const loginValidatorHandler = (req, res, next) => {
    // error result
    const errors = validationResult(req)

    // not error occured
    if(Object.keys(errors.errors).length === 0) {
        next()
    } else {
        res.status(400).json({
            errors: errors.formatWith(err => ({
                msg: err.msg
            })).mapped()
        })
    }
}

module.exports = {
    loginValidator,
    loginValidatorHandler
}