const mongoose = require('mongoose');

const Listing = require('../models/listing');

const allData = require('./data')

main()
.then(res=>{console.log('Connected to DB Sucessfully!!' )})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Airbnb');
}


async function initDB(){
    await Listing.deleteMany({});

    await Listing.insertMany(allData.data)
    console.log(allData.data)


}


initDB();