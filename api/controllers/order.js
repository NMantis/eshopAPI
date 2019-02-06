const mongoose = require("mongoose");
const Order = require("../models/order");
const gOrder = require("../models/g_order");
const Address = require("../models/address");
const User = require("../models/user");
const nodemailer = require('nodemailer');

exports.orders_get_active = (req, res, next) => {
    Order.find()
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.orders_get_new = (req, res, next) => {
    Order.find({status: 'Awaiting Confirmation'})
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.orders_get_completed = (req, res, next) => {
    Order.find({status: 'Completed'})
        .exec()
        .then(docs => {
            res.status(200).json(docs);
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
    if (req.body.method === 'House Delivery') {
        Address.findById(req.body.address_id)
            .exec()
            .then(adr => {
                const order = new Order({
                    _id: mongoose.Types.ObjectId(),
                    products: req.body.products,
                    method: req.body.method,
                    total: total,
                    user_id: req.params.userId,
                    address: adr,
                    orderDate: Date.now()
                });
                order.save()
                    .then(ord => {
                        User.findById(ord.user_id)
                            .then(user => {
                                const transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                        user: 'your@gmail.com',
                                        pass: process.env.MAIL_PASS //define process.MAIL_PASS at nodemon.json
                                    }
                                });

                                let text = '';
                                for (let i = 0; i < ord.products.length; i++) {

                                    text += '/n Product #' + (i + 1) + ' : ' + ord.products[i].name +
                                        '\t Price per unit: ' + ord.products[i].price +
                                        '\t Quantity: ' + ord.products[i].quantity + '\n'
                                }
                                const mailOptions = {
                                    from: 'your@gmail.com',
                                    to: user.mail,  // user.email,
                                    subject: 'Order Info',
                                    text: 'Order ID:  ' + ord._id +
                                        '\n Address: ' + adr.street + '' + adr.number +
                                        '\n Full Name: ' + user.firstname + '' + user.lastname + '\n' +
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
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    } else {
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            products: req.body.products,
            method: req.body.method,
            total: total,
            user_id: req.params.userId,
            orderDate: Date.now()
        });
        order.save()
            .then(ord => {
                User.findById(ord.user_id)
                    .then(user => {
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'your@gmail.com',
                                pass: process.env.MAIL_PASS //define process.MAIL_PASS at nodemon.json
                            }
                        });

                        let text = '';
                        for (let i = 0; i < ord.products.length; i++) {

                            text += '/n Product #' + (i + 1) + ' : ' + ord.products[i].name +
                                '\t Price per unit: ' + ord.products[i].price +
                                '\t Quantity: ' + ord.products[i].quantity + '\n'
                        }
                        const mailOptions = {
                            from: 'your@gmail.com',
                            to: user.mail,  // user.email,
                            subject: 'Order Info',
                            text: 'Order ID:  ' + ord._id +
                                '\n Full Name: ' + user.firstname + '' + user.lastname + '\n' +
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
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    }
};


exports.orders_change_status = (req, res, next) => {
    const id = req.params.orderId;
    const updateOps = {};
    for(const ops of Object.keys(req.body)) {
        updateOps[ops] = req.body[ops];
    }
    Order.update({ _id: id }, { $set: updateOps} )
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order updated'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};


exports.orders_place_guest_order = (req, res, next) => {
    let total = 0;
    for (let i = 0; i < req.body.products.length; i++) {
        total += req.body.products[i].price * req.body.products[i].quantity;
    }
    if (req.body.method === 'House Delivery') {

        const order = new gOrder({
            _id: mongoose.Types.ObjectId(),
            products: req.body.products,
            method: req.body.method,
            total: total,
            guestFname: req.body.Fname,
            guestLname: req.body.Lname,
            guestemail: req.body.email,
            address: {
                street: req.body.street,
                number: req.body.number,
                postalcode: req.body.postalcode,
                city: req.body.city
            },
            orderDate: Date.now()
        });
        order.save()
            .then(ord => {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'your@gmail.com',
                        pass: process.env.MAIL_PASS //define process.MAIL_PASS at nodemon.json
                    }
                });

                let text = '';
                for (let i = 0; i < ord.products.length; i++) {

                    text += '/n Product #' + (i + 1) + ' : ' + ord.products[i].name +
                        '\t Price per unit: ' + ord.products[i].price +
                        '\t Quantity: ' + ord.products[i].quantity + '\n'
                }
                const mailOptions = {
                    from: 'your@gmail.com',
                    to: ord.guestmail,  // user.email,
                    subject: 'Order Info',
                    text: 'Order ID:  ' + ord._id +
                        '\n Address: ' + ord.adress.street + '' + ord.adress.number +
                        '\n Full Name: ' + ord.guestFname + '' + ord.guestLname + '\n' +
                        text + '\n Total: ' + ord.total
                };

                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        res.status(500).json({ error: err });
                    } else {
                        res.status(200).json(info);
                    }

                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    } else {

        const order = new gOrder({
            _id: mongoose.Types.ObjectId(),
            products: req.body.products,
            method: req.body.method,
            total: total,
            guestFname: req.body.Fname,
            guestLname: req.body.Lname,
            guestemail: req.body.email,
            city: req.body.city,
            orderDate: Date.now()
        });
        order.save()
            .then(ord => {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'your@gmail.com',
                        pass: process.env.MAIL_PASS //define process.MAIL_PASS at nodemon.json
                    }
                });

                let text = '';
                for (let i = 0; i < ord.products.length; i++) {

                    text += '/n Product #' + (i + 1) + ' : ' + ord.products[i].name +
                        '\t Price per unit: ' + ord.products[i].price +
                        '\t Quantity: ' + ord.products[i].quantity + '\n'
                }
                const mailOptions = {
                    from: 'your@gmail.com',
                    to: ord.guestemail,  // user.email,
                    subject: 'Order Info',
                    text: 'Order ID:  ' + ord._id +
                        '\n Full Name: ' + ord.guestFname + '' + ord.guestLname + '\n' +
                        text + '\n Total: ' + ord.total
                };

                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        res.status(500).json({ error: err });
                    } else {
                        res.status(200).json(info);
                    }

                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    }
};