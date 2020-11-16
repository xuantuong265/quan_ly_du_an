const express = require("express");
const router = express.Router();

const homeController = require('../../app/controllers/Pages/HomeController');
const { checkLogin, checkRoles } = require('../../app/middlewares/auth');

router.get('/home', homeController.index);
router.post('/add-cart', homeController.addCart);
router.post('/plus-cart', homeController.plusCart);
router.post('/minus-cart', checkLogin, homeController.minusCart);
router.post('/delete-cart', checkLogin, homeController.deleteCart);
router.post('/handle-cart', checkLogin, homeController.handleCart);
router.post('/payment-cart', checkLogin, homeController.paymentCart);
router.get('/filter-name', homeController.filterName);
router.post('/filter-price', homeController.filterPrice);
router.get('/list-cart', checkLogin, homeController.showCart);

router.get('/api', homeController.api);


router.get('/product/:slug', homeController.show);
router.get('/:slug', homeController.listProSub);




module.exports = router;