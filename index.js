// external imports
const express = require('express')
const mongoose = require('mongoose')
const dotEnv = require('dotenv')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')

// interenal imports
const userRoute = require('./routes/user')
const videoRoute = require('./routes/video')
const commentRoute = require('./routes/comment')

const app = express()

// static
app.use(express.static('./public'))

// set view engine
app.set('view engine', 'pug')

// dotenv configuration 
dotEnv.config()

// authenticate with passport jwt
app.use(passport.initialize())
require('./utils/passport')(passport)

// middlewares
app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// routes
app.use('/api/user', userRoute)
app.use('/api/video', videoRoute)
app.use('/api/comment', commentRoute)

// root route
app.get('/', (req, res) => {
    res.locals = {
        protocol: req.protocol,
        host: req.hostname,
        port: PORT
    }
    res.render('index', {title: 'Site Map'})
})

// 404 - not found
app.use((req, res, next) => {
    res.status(404).json({
        errors: {
            msg: 'Not found!'
        }
    })
})

// error handler
app.use((err, req, res, next) => {
    console.log(err)
    if(res.headerSend) {
        next('There was a problem')
    } else {
        if(err.message) {
            res.status(500).json({
                errors: {
                    msg: err.message
                }
            })
        } else {
            res.status(500).json({
                errors: {
                    msg: 'There was a problem!'
                }
            })           
        }
    }
})

// connect database
mongoose.connect(
    // 'mongodb://localhost:27017/video-app',
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fgyzv.mongodb.net/video-app`,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
    () => {
        console.log('Database connected')
    })

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})