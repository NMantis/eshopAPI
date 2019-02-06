const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const crypto = require('crypto');

const nodemailer = require('nodemailer');

const Token = require('../models/verificationToken')
const User = require("../models/user");


exports.user_info = (req, res, next) => {
  User.findById(req.params.id)
    .select("firstname lastname gender")
    .exec()
    .then(user => {
      res.status(200).send(user);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
}

exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "e-mail already exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              gender: req.body.gender,
              firstname: req.body.firstname,
              lastname: req.body.lastname
            });
            user.save()
              .then(result => {
                res.status(201).json({
                  message: 'User Created',
                  id: result.id
                });
              })

            const token = new Token({
              _userId: user._id,
              token: crypto.randomBytes(16).toString('hex')
            });

            token.save()
              .then(() => {
                const transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: '66kyrimar@gmail.com',
                    pass: process.env.MAIL_PASS
                  }
                });

                const mailOptions = {
                  from: '66kyrimar@gmail.com',
                  to: 'mantis.nk@gmail.com',  // user.email,
                  subject: 'Account Verification',
                  text: 'Hello, \n\n' + 'Please verify your account by clicking the link below: \n\n'
                    + 'http://localhost:4200/login;vtok=' + token.token
                };

                transporter.sendMail(mailOptions, function (err, info) {
                  if (err) {
                    res.status(500).json({ error: err });
                  }
                  res.status(200).json(info);
                })
              })
              .catch(err => {
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};



exports.user_login = (req, res, next) => {
  const mail = req.body.email;
  if (mail == process.env.MAIL_ADMIN) {
    User.find({ email: mail })
      .exec()
      .then(admin => {
        bcrypt.compare(req.body.password, admin[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Wrong password"
            });
          }
          if (result) {
            const token = jwt.sign({
              userId: admin[0]._id,
              date: Date.now(),
              role: '_admin0'
            },
              process.env.JWT_KEY,
              {
                expiresIn: '24h'
              });
            return res.status(200).json({
              message: "Auth successful",
              token: token
            });
          }
          res.status(401).json({
            message: "Auth failed"
          });
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  } else {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1 || user.isVerified === false) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Wrong password"
          });
        }
        if (result) {
          const token = jwt.sign({
            userId: user[0]._id,
            date: Date.now()
          },
            process.env.JWT_KEY,
            {
              expiresIn: '24h'
            });
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth failed"
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

exports.user_confirmation = (req, res, next) => {
  Token.findOne({ token: req.params.token })
    .then(token => {
      if (token.length < 1) {
        return res.status(404).json({
          message: "Token not found"
        });
      }
      User.findOne({ _id: token._userId })
        .exec()
        .then(user => {
          if (user.length < 1) {
            return res.status(404).json({
              message: "User not found"
            });
          }

          if (user.isVerified) {
            return res.status(400).json({ message: 'This user is already verified' });
          }

          user.isVerified = true;
          user.save()
            .then(result => {
              res.status(200).json({ message: 'Account Verified' });
            })
            .catch(err => {
              res.status(500).json({ error: err });
            });
        })
        .catch(err => {
          res.status(500).json({ error: err });
        });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
}




