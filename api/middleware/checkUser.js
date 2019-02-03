const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");

const Address = require("../models/address");
const User = require("../models/user");


module.exports = (req, res, next) => {
    User.findById(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }
            if (!user.isVerified) {
                next();
            } else {
                try {
                    const token = req.headers.authorization.split(" ")[1];
                    const decoded = jwt.verify(token, process.env.JWT_KEY);
                    req.userData = decoded;
                    next();
                }
                catch (error) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
            }


        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });


};