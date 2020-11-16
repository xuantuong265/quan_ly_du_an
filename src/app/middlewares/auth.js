const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const User = require('../models/User');


function checkLogin(req, res, next) {

    try {
        const token = req.cookies.token;
        const user = jwt.verify(token, 'password');

        User.findById({ _id: user.userID })
            .then((user) => {
                req.user = user;
                next();
            })
            .catch(() => {
                return res.redirect('/site/login');
            });
    } catch (error) {
        console.log(error);
        next();
        return res.redirect('/site/login');
    }

}

function checkRoles(req, res, next) {
    const role = req.user.role;
    return role === 'admin' ? next() : res.redirect('/site/login');
}


module.exports = {
    checkLogin,
    checkRoles,
}