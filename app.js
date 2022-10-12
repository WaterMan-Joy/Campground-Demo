const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const morgan = require('morgan')
const ejsMate = require('ejs-mate')
const AppError = require('./AppError')

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

function warpAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e));
    }
}

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', async (req, res, next) => {
    try {
        const campgrounds = await Campground.find({})
        res.render('campgrounds/index', {
            campgrounds
        })
    }
    catch (e) {
        next(e);
    }
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.get('/campgrounds/:id', warpAsync(async (req, res, next) => {
    const findID = await Campground.findById(req.params.id)
    if (!findID) {
        throw next(new AppError('CAMPGROUND NOT FOUND!!', 404));
    }
    res.render('campgrounds/show', {
        findID
    })
}))

app.get('/campgrounds/:id/edit', async (req, res, next) => {
    try {
        const findID = await Campground.findById(req.params.id)
        if (!findID) {
            throw next(new AppError('EDIT NOT FOUND!!', 404))
        }
        res.render('campgrounds/edit', {
            findID
        })
    }
    catch (e) {
        next(e);
    }
})

app.post('/campgrounds', async (req, res, next) => {
    try {
        const campground = new Campground(req.body.campground)
        await campground.save()
        res.redirect(`/campgrounds/${campground._id}`)
    }
    catch (e) {
        console.log(e);
        next(e);
    }
})

app.put('/campgrounds/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const newCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, {runValidators: true, new: true})
        res.redirect(`/campgrounds/${newCamp._id}`)
    }
    catch (e) {
        console.log(e);
        next(e);
    }
})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
});

app.use((err, req, res, next) => {
    console.log("****************************************")
    console.log("*********************ERROR*******************")
    console.log("****************************************")
    const { status = 500, message = "SOMETHING WORNG!!" } = err;
    res.status(status).send(message);
})



app.listen(3000, () => {
    console.log('SERVER ON PORT 3000')
})