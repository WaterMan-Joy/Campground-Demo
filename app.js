const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const morgan = require('morgan')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync');
const Joi = require('joi');
const { campgroundSchema } = require('./schemas');

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

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {
        campgrounds
    })
}))

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const findID = await Campground.findById(req.params.id)
    if (!findID) {
        throw next(new ExpressError('CAMPGROUND NOT FOUND!!', 404));
    }
    res.render('campgrounds/show', {
        findID
    })
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {
    const findID = await Campground.findById(req.params.id)
    if (!findID) {
        throw next(new ExpressError('EDIT NOT FOUND!!', 404))
    }
    res.render('campgrounds/edit', {
        findID
    })
}))


app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Not Found Campground Data', 400)
        const campground = new Campground(req.body.campground)
        await campground.save()
        res.redirect(`/campgrounds/${campground._id}`)
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params
    const newCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, {runValidators: true, new: true})
    res.redirect(`/campgrounds/${newCamp._id}`)
}))

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
});

const handleError = (err) => {
    console.dir(err);
    return new ExpressError(`${err.name} FAILED...${err.message}, ${err.status}`, 400)
}

app.all('*', (req, res, next) => {
    next(new ExpressError('PAGE NOT FOUND!!', 404))
})

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