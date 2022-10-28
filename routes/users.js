const express = require('express');
const { model } = require('mongoose');
const router = express.Router({mergeParams: true});
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    res.send(req.body)
})

module.exports = router;