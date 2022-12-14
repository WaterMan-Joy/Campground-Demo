const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  try {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {
      campgrounds,
    });
  } catch (e) {
    req.flash("error", "캠프를 불로오기 실패했습니다");
    req.redirect("/campgrounds");
  }
};

module.exports.newForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = await req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash("success", "새로운 캠프가 등록되었습니다");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showPage = async (req, res) => {
  const findID = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!findID) {
    req.flash("error", "캠프를 찾을 수 없습니다");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", {
    findID,
  });
};

module.exports.editFrom = async (req, res) => {
  const { id } = req.params;
  const findID = await Campground.findById(id);
  if (!findID) {
    req.flash("error", "수정할 캠프를 찾을 수 없습니다");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", {
    findID,
  });
};

module.exports.editCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(
    id,
    { ...req.body.campground },
    { runValidators: true, new: true }
  );
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: {
        images: {
          filename: {
            $in: req.body.deleteImages,
          },
        },
      },
    });
    console.log(campground);
  }
  req.flash("success", "캠프가 수정 되었습니다");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  const findID = await Campground.findById(id);
  if (!findID) {
    req.flash("error", "캠프를 삭제하지 못했습니다");
    return res.redirect("/campgrounds");
    // throw new ExpressError('삭제하지 못했습니다!', 400);
  }
  for (let img of findID.images) {
    await cloudinary.uploader.destroy(img.filename);
    console.log(img);
  }
  await Campground.findByIdAndDelete(id);
  req.flash("success", "캠프가 삭제되었습니다");
  res.redirect("/campgrounds");
};
