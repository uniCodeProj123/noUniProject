if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const session = require('express-session')
const flash = require('connect-flash')
const auth = require('./auth.js')
const customerAuth = require('./customerAuth.js')


const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')
const userRouter = require('./routes/users')
const customerRouter = require('./routes/customers')


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))



// SETUP THE SERVER


const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true,  useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))


app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)
app.use('/users', userRouter)
app.use('/customers', customerRouter)


app.use('/', express.static(__dirname + '/public'));

    app.use(session({
        secret: 'some-secret',
        saveUninitialized: false,
        resave: true
    }));

    // For parsing post request's data/body
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // Tells app to use password session
    app.use(auth.initialize());
    app.use(auth.session());
    app.use(customerAuth.initialize());
    app.use(customerAuth.session());
    app.use(flash());



    //ADMIN (hard coded) LOGIN LOGIC


    // Set up admin login routes
    app.get('/', function(req, res) {
        if(req.user) {
            res.send(
                '<p>You\'re logged in as <strong>' + req.user.username + '</strong>.</p>'
                + '<p><a href="/logout">Log out</a></p>'
            );
        }
        else {
            res.send('<p><a href="/login">Login</a></p>');
        }
    });

    app.get('/login', function(req, res) {
        res.send(
            '<form action="/login" method="POST">'
            + '<h2>Admin Login Page</h2>'
            + '<p>Admin name : <input name="username"></p>'
            + '<p>Admin password : <input name="password"></p>'
            + '<p><input type="submit" value="Login"></p>'
            + '<p style="color: red;">' + req.flash('error') + '</p>'
            + '</form>'
            + '<form action="/home" method="GET">'
            + '<button class="btn btn-primary" type="submit">HOME</button>'
            + '</form>'
        );
    });

    app.get('/logout', function(req, res) {
      authenticateUser = false;
        req.logout();
        res.redirect('/');
    });

    app.post('/login',
        auth.authenticate('login', {
            successRedirect: '/books/new',
            failureRedirect: '/login',
            failureFlash: true
        })
    );

    app.get('/home', function(req, res) {
      res.redirect('/');
    });



//CUSTOMERS (hard coded) LOGIN LOGIC


    // Set up customer login routes
    app.get('/', function(req, res) {
        if(req.cUser) {
            res.send(
                '<p>You\'re logged in as <strong>' + req.cUser.username + '</strong>.</p>'
                + '<p><a href="/logout">Log out</a></p>'
            );
        }
        else {
            res.send('<p><a href="/customers/login">Login</a></p>');
        }
    });

    app.get('/customers/login', function(req, res) {
        res.send(
            '<form action="/customers/login" method="POST">'
            + '<h2>Customer Login Page</h2>'
            + '<p>Customer name : <input name="username"></p>'
            + '<p>Customer password : <input name="password"></p>'
            + '<p><input type="submit" value="Login"></p>'
            + '<p style="color: red;">' + req.flash('error') + '</p>'
            + '</form>'
            + '<form action="/customers/home" method="GET">'
            + '<button class="btn btn-primary" type="submit">HOME</button>'
            + '</form>'
        );
    });

    app.get('/customers/logout', function(req, res) {
      authenticateCustomer = false;
        req.logout();
        res.redirect('/');
    });

    app.post('/customers/login',
        customerAuth.authenticate('/customers/login', {
            successRedirect: '/',
            failureRedirect: '/customers/login',
            failureFlash: true
        })
    );

    app.get('/customers/home', function(req, res) {
      res.redirect('/');
    });



app.listen(process.env.PORT || 3000)
