const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    street: {type: String, required: true},
    number: {type: Number, required: true},
    postalcode: {type: String, required: true},
    city:{type: String, required: true}
},
{collection: 'addresses'});

module.exports = mongoose.model('Address', addressSchema);