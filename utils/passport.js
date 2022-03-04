const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const User = require('../models/User')

// options
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_SECRET


module.exports = passport => {
    passport.use(new JwtStrategy(opts, async (payload, done) => {
        try {
            // find user with id
            const user = await User.findOne({ _id: payload._id })

            if (user) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        } catch (error) {
            return done(error, false)
        }
    }))
}