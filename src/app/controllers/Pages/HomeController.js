const Category = require('../../models/Category');
const Product = require('../../models/Product');
const SubCategory = require('../../models/SubCategory');
const Order = require('../../models/Order');
const DetailOrder = require('../../models/DetailOrder');

class HomeController {

    index(req, res, next) {

        var products;
        var page = parseInt(req.query.page);
        page < 1 ? page = 1 : page;
        
        Promise.all([ Product.paginate({}, { page: parseInt(page), limit: 2 })])
            .then(([results]) => {
                
                products = results.docs;
                products = products.map(product => product.toObject());

                let paginate = [];
                for (let index = 1; index <= results.pages; index++) {
                    let item = {
                        value: index,
                        isActive: index === parseInt(results.page),
                    }
                    paginate.push(item);
                }

                res.render('pages/home', {
                    layout: 'pages',
                    products: products,
                    total: paginate,
                    prev_page: results.page - 1,
                    next_page: results.page + 1,
                    can_go_prev: results.page > 1,
                    can_go_next: results.page < results.pages,
                 });
            })
            .catch(next);
    }

    // Hiển thị danh sách sản phẩm của sub categories
    listProSub(req, res, next) {

        SubCategory.aggregate([
            { $match: { 'slug': req.params.slug } },
            { $lookup: {
                from: 'products',
                localField: 'products',
                foreignField: '_id',
                as: 'Product'
            }},
        ])
        .then((results) => {
            res.render('pages/list_pro_sub', {
                layout: 'pages',
                results,
            });
        })
        .catch(next);
    }


    // Hiển thị trang chi tiết sản phẩm
    show(req, res, next) {
        Product.findOne({ slug: req.params.slug })
            .then((product) => {
                product = product.toObject();
                res.render('pages/detail_pro', {
                    layout: 'site',
                    product: product,
                });
            })
            .catch(next);
    }


    // add cart
    addCart(req, res, next) {
       var cart = req.body;
       var carts = [];
       Product.findById({ _id: cart.id })
            .then((product) => {

                if(typeof req.session.cart === 'undefined') {

                    carts.push({
                        _id: product._id,
                        name: product.name,
                        price: product.price,
                        qty: cart.qty,
                        image: product.image,
                    });

                    req.session.cart = carts;

                }else {
                    let carts = req.session.cart;
                    let isCheck = true;

                    for (let i = 0; i < carts.length; i++) {
                        if (carts[i]._id == cart.id) {
                            carts[i].qty = parseInt(carts[i].qty) + parseInt(cart.qty),
                            isCheck = false;
                            req.session.cart = carts;
                            break;
                        }
                    }

                    if(isCheck) {

                        (req.session.cart).push({
                            _id: product._id,
                            name: product.name,
                            price: product.price,
                            qty: cart.qty,
                            image: product.image,
                        });

                        req.session.cart = carts;
                        
                    }
                   
                }

               // res.locals.carts = res.session.cart;
                res.json(req.session.cart);

            })
            .catch(next);
    }

    // Hiển thị trang giỏ hàng
    showCart(req, res, next) {

        let carts;
        
        if (typeof req.session.cart === 'undefined') {
            carts = [];
        }else {
            carts = req.session.cart;
        }

        // tính tổng tiền và số lượng sản phẩm trong giỏ hàng
        let total = 0, totalQty = 0;
        if (carts !== null) {
            for (let i = 0; i < carts.length; i++) {
                totalQty += parseInt(carts[i].qty);
                total += parseInt(totalQty) * parseFloat(carts[i].price);
            }
        }
        
        res.render('pages/cart', {
            layout: 'site',
            carts,
            totalQty,
            total,
        });
    }

    // Cập nhật lại giỏ hàng
    plusCart(req, res, next) {
        
        if (typeof req.session.cart !== 'undefined') {
            
            const cartUpdate = req.body;
            const carts = req.session.cart;

            carts.map(cart => {
                if (cart._id === cartUpdate.id) {
                    cart.qty++;
                    return;
                }
            });

            req.session.cart = carts; // cập nhật lại session

        }

        // console.log(req.session.cart);
        res.json(req.session.cart);

    }

    // Trừ số lượng sản phẩm trong giỏ hàng
    minusCart(req, res, next) {

        if (typeof req.session.cart !== 'undefined') {
            
            const cartUpdate = req.body;
            const carts = req.session.cart;

            carts.map(cart => {
                if (cart._id === cartUpdate.id) {
                    cart.qty--;
                    return; 
                }
            });

            req.session.cart = carts; // cập nhật lại session

        }

        console.log(req.session.cart);
        res.json(req.session.cart);

    }

    // xóa sản phẩm trong giỏ hàng
    deleteCart(req, res, next) {
        
        if (typeof req.session.cart !== 'undefined') {

            const carts = req.session.cart;
            const productID = req.body.id;
            
            var filtered = carts.filter(function(cart, index, arr){ return cart._id !== productID; });

            req.session.cart = filtered;
            res.json(req.session.cart); 
        }

    }

    // Xử lý các action form
    handleCart(req, res, next) {

        switch (req.body.action) {
            case 'delete':
                
                if (typeof req.session.cart !== 'undefined') {
                    const carts = req.session.cart;
                    const cartIDs = req.body.checkItem;

                    for (let i = 0; i < carts.length; i++) {
                        for (let j = 0; j < cartIDs.length; j++) {
                            if (carts[i]._id === cartIDs[j]) {
                                carts.splice(i, 1);
                            }
                        }
                    }
                    req.session.cart = carts;
                    res.json(carts);
                }

                break;
        }

    }

    // Thanh toán giỏ hàng
    paymentCart(req, res, next) {
        const formData = req.body;
        formData.status = false;
        const carts = req.session.cart;

        console.log(formData);

        const order = new Order(formData);
        order.save()
             .then(() => {
                 carts.map(function(cart) {

                    const detail = new DetailOrder({
                        nameProduct: cart.name,
                        imageProduct: cart.image,
                        price: cart.price,
                        amount: cart.qty,
                    });
                    detail.save()
                        .then(() => {
                            Order.findByIdAndUpdate({ _id: order._id }, { $push: { kids: detail._id } })
                                .then(() => {
                                    // hủy session giỏ hàng
                                    req.session.cart = null;
                                    res.json('Mua thành công');
                                })
                                .catch(next);
                        })
                        .catch(next);
                 });
             })
             .catch(next);
    }


    // Tìm kiếm sản phẩm theo tên bằng ajax
    filterName(req, res, next) {

        const keyword = req.query.keyword;

        Product.find({ name:  { $regex : keyword,  $options: 'i' } })
            .then(products => {
                products = products.map(product => product.toObject());
                res.render('pages/filter', {
                    layout: 'pages',
                    products,
                });
            })
            .catch(next);
    }

    // Tìm kiếm sản phẩm theo giá bằng ajax

    filterPrice(req, res, next) {

        const priceStart = parseFloat(req.body.priceStart);
        const priceEnd = parseFloat(req.body.priceEnd);

        Product.find({ price: {  $gt: priceStart, $lt: priceEnd } })
            .then((products) => { 
                products = products.map(product => product.toObject());
                res.json(products);
            })  
            .catch(next);

    }

    api(req, res, next) {
        Product.find({})
            .then((products) => {
                res.json(products);
            })
            .catch(next);
    }


}

module.exports = new HomeController();