const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const morgan = require('morgan')
const ejs = require('ejs');
const mehtodOveride = require('method-override')
const expressLayout = require('express-ejs-layouts');
const authRoutes = require('./routes/auth');
const indexRoute = require('./routes/index');
const storyRoute = require('./routes/stories');
const { isRegExp } = require('util');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require("express-session");
const MongoStrore = require('connect-mongo')(session);



// Load Config
dotenv.config({
    path: './config/config.env'
})

// creating an instance of the application
const app = express('dev');

// connecting to the MongoDb database
connectDB();


// http request logger 
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// parsing middleware
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.json());

//mehod overrie middleware 

app.use(mehtodOveride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and PUT it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))

// session middlware 
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: new MongoStrore({
            mongooseConnection: mongoose.connection
        })
    })
)

//passport middleware
app.use(passport.initialize());
app.use(passport.session());


// setting related viewEngine
app.set('view engine', 'ejs');
app.use(expressLayout);
app.set('layout', './layouts/layout', './layouts/login');

// setting global variables
app.use(function(req, res, next) {
    res.locals.user = req.user || null;
    next();
})


//Route handlers  
app.use('/', indexRoute);
app.use('/auth', authRoutes);
app.use('/stories', storyRoute);

//assigning the static path
app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`the server is running in ${process.env.NODE_ENV} mode on  the ${PORT}`)
});