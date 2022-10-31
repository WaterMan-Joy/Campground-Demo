const express = require('express');
const passport = require('passport');
const { isLoggedIn } = require('../middleware');
const router = express.Router({mergeParams: true});
const User = require('../models/user');
const users = require('../controllers/users');

const catchAsync = require('../utils/catchAsync');


// TODO: GET REGISTER
router.get('/register', users.renderRegister);

// TODO: GET LOGIN
router.get('/login', users.renderLogin);


// TODO: POST LOGIN FIXME:
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), users.login)

// // TODO: LOGOUT
router.get('/logout', catchAsync(users.logout));


// TODO: POST REGISTER
router.post('/register', catchAsync(users.register));

module.exports = router;