const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
})

categorySchema.virtual('product', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'category'
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category