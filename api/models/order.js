const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    products: [],
    method: {type: String, required: true},
    total: {type: Number},
    user_id: mongoose.Schema.Types.ObjectId,
    address_id: mongoose.Schema.Types.ObjectId,
    orderDate: {type: Date},
    status: {type: String, default: 'Awaiting Confirmation'}
},
{collection: 'orders'});


module.exports = mongoose.model('Order', orderSchema);