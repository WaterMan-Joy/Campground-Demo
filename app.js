const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const Campground = require('./models/campground')


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

app.use(express.urlencoded({ extended: true}))

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


app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground)
    console.log(campground)
    await campground.save()
    res.redirect(`campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id', async (req, res) => {
    // const { id } = req.params
    const findID = await Campground.findById(req.params.id)
    res.render('campgrounds/show', {
        findID
    })
})



app.listen(3000, () => {
    console.log('SERVER ON PORT 3000')
})