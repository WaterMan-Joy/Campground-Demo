const express = require('express');
const router = express.Router();

const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');





// TODO: GET
router.get('/', catchAsync(campgrounds.index));

// TODO: GET
router.get('/new', isLoggedIn, campgrounds.newForm);

// TODO: GET
router.get('/:id', catchAsync(campgrounds.showPage));

// TODO: GET
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editFrom))

// TODO: POST CAMPGROUND
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// TODO: PUT CAMPGROUND
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampground))

// TODO: DELETE CAMPGROUND
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));



module.exports = router;