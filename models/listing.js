const mongoose = require('mongoose');
const Review = require('./review');

main()
.then(res=>{console.log('Connected to DB Sucessfully---!!' )})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Airbnb');
}


const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        max:[20],
        default:'A very much comfortable property , for your Comfort!'
    },
    image:{
        filename:{
            type:String,
        },
        url:{
            type:String,
            default:'https://images.pexels.com/photos/9130978/pexels-photo-9130978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            set:(v)=>
                v===' '
            ?'https://media.istockphoto.com/id/1498982549/photo/a-happy-tourist-woman-pn-summer-holidays-walks-on-a-wooden-jetty-in-the-maldives.jpg?s=2048x2048&w=is&k=20&c=DXuSTk1eIEEuwvimc756QpLDxzG2VjFAhxTBytY_9ls='
            :v, 
        }
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },

    review:[
        {type:mongoose.Schema.Types.ObjectId,
        ref:'Review'}
    ]



})


const Listing = mongoose.model('Listing',listingSchema);

module.exports = Listing;