const mongoose = require('mongoose');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers');
const Campground = require('../models/campground')


mongoose.connect('mongodb://localhost:27017/yelp-camp',{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"Connection Error:"));
db.once("open",()=>{
    console.log("Database Connected!!");
})

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async () =>{
    await Campground.deleteMany({});
    for(let i=0;i<300;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: '6096b0c1621eb2163068e5bc',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Qui ipsum beatae commodi voluptas architecto pariatur repellendus, odio assumenda velit id perferendis atque asperiores tenetur quas iusto nulla obcaecati sequi sed.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/chats/image/upload/v1620928429/Yelp-Camp/nxnof0xxbr8ztwndkpuo.png',
                  filename: 'Yelp-Camp/nxnof0xxbr8ztwndkpuo'
                },
                {
                  url: 'https://res.cloudinary.com/chats/image/upload/v1620928430/Yelp-Camp/xj0egixky5qqqahyxawx.png',
                  filename: 'Yelp-Camp/xj0egixky5qqqahyxawx'
                },
                {
                  url: 'https://res.cloudinary.com/chats/image/upload/v1620928436/Yelp-Camp/ipq57qrwokpncvgh84kr.png',
                  filename: 'Yelp-Camp/ipq57qrwokpncvgh84kr'
                }
              ]
        })
        await camp.save();
    }
    
}

seedDB().then(()=>{
    mongoose.connection.close();
});