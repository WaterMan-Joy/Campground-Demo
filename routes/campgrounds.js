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
router.get('/', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {
        campgrounds
    })
}))

// TODO: GET
router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

// TODO: GET
router.get('/:id', catchAsync(async (req, res, next) => {
    const findID = await Campground.findById(req.params.id).populate('reviews')
    if (!findID) {
        throw next(new ExpressError('NOT FOUND CAMPGROUND ID!!', 404));
    }
    res.render('campgrounds/show', {
        findID,
    })
}))

// TODO: GET
router.get('/:id/edit', catchAsync(async (req, res, next) => {
    const findID = await Campground.findById(req.params.id)
    if (!findID) {
        throw next(new ExpressError('EDIT NOT FOUND!!', 404))
    }
    res.render('campgrounds/edit', {
        findID
    })
}))

// TODO: POST CAMPGROUND
router.post('/', validateCampground, catchAsync(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError('Not Found Campground Data', 400)
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

// TODO: PUT CAMPGROUND
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params
    const newCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, {runValidators: true, new: true})
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
        res.redirect('/campgrounds')
    }
}));



module.exports = router;