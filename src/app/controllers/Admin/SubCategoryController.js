const SubCategory = require('../../models/SubCategory');
const Category = require('../../models/Category');
const Product = require('../../models/Product');

class SubCategoryController {

    // Hiển thị form thêm chuyên mục
    create(req, res, next) {
        Category.find({})
            .then((categories) => {
                categories = categories.map(category => category.toObject());
                res.render('admins/sub_category/create', { 
                    layout: 'main',
                    categories,
                });
            })
            .catch((err) => {
                console.log(err);
                next();
            });
    }

    // Lưu chuyên mục 
    store(req, res, next) {
        // get id danh mục từ form select
        const formData = req.body;
        const categoryID = formData.categoryID;

        // lưu chuyên mục
        const subCategory = new SubCategory(formData);
        subCategory.save()
            .then((result) => {
                
                // tìm danh mục cha của chuyên mục và thêm id của chuyên mục vào trường kids
                Category.findByIdAndUpdate({ _id: categoryID }, { $push: { kids: result._id } })
                    .then(() => {
                        res.redirect('/admin/categories');
                    })
                    .catch(next);

            })
            .catch((err) => {
                console.log(err);
                next();
            });
    }

    // Hiển thị danh sách sản phẩm
    show(req, res, next) {

        SubCategory.aggregate([
            { $match: { 'slug': req.params.slug } },
            { $lookup: {
                from: 'products',
                localField: 'products',
                foreignField: '_id',
                as: 'Products'
            }},
        ])
        .then((results) => {
            res.render('admins/sub_category/show', {
                layout: 'main',
                results,
            });
        })
        .catch(next);
    }

}

module.exports = new SubCategoryController;