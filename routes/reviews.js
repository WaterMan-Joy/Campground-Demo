const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');




const { isLoggedIn, validateReview, isAuthor, isReviewAuthor } = require('../middleware');


// TODO: POST REVIEW
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// TODO: DELETE REVIEWS IN CMAPGROUND
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));;


module.exports = router;