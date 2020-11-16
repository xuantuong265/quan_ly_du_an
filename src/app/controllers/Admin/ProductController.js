const Product = require('../../models/Product');
const SubCategory = require('../../models/SubCategory');
const path = require('path');

class ProductController {

    index(req, res, next) {

    }

    // Hiển thị form thêm sản phẩm
    create(req, res, next) {
        SubCategory.find({})
            .then((subCategories) => {
                subCategories = subCategories.map((subCategory) => subCategory.toObject());
                res.render('admins/products/create', {
                    layout: 'main',
                    subCategories,
                });
            })
            .catch(next);
    }

    // Lưu thông tin sản phẩm
    store(req, res, next) {

        const formData = req.body;
        const image = req.files.img; 
        const crypto = require("crypto");
        const nameImage = crypto.randomBytes(20).toString('hex') + image.name;

        image.mv(path.resolve(__dirname, '../../../public/image', nameImage))
            .then(() => {
                formData.image = nameImage;
                formData.star = 0;
                const product = new Product(formData);
                product.save()
                    .then((product) => {
                        SubCategory.findByIdAndUpdate({ _id: formData.subCategoryID }, { $push: { products: product._id } })
                            .then(() => {
                               return res.redirect('/admin/categories');
                            })
                    })
                    .catch(next);
            })
            .catch(next);
    }

}

module.exports = new ProductController;