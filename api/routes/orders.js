const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const OrderController = require('../controllers/order');

router.get('/', checkAuth, OrderController.orders_get_active);

router.get('/new', checkAuth, OrderController.orders_get_new);

router.get('/completed', checkAuth, OrderController.orders_get_completed);

router.get('/active/:orderId', checkAuth, OrderController.orders_get_by_orderId);

router.get('/personal/:userId',checkAuth, OrderController.orders_get_by_userId);

router.post('/user/:userId', checkAuth, OrderController.orders_place_user_order);

router.post('/guest', OrderController.orders_change_status);

router.delete('/:orderId',checkAuth, OrderController.orders_delete_order);

router.patch('/:orderId', OrderController.orders_change_status);

module.exports = router;