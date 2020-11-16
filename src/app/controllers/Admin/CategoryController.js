const Category = require('../../models/Category');

class CategoryController {

    index(req, res, next) {
        Category.find({})
            .then((categories) => {
                categories = categories.map((category) => category.toObject());
                res.render('admins/categories/index', {
                    layout: 'main',
                    categories,
                })
            })
            .catch((err) => {
                console.log(err);
                next();
            })
    }

    // hiển thị form thêm danh mục
    create(req, res, next) {
        res.render('admins/categories/create', { layout: 'main' });
    }

    // lưu danh mục
    store(req, res, next) {
        const category = new Category(req.body);
        category.save()
            .then(() => {
                res.redirect('/admin/categories');
            })
            .catch(err => {
                console.log(err);
                next();
            })
    }

    // hiển thị danh sách các sub_category của danh mục
    show(req, res, next) {
        Category.aggregate([
            { $match: { 'slug': req.params.slug } },
            { $lookup: {
                from: 'sub_categories',
                localField: 'kids',
                foreignField: '_id',
                as: 'SubCategory'
            }},
        ])
        .then((results) => {
           res.render('admins/categories/show', {
               layout: 'main',
               results: results[0].SubCategory,
           });
        })
        .catch(next);
    }

}

module.exports = new CategoryController;