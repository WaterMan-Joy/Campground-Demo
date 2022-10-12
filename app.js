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

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {
        campgrounds
    })
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.get('/campgrounds/:id', async (req, res) => {
    // const { id } = req.params
    const findID = await Campground.findById(req.params.id)
    res.render('campgrounds/show', {
        findID
    })
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const findID = await Campground.findById(req.params.id)
    console.log(findID)
    res.render('campgrounds/edit', {
        findID
    })
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground)
    console.log(campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    const newCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, {new: true})
    res.redirect(`/campgrounds/${newCamp._id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
});

app.use((err, req, res, next) => {
    const { status = 500, message = "SOMETHING WORNG!!" } = err;
    res.status(status).send(message);
})



app.listen(3000, () => {
    console.log('SERVER ON PORT 3000')
})