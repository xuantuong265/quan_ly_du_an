const express = require('express');
const path = require('path');
const morgan = require('morgan')
const bodyParser = require('body-parser');
const app = express();
const handlebars  = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const numeral = require('numeral');

const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');

const port = 3000;

const router = require('./routes');
const db = require('./config/db');
const { checkLogin } = require('./app/middlewares/auth');

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(methodOverride('_method'));
app.use(fileUpload());

app.use(session({
   secret: 'keyboard cat',
   resave: true, 
   saveUninitialized: true, 
   cookie: { maxAge: 15 * 60 * 1000 },
 }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('combined'));
app.engine('hbs', handlebars({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, '/resoures/views/layouts'),
    partialsDir: path.join(__dirname, '/resoures/views/partials'),
    helpers: {
       sum: (a, b) => a + b,
       format_number: (value) => {
          return numeral(value).format('0,0');
       },
       priceOld: (price) => {
          return price / 0.9;
       },
       multiplication: (a, b) => a * b,
       encodeMyString: (inputData) => new Handlebars.SafeString(inputData),
       
    }
}));


app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resoures', 'views'));

router(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})