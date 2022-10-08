const mongoose = require('mongoose')
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')
const Campground = require('../models/campground')


main()
    .then((res) => {
        console.log('SEED CONECT!!')
    })
.catch(err => console.log('ERR!!'))

async function main() {
    await mongoose.connect('mongodb://localhost:27017/testcamp');
}

const randomArry = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}


const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const basicCamp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${randomArry(descriptors)}, ${randomArry(places)}`,

        })
        await basicCamp.save()
    }
}

seedDB()
    .then(res => {
        console.log('SEED MONGOOSE!', res)
    mongoose.connection.close()
})