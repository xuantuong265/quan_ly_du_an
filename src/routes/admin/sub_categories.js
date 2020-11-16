const express = require("express")
const router = express.Router()

const subCategoryController = require('../../app/controllers/Admin/SubCategoryController');

router.get('/create', subCategoryController.create);
router.post('/store', subCategoryController.store);
router.get('/:slug', subCategoryController.show);

module.exports = router;