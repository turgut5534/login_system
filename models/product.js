const mongoose = require('mongoose')

const productSchema= new mongoose.Schema({
    image: {
        type: Buffer
    },
    imageTwo: {
        type: Buffer
    },
    imageThree: {
        type: Buffer
    },
    imageFour: {
        type: Buffer
    },  
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    price: {
        type: Number
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    review: {
        type: Number
    }
}, {
    timestamps: true
})



const Product = mongoose.model('Product', productSchema)

module.exports = Product