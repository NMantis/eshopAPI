const express = require('express');
const app= express();
const morgan = require('morgan');

const bodyParser=require('body-parser');
const mongoose=require('mongoose');

const userRoutes = require('./api/routes/users');
const addressRoutes= require('./api/routes/addresses');
const productRoutes= require('./api/routes/products');
const orderRoutes= require('./api/routes/orders');

mongoose.connect('mongodb://localhost:27017/shop')

mongoose.connection.on("error", function(err) {
    console.log("Could not connect to mongo server!");
    return console.log(err);
  });
app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

mongoose.Promise=global.Promise;

//CORS SETUP
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200'); 
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin,X-requested-With,Content-Type,Accept, Authorization'
    );
    res.header('Access-Control-Allow-Credentials', true);
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/user', userRoutes);
app.use('/address',addressRoutes);
app.use('/product',productRoutes);
app.use('/order',orderRoutes);


module.exports = app;