const mongoose = require('mongoose');

main()
.then(res=>{console.log('Connected to DB Sucessfully---!!' )})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Airbnb');
}



const reviewSchema = new mongoose.Schema({
    rating:{
        type:Number,
        min:1,
        max:5
    },

    comment:{
        type:String
    },

    created_at:{
        type: Date
    }

})

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;