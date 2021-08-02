const { request } = require('express');
const express = require('express');
const expresslayout = require('express-ejs-layouts');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

// Passport Config
require('./config/passport')(passport);

const db = require('./config/keys').mongoURL;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err))
app.use(expresslayout);
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))

// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());


// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));




const port = process.env.PORT || 3000;

app.listen(port, console.log(`server listiong at port ${port}`))