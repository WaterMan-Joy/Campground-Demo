const express = require('express');
const passport = require('passport');
const router = express.Router({mergeParams: true});
const User = require('../models/user');

const catchAsync = require('../utils/catchAsync');


// TODO: GET REGISTER
router.get('/register', (req, res) => {
    res.render('users/register');
})

// TODO: GET LOGIN
router.get('/login', (req, res) => {
    res.render('users/login');
})


// TODO: POST LOGINT
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', '로그인이 되었습니다');
    res.redirect('/campgrounds');
});

// // TODO: LOGOUT
router.get('/logout', catchAsync(async (req, res) => {
    req.logout(function (err) {
      if (err) {
        req.flash('error', '로그인에 실패하였습니다');
        return res.redirect('/campgrounds');
      }
      req.flash('success', '로그아웃 되었습니다');
      res.redirect('/campgrounds');
    });
  }));


// TODO: POST REGISTER
router.post('/register', catchAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.flash('success', '회원가입을 축하드립니다');
        res.redirect('/campgrounds');
    }
    catch (e) {
        req.flash('error', '회원 가입에 실패하였습니다');
        res.redirect('/register')
    }
}));

module.exports = router;