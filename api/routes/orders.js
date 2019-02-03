const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const OrderController = require('../controllers/order');

router.get('/', OrderController.orders_get_active);

router.get('/active/:orderId', OrderController.orders_get_by_orderId);

router.get('/personal/:userId',checkAuth, OrderController.orders_get_by_userId);

router.post('/:userId', OrderController.orders_place_user_order);

router.delete('/:orderId',checkAuth, OrderController.orders_delete_order);

router.patch('/:orderId', OrderController.orders_change_status);

module.exports = router;