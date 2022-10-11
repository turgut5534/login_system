const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error ('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password" ')
            }
        }
    },
    //STEP 1!!!
    // tokens: [
    //     {
    //         token: {
    //             type: String,
    //             required: true
    //         }
    //     }
    // ],
    avatar: {
        type: Buffer
    }
})


//STEP 2!!!!!
// userSchema.methods.generateAuthToken = async function () {
//     const user = this
    
//     const token = jwt.sign({ _id:user._id.toString() }, 'thisissignature')

//     //Add this token to user's token array by concat function
//     user.tokens = user.tokens.concat( {token} )
//     await user.save()

//     return token
// }

userSchema.statics.findByCredentials = async (email, password) => {
    const user= await User.findOne( {email} )

    if (!user) {
        throw new Error('Username not exist')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}


userSchema.pre('save', async function(next) {
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User