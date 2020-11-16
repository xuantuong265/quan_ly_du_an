const express = require("express")
const router = express.Router()

const authMiddleware = require('../app/middlewares/auth');
const siteController = require('../app/controllers/Admin/SiteController');

router.get('/register', siteController.formRegister);
router.get('/logout',  siteController.logout);
router.get('/login', siteController.formLogin);

router.post('/register', siteController.register);
router.post('/login', siteController.login);


module.exports = router;