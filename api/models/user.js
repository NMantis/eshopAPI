const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {type: String, required: true},
    password: {type: String, required: true},
    gender: {type: String},
    firstname: {type: String, required: true},
    lastname:{type: String, required: true},
    isVerified: {type: Boolean, default: false}
},
{collection: 'users'});

module.exports = mongoose.model('User', userSchema);