const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')

const Campground = require('../models/campground')
const Review = require('../models/review');

const { reviewSchema } = require('../schemas');
const { isLoggedIn } = require('../middleware');


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
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const findID = await Campground.findById(req.params.id)
    const review = new Review(req.body.review);
    findID.reviews.push(review);
    await review.save();
    console.log(review)
    await findID.save();
    req.flash('success', '댓글 등록 완료');
    res.redirect(`/campgrounds/${findID._id}`);
}))
// TODO: DELETE REVIEWS IN CMAPGROUND
router.delete('/:reviewId', isLoggedIn, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    console.log(`${id}-------${reviewId}`);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', '댓글 삭제 완료');
    res.redirect(`/campgrounds/${id}`);
}))


module.exports = router;