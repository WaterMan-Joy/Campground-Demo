const express = require('express');
const router = express.Router({mergeParams: true});
const User = require('../models/user');

const catchAsync = require('../utils/catchAsync');


router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.flash('success','회원가입을 축하드립니다');
        res.redirect('/campgrounds');
    }
    catch (e) {
        req.flash('error', '회원 가입에 실패하였습니다');
        res.redirect('/register')
    }
}))

module.exports = router;