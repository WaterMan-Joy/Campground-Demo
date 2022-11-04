const express = require("express");
const router = express.Router();

const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");

const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

router.get("/new", isLoggedIn, campgrounds.newForm);

// FIXME:
router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );

router
  .route("/:id")
  .get(catchAsync(campgrounds.showPage))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.editCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.editFrom));

module.exports = router;
