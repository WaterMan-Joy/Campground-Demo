const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200,h_200,c_fit");
});

const opts = { toJSON: { virtuals: true } };
// 가상 데이터를 사용하기 위한 방법

const CampgroundSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "CAN NOT FOUND TITLE"],
    },
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<a href="/campgrounds/${this._id}">${this.title}</a>`;
});

const Campground = mongoose.model("Campground", CampgroundSchema);
module.exports = Campground;
