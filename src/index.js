const express = require('express')
const ejs = require('ejs')
const path = require('path')
const bodyParser = require('body-parser')
require('../database/mongoose')
const User = require('../models/user')
const Category = require('../models/category')
const Product= require('../models/product')


const flash = require('express-flash')
const session = require('express-session')
const passport = require('passport')
const initiliazePassport = require('../passport-config')

initiliazePassport(passport)

const app= express()
const port = process.env.PORT || 3000

const viewsDir = path.join(__dirname, '../views')
const publicDirectory = path.join(__dirname, '../public')


app.use(flash())
app.use(session( {
    secret: 'anykey',
    resave: false,
    saveUninitialized : false
}))
app.use(passport.initialize())
app.use(passport.session())


app.set('view engine', 'ejs')
app.set('views', viewsDir)
app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.static(publicDirectory))

var isLoggedIn = false

app.get('/', (req,res)=> {
    res.render('index', {
        isLoggedIn,
        title: 'Homepage'
    })
})
app.get('/testing', (req,res)=> {
    console.log(res.header('Authorization'))
    res.send('Testing')
})


app.get('/me', checkAuthenticated, (req,res) => {
    res.render('user-profile', {
        user : req.user,
        isLoggedIn,
        title: req.user.username
    })
})
app.get('/login' ,(req,res)=> {
    res.render('login', {
        isLoggedIn,
        title: 'Login'
    })
})

// app.post('/login', async (req,res)=> {
//     try {
//         const user = await User.findByCredentials(req.body.email, req.body.password)
//         const token= await user.generateAuthToken()
//         res.send('Log in completed')
//     } catch (e) {
//         res.send('Sorry')
//     }    
// })

app.post('/login', passport.authenticate('local', {
    successRedirect: '/me',
    failureRedirect:'/login',
    failureFlash:true
}))

app.get('/register', (req,res) => {
    res.render('register', {
        message: '',
        isLoggedIn,
        title: 'Register'
    })
})

app.get('/message', (req,res) => {
    res.render('message', {
        isLoggedIn,
        title: 'Messages'
    })
})


app.get('/logout', (req,res) => {
    isLoggedIn= false
    req.logout((err)=> {
        if (err) {
            res.redirect('/')
        }
    })
    res.redirect('/login')
})

app.post('/register', async (req,res) => {

    const { password, repassword } = req.body 

    if ( password != repassword) {
        return res.render('register', {
            message: 'Password not match'
        })
    }

    const user = new User(req.body)

    try {
        await user.save()
        //const token = await user.generateAuthToken()
        res.redirect('/login')
    } catch (e) {
        res.send(e)
    }

})

app.get('/about' ,(req,res) => {
    res.render('about', {
        isLoggedIn,
        title: 'About Us'
    })
})

app.get('/contact', (req,res) => {
    res.render('contact', {
        isLoggedIn,
        title: 'Contact'
    })
})

app.get('/faq', (req,res) => {
    res.render('FAQ', {
        isLoggedIn,
        title: 'FAQ'
    })
})

app.get('/categories', async(req,res) => {
    const categories= await Category.find()
    res.render('categories', {
        isLoggedIn,
        title: 'Category',
        categories
    })
})

app.get('/privacy-policy', (req,res) => {
    res.render('privacy-policy', {
        isLoggedIn,
        title: 'Privacy Policy'
    })
})

app.get('/products', async (req,res) => {
    products= await Product.find()
    console.log(products[0].category.title)
    res.render('products', {
        isLoggedIn,
        title: 'Products',
        products
    })
})

function checkAuthenticated(req,res,next) {
    if (req.isAuthenticated()) {
        isLoggedIn= true
        return next()
    }
    else {
        isLoggedIn= false
        res.redirect('/')
    }
}

app.listen(port, () => {
    console.log('Server is up on 3000')
})