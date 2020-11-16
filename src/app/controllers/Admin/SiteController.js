const Users = require('../../models/User');
const bcrypt = require('bcrypt');
const { render } = require('node-sass');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


class SiteController {

    // Hiển thị form đăng ký
    formRegister(req, res) {
        res.render('site/register', { layout: 'site'});
    }

    // Hiển thị form đăng nhập
    formLogin(req, res) {
        res.render('site/login', { layout: 'site'});
    }

    // Đăng ký
    async register(req, res, next) {

        try {
            const email = req.body.email;
            const user = await Users.findOne({ email: email });

            if (user){
                return res.redirect('/site/register');  
            }
            else{
                
                const fomData = req.body;
                fomData.role = 'pages';
                const userBody = new Users(fomData);
                await userBody.save();
                const haha = Users.find({});
            
                return res.redirect('/site/login');
            }

        } catch (error) {
            console.log(error);
        } 
    }

    // Đăng nhập
    async login(req, res, next) {

        try {
            const email = req.body.email;
            const password = req.body.password;
            const user = await Users.findOne({ email: email });
            if (user) {
               const same = await bcrypt.compare(password, user.password);
               if (same) {
                     // set cookie for token
                    const userID = user._id;
                    const token = jwt.sign({ userID }, 'password');
                    res.cookie('token', token, { maxAge: 15 * 60 * 1000, httpOnly: true });
                    res.cookie('userName', user.name, { maxAge: 15 * 60 * 1000, httpOnly: true });
                    
                    // check quyền của users
                    if (user.role === 'admin') {
                       return res.redirect('/admin/categories');
                    }else {
                        return res.redirect('/home');
                    }
                    
               }
               return res.redirect('/site/login');
            } 
            return res.redirect('/site/login');
        } catch (error) {
            console.log(error);
        }
    }

    // Đăng xuất
    logout(req, res, next) {
        res.clearCookie('userName');
        res.clearCookie('token');
        res.redirect('back');
    }

}

module.exports = new SiteController;