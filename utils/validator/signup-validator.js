const { check, validationResult } = require('express-validator')
const createError = require('http-errors')
const User = require('../../models/User')
const path = require('path')
const fs = require('fs')

// signup user validator 
const signupValidator = [
    // check name
    check('name')
        .isLength({ min: 1 })
        .withMessage('Name is required')
        .isAlpha('en-US', { ignore: " :.-" })
        .withMessage('Please provide a valid name')
        .trim(),

    // check email
    check('email')
        .isLength({min: 1})
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .trim()
        .custom(async (value) => {
            try {
                const user = await User.findOne({ email: value })
                if (user) {
                    throw createError('Email already in use')
                }
            } catch (error) {
                throw createError(error.message)
            }
        })
        .withMessage("Email already in use"),
        
    // check password
    check('password')
        .isLength({ min: 1 })
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage("Your password must have 6 characters"),
    
    // check confirmation password
    check('confirmPassword')
        .isLength({ min: 1 })
        .withMessage("Confirmation password is required")
        .custom((value, { req }) => {

            if (value !== req.body.password) {
                throw createError('Password dose\'t match')
            } else {
                return true
            }
        })
        .withMessage('Password dose\'t match')
]

// signup validator handler 
const signupValidatorHandler = (req, res, next) => {
    // get the validation result
    const errors = validationResult(req)

    // no error 
    if(Object.keys(errors.errors).length === 0) {
        next()
    } else {
        // delete the file
        if(req.file) {
            const {filename} = req.file
            fs.unlink(path.join(__dirname, `/../../public/uploads/${filename}`), (err) => {
                if(err) console.log(err)
            })
        }

        // response the error
        res.status(500).json({
            errors: errors.formatWith(err => ({
                msg: err.msg
            })).mapped()
        })
    }
}

module.exports = {
    signupValidator,
    signupValidatorHandler
}