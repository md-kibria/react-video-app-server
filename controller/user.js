const User = require('../models/User')
const Video = require('../models/Video')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const errRes = require('../utils/errRes')
const fs = require('fs')

// singup user
const signupUser = async (req, res, next) => {
    // destracturing from req body
    const { name, email, password } = req.body
    // const { filename } = req.file

    // hash password
    const hash = await bcrypt.hash(password, 11)

    // new user
    const newUser = new User({
        name,
        email,
        password: hash,
        img: req.file ? req.file.filename : 'default.png'
    })

    try {
        const user = await newUser.save()

        // token 
        const token = jwt.sign({
            _id: user._id,
            name: user.name,
            email: user.email,
            list: user.list,
            img: user.img
        }, process.env.JWT_SECRET)

        // response to client
        res.status(201).json({
            status: 'ok',
            msg: 'signup successfully',
            token: `Bearer ${token}`,
            user
        })
    } catch (error) {
        errRes(res, error, 'signup failed')
    }
}

// login user
const loginUser = async (req, res, next) => {
    // destracturing from req body
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email }).select({ password: 0, __v: 0 })

        // token 
        const token = jwt.sign({
            _id: user._id,
            name: user.name,
            email: user.email,
            list: user.list,
            img: user.img
        }, process.env.JWT_SECRET)

        // response to client
        res.status(200).json({
            status: 'ok',
            msg: 'login successfull',
            token: `Bearer ${token}`,
            user
        })
    } catch (error) {
        errRes(res, error, 'login failed')
    }
}

// get all users 
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().populate('list', 'title').select({ password: 0, __v: 0 })

        if (users.length !== 0) {
            // response all users to client
            res.status(200).json({
                status: 'ok',
                msg: 'all users',
                total: users.length,
                users
            })
        } else {
            // not found response to client
            res.status(404).json({
                status: 'not found',
                msg: 'users not found'
            })
        }

    } catch (error) {
        // response error to client
        errRes(res, error, 'can\'t get all users')
    }
}

// get single user
const getSingleUser = async (req, res, next) => {
    // user id
    const { id } = req.params

    try {
        const user = await User.findById(id).populate('list', 'title').select({ password: 0, __v: 0 })

        if (user) {
            // user info response to client
            res.status(200).json({
                status: 'ok',
                msg: 'single user',
                user
            })
        } else {
            // response to client not found msg
            res.status(404).json({
                status: 'not found',
                msg: 'user not found'
            })
        }

    } catch (error) {
        // response error
        errRes(res, error)
    }
}

// update user
const updateUser = async (req, res, next) => {
    // user id
    const { id } = req.params

    // user info
    const { name, email } = req.body

    try {
        const user = await User.findOne({ _id: id })

        if (user) {
            // define user data with updated data
            const updateUser = {
                name: name || user.name,
                email: email || user.email,
                img: req.file ? req.file.filename : user.img
            }

            // delete old file
            if (req.file && user.img !== 'default.png') {
                fs.unlink(`${__dirname}/../public/uploads/${user.img}`, (err) => {
                    if (err) console.log(err)
                })
            }

            const updatedUser = await User.findByIdAndUpdate(id, { $set: updateUser }, { new: true, useFindAndModify: false })

            // response to client
            res.status(200).json({
                status: 'ok',
                msg: 'user updated successfully',
                user: updatedUser
            })

        } else {
            // response not found to client
            res.status(404).json({
                status: 'not found',
                msg: 'user not found for update'
            })
        }

    } catch (error) {
        // response error msg to client
        errRes(res, error)
    }
}

// add video to favourite list
const addFav = async (req, res, next) => {

    const videoId = req.params.id

    try {
        if(videoId) {
            // find the video by id
            const video = await Video.findById(videoId)

            if(video) {
                // find the user 
                const user = await User.findById(req.user._id)

                if(user) {
                    // exist favourite list and new video list
                    const userList = user.list
                    const isExist = userList.find(value => value.toString() === video._id.toString())
                    
                    if(!isExist) {
                        const newList = [...userList, video._id]
                        // update user favourite list with new video id
                        const updatedUser = await User.findByIdAndUpdate(req.user._id, {$set: {list: newList}}, {new: true})

                        // response to client
                        res.status(200).json({
                            status: 'ok',
                            msg: 'Video added to favourite list successfully',
                            user: updatedUser
                        })
                    } else {
                        const newList = userList.filter(value => {
                            return value.toString() !== video._id.toString()
                        })

                        const updatedUser = await User.findByIdAndUpdate(req.user._id, {$set: {list: newList}}, {new: true})
                        // video already added to favourite list
                        res.status(200).json({
                            status: 'ok',
                            msg: 'Video remove successfully from favourite list',
                            user: updatedUser
                        })
                    }
                } else {
                    // response error
                    res.status(404).json({
                        status: 'not found',
                        msg: 'Your not found in database, please login again'
                    })
                }

            } else {
                // response not found video
                res.status(404).json({
                    status: 'not found',
                    msg: 'Video not found for add to favourite list'
                })
            }
        }
    } catch (error) {
        // response the error message
        errRes(res, error)
    }
}

// delete single user
const deleteSingleUser = async (req, res, next) => {
    // user id
    const { id } = req.params

    try {
        const user = await User.findByIdAndDelete(id)

        if (user) {

            // delete img from server
            fs.unlink(`${__dirname}/../public/uploads/${user.img}`, err => {
                if (err) console.log(err)
            })

            // response the deleted user
            res.status(200).json({
                status: 'ok',
                msg: 'user deleted successfully',
                user
            })
        } else {
            // response the not found message
            res.status(404).json({
                status: 'not found',
                msg: 'user is not found for delete'
            })
        }

    } catch (error) {
        // response the error message
        errRes(res, error)
    }
}

module.exports = {
    signupUser,
    loginUser,
    getAllUsers,
    getSingleUser,
    deleteSingleUser,
    updateUser,
    addFav
}