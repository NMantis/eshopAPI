const mongoose = require('mongoose');

const guestOrder = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    products: [],
    method: {type: String, required: true},
    total: {type: Number},
    guestFname: {type: String},
    guestLname: {type: String},
    address: {},
    orderDate: {type: Date},
    status: {type: String, default: 'Awaiting Confirmation'}
},
{collection: 'orders'});

module.exports = mongoose.model('gOrder', guestOrder);