const mongoose = require("mongoose");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const Campground = require("../models/campground");

main()
  .then((res) => {
    console.log("SEED CONECT!!");
  })
  .catch((err) => console.log("ERR!!"));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/testcamp");
}

const randomArry = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 30) + 100;
    const basicCamp = new Campground({
      author: "635f64e3a153f588c4473efc",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${randomArry(descriptors)}, ${randomArry(places)}`,
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Inventore natus mollitia iste autem deleniti optio similique labore ipsam nam culpa, quas cum repellat dolorem ab quo sed hic, quibusdam recusandae.",
      price,
      geometry: { type: "Point", coordinates: [126.9782914, 37.5666791] },
      images: [
        {
          url: "https://res.cloudinary.com/dkuktrvsu/image/upload/v1667305208/Campground/ufimprufyafdxj0mq0if.jpg",
          filename: "Campground/ufimprufyafdxj0mq0if",
        },
        {
          url: "https://res.cloudinary.com/dkuktrvsu/image/upload/v1667305208/Campground/fr9hw8s5jfigvzru4cur.jpg",
          filename: "Campground/fr9hw8s5jfigvzru4cur",
        },
      ],
    });
    await basicCamp.save();
  }
};

seedDB().then((res) => {
  console.log("SEED MONGOOSE!", res);
  mongoose.connection.close();
});
