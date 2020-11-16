const express = require("express")
const router = express.Router()

const categoryController = require('../../app/controllers/Admin/CategoryController');
const { checkLogin } = require('../../app/middlewares/auth');

router.get('/create', categoryController.create);
router.post('/store', categoryController.store);
router.get('/:slug', categoryController.show);

router.get('/', categoryController.index);

module.exports = router;