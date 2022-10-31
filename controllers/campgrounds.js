const { model } = require('mongoose');
const Campground = require('../models/campground');


module.exports.index = async (req, res) => {
    try {
        const campgrounds = await Campground.find({})
        res.render('campgrounds/index', {
            campgrounds
        })
    }
    catch (e) {
        req.flash('error', '캠프를 불로오기 실패했습니다');
        req.redirect('/campgrounds');
    }
}

module.exports.newForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save()
    req.flash('success', '새로운 캠프가 등록되었습니다')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showPage = async (req, res) => {
    const findID = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!findID) {
        req.flash('error', '캠프를 찾을 수 없습니다')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {
        findID,
    })
}

module.exports.editFrom = async (req, res) => {
    const { id } = req.params
    const findID = await Campground.findById(id);
    if (!findID) {
        req.flash('error', '수정할 캠프를 찾을 수 없습니다')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {
        findID
    })
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params
    const campgroundID = await Campground.findById(id);
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true })
    req.flash('success', '캠프가 수정 되었습니다')
    res.redirect(`/campgrounds/${campgroundID._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    const findID = await Campground.findById(id);
    if (!findID) {
        req.flash('error', '캠프를 삭제하지 못했습니다');
        return res.redirect('/campgrounds')
        // throw new ExpressError('삭제하지 못했습니다!', 400);
    }
    await Campground.findByIdAndDelete(id)
    req.flash('success', '캠프가 삭제되었습니다');
    res.redirect('/campgrounds')
}