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

    app.use(flash());

    // Set up routes
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

        );
    });

    app.get('/logout', function(req, res) {
      authenticateUser = true;
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

app.listen(process.env.PORT || 3000)
