const { campgroundSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', '로그인이 필요합니다');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', '승인된 사용자가 아닙니다');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}