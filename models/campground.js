const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

const CampgroundSchema = new Schema({
    title: {
        type: String,
        required: [true, "CAN NOT FOUND TITLE"],
    },
    images: [
        {
            url: String,
            filename: String,
        }
    ],
    price: {
        type: Number,
        required: true
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
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

// CampgroundSchema.post('findOneAndDelete', async function (camp) {
//     if (camp.reviews.length) {
//         const deleteReview = await Review.deleteMany({ _id: { $in: camp.reviews } });
//         console.log(deleteReview);
//     }
// })

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

const Campground = mongoose.model('Campground', CampgroundSchema)
module.exports = Campground