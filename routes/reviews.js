const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')

const Campground = require('../models/campground')
const Review = require('../models/review');

const { reviewSchema } = require('../schemas');


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

// TODO: POST REVIEW
router.post('/', validateReview, catchAsync(async (req, res) => {
    const findID = await Campground.findById(req.params.id)
    const review = new Review(req.body.review);
    findID.reviews.push(review);
    await review.save();
    console.log(review)
    await findID.save();
    res.redirect(`/campgrounds/${findID._id}`);
}))
// TODO: DELETE REVIEWS IN CMAPGROUND
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    console.log(`${id}-------${reviewId}`);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))


module.exports = router;