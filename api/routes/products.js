const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ProductController = require('../controllers/product');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if ((file.mimetype === 'image/png') || (file.mimetype === 'image/jpeg')) {
        cb(null, true);
    } else {
        cb(new Error('Only .jpeg and .png files are acceptable'), false);
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 3
    },
    fileFilter: fileFilter
}).single('file');

router.post('/image', function(req, res, next){
    upload(req, res, function(err) {
        if(err) {
            return res.status(500).json({error: err});
            
        }
            return res.status(200).json({path: 'http://localhost:3000/' + req.file.path});
    });
});



router.get('/all', ProductController.products_get_all);

router.get('/prod/:productId', ProductController.products_get_by_id);

router.get('/cat/:productCat', ProductController.products_get_by_category );

router.post("/", checkAuth, ProductController.products_add_product);

router.patch('/:productId',checkAuth, ProductController.products_update_product);

router.delete("/:productId",checkAuth, ProductController.products_delete_product);

module.exports = router;