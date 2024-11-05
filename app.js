const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const ejsMate = require('ejs-mate');

const Listings = require('./models/listing');
const Review = require('./models/review.js');



const {listingSchema, reviewSchema} = require('./schemaValidate.js');









//Error HANDLER
const ExpressError = require('./expressError.js');
const Listing = require('./models/listing');


//All api's Error Handler---
function asyncWrap(fn){
    console.log('error function is working')
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
};

// ---------------------------

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

// app.use(express.urlencoded({extended:true}));



//Router Setup-Listings
const listings = require('./Routes/listings.js');
app.use('/listings', listings);



//Router Setup-Reviews
const reviews = require('./Routes/review.js');
app.use('/listings/review', reviews);







main()
.then(res=>{console.log('Connected to DB Sucessfully!!' )})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Airbnb');
}





// app.get('/testListing',async(req,res)=>{
//     let listing = new Listing({
//         title:'Holiday Stays',
//         price:1200,
//         location:'Mumbai',
//         country:'India'
//     });

//     await listing.save()
//     .then(res=>{console.log(`saved to Db ${res}`)})
//     .catch(err => console.log(err));

//     res.send('Data Has been saved!');

// })






//route route
app.get('/',(req,res)=>{
    res.render('listings/home.ejs');
});





//general Error catcher----
//error hander for all invalid routes--
app.all('*', (req,res,next)=>{
    next(new ExpressError('404', 'Page not Found!'));
   
})

//error Catcher for asyncWrap---
app.use((err,req,res,next)=>{
    let{status =500, message='some error Occur'}= err;
    // console.log('error hander is working');``
    // res.status(status).send(message);
    res.render('listings/error.ejs',{err});
})





app.listen(8080,()=>{
    console.log('Server is litening on port 8080')
})