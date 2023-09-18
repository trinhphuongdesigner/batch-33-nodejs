var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { default: mongoose } = require('mongoose');
require('dotenv').config();
const passport = require('passport');

var authRouter = require('./routes/auth/router');
var productsRouter = require('./routes/product/router');
var categoriesRouter = require('./routes/category/router');
var suppliersRouter = require('./routes/supplier/router');
const customersRouter = require('./routes/customer/router');
const employeesRouter = require('./routes/employee/router');
const ordersRouter = require('./routes/order/router');
const questionsRouter = require('./routes/questions/router');

const { CONNECTION_STRING, DB_NAME } = require('./constants/db');

const {
  passportVerifyToken, // USING
  passportVerifyAccount,
  passportConfigBasic,
} = require('./middlewares/passport');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(`${CONNECTION_STRING}${DB_NAME}`);
// mongoose.connect('node-33-database');

passport.use(passportVerifyToken);
passport.use(passportVerifyAccount);
passport.use(passportConfigBasic);

// app.use('/products', passport.authenticate('jwt', { session: false }), productRouter);
app.use('/auth', authRouter);
app.use('/products', passport.authenticate('jwt', { session: false }), productsRouter); 
app.use('/categories', passport.authenticate('jwt', { session: false }), categoriesRouter); 
// passport.authenticate('local', { session: false }
app.use('/suppliers', suppliersRouter); 
app.use('/customers', customersRouter);
app.use('/employees', employeesRouter);
app.use('/orders', ordersRouter);
app.use('/questions', questionsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
