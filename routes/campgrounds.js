const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')

const Campground = require('../models/campground');
const Review = require('../models/review');

const { campgroundSchema } = require('../schemas');



const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}



// TODO: GET
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {
        campgrounds
    })
}))

// TODO: GET
router.get('/new', (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error', '다시 로그인 하십시요');
        return res.redirect('/login');
    }
    res.render('campgrounds/new')
})

// TODO: GET
router.get('/:id', catchAsync(async (req, res) => {
    const findID = await Campground.findById(req.params.id).populate('reviews')
    if (!findID) {
        req.flash('error', '캠프를 찾을 수 없습니다')
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {
        findID,
    })
}))

// TODO: GET
router.get('/:id/edit', catchAsync(async (req, res) => {
    const findID = await Campground.findById(req.params.id)
    if (!findID) {
        req.flash('error', '수정할 캠프를 찾을 수 없습니다')
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {
        findID
    })
}))

// TODO: POST CAMPGROUND
router.post('/', validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    req.flash('success', '새로운 캠프가 등록되었습니다')
    res.redirect(`/campgrounds/${campground._id}`)
}))

// TODO: PUT CAMPGROUND
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params
    const newCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true })
    req.flash('success', '캠프가 수정 되었습니다')
    res.redirect(`/campgrounds/${newCamp._id}`)
}))

// TODO: DELETE CAMPGROUND
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const findID = await Campground.findById(id);
    if (!findID) {
        throw new ExpressError('Delete Failed!', 400);
    }
    else {
        await Campground.findByIdAndDelete(id)
        req.flash('success', '캠프가 삭제되었습니다');
        res.redirect('/campgrounds')
    }
}));



module.exports = router;