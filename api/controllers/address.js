const mongoose = require("mongoose");

const Address = require("../models/address");
const User = require("../models/user");

exports.address_add = (req, res, next) => {
    User.findById(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        const address  = new Address ({
            _id: mongoose.Types.ObjectId(),
            user_id: req.params.userId,
            street: req.body.street,
            number: req.body.number,
            postalcode: req.body.postalcode,
            city: req.body.city
        });
        return address.save();
    })
    .then(result => {
        res.status(201).json({
            message: "Address added"
        });
    })
    .catch (err => {
        res.status(500).json({
            error: err
        });
    });
};

exports.user_addresses = (req, res, next ) => {
    User.findById(req.params.userId)
    .exec()
    .then(user => {
        if(!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        Address.find({ user_id: req.params.userId} , (err,adds) => {
            if(err){
                res.status(500).json({error: err});
            } else {
                res.status(200).json(
                   adds
                );
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};


exports.address_delete = (req, res, next) => {
    Address.findByIdAndDelete({_id: req.params.addressId})
    
    .then(result => {
        res.status(200).json({
            message: "Address Deleted"
        });
    })
    .catch(err => {
        json.status(500).json({
            error: err
        });
    });
};

exports.edit_address = (req, res, next) => {
    const id = req.params.addressId;
    Address.findById(id, (err,adr) => {
        if(err){
            res.status(500).json({
                error: err
            });
        } else {
            adr.city = req.body.city
            adr.street = req.body.street
            adr.number = req.body.number
            adr.postalcode = req.body.postalcode

            adr.save()
                .then(result => {
                    res.status(200).json('Address Updated')
                })
                .catch( err => {
                    res.status(500).json({
                        error: err
                    });
                });
        }
    });    
};

exports.user_address = (req, res, next) => {
    Address.findById(req.params.adrId)
    .exec()
    .then(adr => {
        res.status(200).json(adr);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    })
};