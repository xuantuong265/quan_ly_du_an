const categoriesRouter = require('./admin/categories');
const siteRouter = require('./site');
const homeRoute = require('./page/home');
const subCategoryRouter = require('./admin/sub_categories');
const productRouter = require('./admin/products');
const { checkLogin, checkRoles } = require('../app/middlewares/auth');
const Category = require('../app/models/Category');

function route(app) {

    
    // site
    app.use((req, res, next) => {
        // lưu tên user
        res.locals.userName = req.cookies.userName;

        console.log(req.session.cart);

        // Tính số sản phẩm trong giỏ hàng
        if (typeof req.session.cart !== 'undefined') {

            carts = req.session.cart;

            if (carts !== null) {
                const totalQty = carts.reduce((total, cart) => {
                    return total += parseInt(cart.qty);
                }, 0);
    
                res.locals.totalQty = totalQty;
            }

        }

        // đổ dữ liệu ra menu -left
       const categories = Category.aggregate([
            { $lookup: {
                from: 'sub_categories',
                localField: 'kids',
                foreignField: '_id',
                as: 'SubCategory'
            }},
        ])
        .then((categories) => {
            res.locals.categories = categories;
        })
        .catch(next);

        next();
    });

    app.use('/site/', siteRouter);

    //=========================== admin =========================
    app.use('/admin/categories', checkLogin, checkRoles, categoriesRouter);
    app.use('/admin/sub-category', checkLogin, checkRoles, subCategoryRouter);
    app.use('/admin/product/', checkLogin, checkRoles, productRouter);

    // pages
    app.use('/', homeRoute);

}

module.exports = route;