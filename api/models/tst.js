const mongoose = require('mongoose');

const orderS = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    products: [],
    method: {type: String, required: true},
    total: {type: Number},
    user_id: mongoose.Schema.Types.ObjectId,
    address_id: mongoose.Schema.Types.ObjectId
},
{collection: 'orders'});

module.exports = mongoose.model('Orders', orderS);