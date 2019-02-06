const mongoose = require("mongoose");
const Product = require("../models/product");

exports.products_get_all = (req, res, next) => {
    Product.find()
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    category: doc.category,
                    productImage: doc.productImage,
                    active: doc.active,
                    description: doc.description,
                    stock: doc.stock
                };
            })
        };
        if (docs.length > 0){
            res.status(200).json(response);
        } else {
            res.status(404).json({
                message: 'No entries found'
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

exports.products_get_by_id = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(doc => {
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({message: 'No valid entry found for provided ID'});
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

exports.products_get_by_category = (req, res, next) => {
    const cat = req.params.productCat;
    Product.find({category: cat })
    .exec()
    .then(doc => {
        if (doc.length > 0) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({message: 'No valid entry found for provided category'});
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

exports.products_add_product = (req, res, next) => {
    const product= new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        productImage: req.body.path,
        active: true,
        category: req.body.category,
        stock: req.body.stock
    });

    product.save()
    .then(result => {
        res.status(201).json({
            message: 'Prodduct Added.',
            newProduct: {
                name: result.name,
                description: result.description,
                _id: result._id,
                price: result.price,
                productImage: result.productImage,
                category: result.category,
                stock: result.stock
            }
        });
    })
    .catch( err => {
        res.status(500).json({
            error: err
        });
    });
};

exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of Object.keys(req.body)) {
        updateOps[ops] = req.body[ops];
    }
    Product.update({ _id: id },{ $set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product updated'
        });
    })
    .catch(err=> {
        res.status(500).json({
            error: err
        });
    });
};

exports.products_delete_product = (req, res, next) => {
    Product.remove({ _id: req.params.productId })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product Deleted'
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

