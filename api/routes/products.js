const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ProductController = require('../controllers/product');

router.get('/all', ProductController.products_get_all);

router.get('/prod/:productId', ProductController.products_get_by_id);

router.get('/cat/:productCat', ProductController.products_get_by_category );

router.post("/", ProductController.products_add_product);

router.patch('/:productId', ProductController.products_update_product);

router.delete("/:productId", ProductController.products_delete_product);



module.exports = router;