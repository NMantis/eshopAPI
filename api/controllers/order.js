const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
const Address = require("../models/address");
const User = require("../models/user");
const nodemailer = require('nodemailer');

exports.orders_get_active = (req, res, next) => {
    Order.find()
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        quantity: doc.quantity,
                        address: doc.address_id,
                        user: doc.user_id,
                        product: doc.products,
                        total: doc.total,
                        method: doc.method
                    };
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.orders_get_by_userId = (req, res, next) => {
    const userId = req.params.userId;
    Order.find({ user_id: userId })
        .exec()
    .then(ord => {
        if (ord)
            res.status(200).json(ord);
        else
            res.status(404).json({ message: 'This user does not have any active orders.' });
    })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.orders_get_by_orderId = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .exec()
    then(ord => {
        if (ord)
            res.status(200).json(ord);
        else
            res.status(404).json({ message: 'Order does not exist.' });
    })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};


exports.orders_delete_order = (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order Deleted'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.orders_place_user_order = (req, res, next) => {
    let total = 0;
    for (let i = 0; i < req.body.products.length; i++) {
        total += req.body.products[i].price * req.body.products[i].quantity;
    }
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        products: req.body.products,
        method: req.body.method,
        total: total,
        user_id: req.params.userId,
        address_id: req.body.address_id,
        orderDate: Date.now()
    });
    order.save()
        .then(ord => {
            if (ord.address_id ) {

            Address.findById(ord.address_id)
                .then(adr => {
                    User.findById(ord.user_id)
                        .then(user => {
                            const transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: '66kyrimar@gmail.com',
                                    pass: process.env.MAIL_PASS
                                }
                            });

                            let text = '';
                            for (let i = 0; i < ord.products.length; i++) {

                                text += '/n Product #' + (i+1) + ' : ' + ord.products[i].name +
                                    '\t Price per unit: ' + ord.products[i].price +
                                    '\t Quantity: ' + ord.products[i].quantity + '\n'
                            }
                            const mailOptions = {
                                from: '66kyrimar@gmail.com',
                                to: 'mantis.nk@gmail.com',  // user.email,
                                subject: 'Order Info',
                                text: 'Order ID:  ' + ord._id +
                                    '\n Address: ' + adr.street + '' + adr.number +
                                    '\n Full Name: ' + user.firstname + ''+  user.lastname + '\n' +
                                    text + '\n Total: ' + ord.total
                            };

                            transporter.sendMail(mailOptions, function (err, info) {
                                if (err) {
                                    res.status(500).json({ error: err });
                                } else {
                                     res.status(200).json(info);
                                }
                               
                            });
                        });
                });
            } else {
                User.findById(ord.user_id)
                .then(user => {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: '66kyrimar@gmail.com',
                            pass: process.env.MAIL_PASS
                        }
                    });

                    let text = '';
                    for (let i = 0; i < ord.products.length; i++) {

                        text += '/n Product #' + (i+1) + ' : ' + ord.products[i].name +
                            '\t Price per unit: ' + ord.products[i].price +
                            '\t Quantity: ' + ord.products[i].quantity + '\n'
                    }
                    const mailOptions = {
                        from: '66kyrimar@gmail.com',
                        to: 'mantis.nk@gmail.com',  // user.email,
                        subject: 'Order Info',
                        text: 'Order ID:  ' + ord._id +
                            '\n Full Name: ' + user.firstname + ''+  user.lastname + '\n' +
                            text + '\n Total: ' + ord.total
                    };

                    transporter.sendMail(mailOptions, function (err, info) {
                        if (err) {
                            res.status(500).json({ error: err });
                        } else {
                             res.status(200).json(info);
                        }
                       
                    });
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};


exports.orders_change_status = (req, res, next) => {
    const id = req.params.orderId;
    Order.update({_id: id}, {$set: {status: req.body.status}})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Order updated'
        });
    })
    .catch(err=> {
        res.status(500).json({
            error: err
        });
    });
};
