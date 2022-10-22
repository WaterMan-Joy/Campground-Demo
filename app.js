const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const Campground = require('./models/campground')
const Review = require('./models/review');
const methodOverride = require('method-override')
const morgan = require('morgan')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync');
const { campgroundSchema, reviewSchema } = require('./schemas');

const app = express()

main()
    .then((res) => {
        console.log('MONGOOSE CONECT!')
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/testcamp');
}

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))

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

// TODO: GET
app.get('/', (req, res) => {
    res.render('home')
})

// TODO: GET
app.get('/campgrounds', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {
        campgrounds
    })
}))

// TODO: GET
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

// TODO: GET
app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const findID = await Campground.findById(req.params.id).populate('reviews')
    if (!findID) {
        throw next(new ExpressError('NOT FOUND CAMPGROUND ID!!', 404));
    }
    res.render('campgrounds/show', {
        findID,
    })
}))

// TODO: GET
app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {
    const findID = await Campground.findById(req.params.id)
    if (!findID) {
        throw next(new ExpressError('EDIT NOT FOUND!!', 404))
    }
    res.render('campgrounds/edit', {
        findID
    })
}))


// TODO: CAMPGROUND POST
app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError('Not Found Campground Data', 400)
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

// TODO: CAMPGROUND PUT
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params
    const newCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, {runValidators: true, new: true})
    res.redirect(`/campgrounds/${newCamp._id}`)
}))

// TODO: DELETE REVIEWS IN CMAPGROUND
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    console.log(`${id}-------${reviewId}`);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

// TODO: CAMPGROUND DELETE
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
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

// TODO: REVIEW POST
app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const findID = await Campground.findById(req.params.id)
    const review = new Review(req.body.review);
    findID.reviews.push(review);
    await review.save();
    console.log(review)
    await findID.save();
    res.redirect(`/campgrounds/${findID._id}`);
}))

const handleError = (err) => {
    console.dir(err);
    return new ExpressError(`ERR NAME - ${err.name}, ERR MESSAGE - ${err.message}, ERR STATUS - ${err.status}, DEFAULT ERR STATUS - `, 400)
}

// TODO: OTHER ERROR
app.all('*', (req, res, next) => {
    next(new ExpressError('PAGE NOT FOUND!!', 404))
})

// TODO: ERROR
app.use((err, req, res, next) => {
    console.log("****************************************")
    console.log("*********************ERROR**************")
    console.log("****************************************")
    console.log(err.name);
    if (err.name === "Error" || err.name === "CastError" || err.name ==='ValidationError') err = handleError(err);
    const { status = 500, message = "SOMETHING WORNG!!" } = err;
    res.status(status).render('error', {
        status, message, err
    })
})



app.listen(3000, () => {
    console.log('SERVER ON PORT 3000')
})