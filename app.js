const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override')
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const ExpressError = require('./utils/ExpressError');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

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

app.use(session({
    secret: 'thisismykey',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'sumkim93@gmail.com', username: 'Joy' });
    console.log(user)
    const newUser = await User.register(user, 'chicken');
    console.log(newUser)
    res.send(`${newUser} ******** ${user}`);
})
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);
app.use(express.static(path.join(__dirname, 'public')));


// TODO: GET
app.get('/', (req, res) => {
    res.render('home')
})


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