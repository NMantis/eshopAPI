const express = require("express");
const router = express.Router();
const checkAuth =require('../middleware/check-auth');
const checkUser =require('../middleware/checkUser');
const AddressController = require('../controllers/address');

router.post("/add/:userId", checkUser, AddressController.address_add);

router.post("/edit/:addressId",checkAuth, AddressController.edit_address);
                                                                // CHECKAUTH INC
router.get("/show/:userId",checkAuth, AddressController.user_addresses);

router.get("/adr/:adrId",checkAuth, AddressController.user_address);

router.delete("/:addressId",checkAuth, AddressController.address_delete);
module.exports = router;