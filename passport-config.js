// const { authenticate } = require('passport')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy
const User = require('../login-system/models/user')

function initiliaze(passport) {
    const authenticateUser =  async (email, password, done) => {

        const user = await User.findOne({email})
       
        if (!user) {
            return done(null, false, { message: 'No user with that email' })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, {message: 'Password incorrect'})
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy( {usernameField: 'email'} ,authenticateUser))
   
    passport.serializeUser((user,done) => done(null, user._id))
    passport.deserializeUser(async (id,done) => {
        theUser=  await User.findById(id)
        return done(null, theUser)
    })
    }

module.exports = initiliaze