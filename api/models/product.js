const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true },
    price: {type: Number, required: true },
    category: {type: String, required: true },
    description: {type: String},
    active: {type: Boolean, default: true},
    quantity: { type: Number, default: 1},
    productImage: {type: String, default: '../../../assets/images/shoe.jpg'},
    stock: {type: Number, default: 1}
},
{collection: 'products'});

module.exports = mongoose.model('Product', productSchema);