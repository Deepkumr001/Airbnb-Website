const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const Listings = require('./models/listing');
const {listingSchema} = require('./schemaValidate.js');
const Review = require('./models/review.js');

//Error HANDLER
const ExpressError = require('./expressError.js');
function asyncWrap(fn){
    console.log('error function is working')
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
};



app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

// app.use(express.urlencoded({extended:true}));

main()
.then(res=>{console.log('Connected to DB Sucessfully!!' )})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Airbnb');
}


//Delete route-2:55,98%
app.delete('/listings/:id',asyncWrap( async(req,res)=>{
    const {id} = req.params;
    await Listings.findByIdAndDelete(id);
    res.redirect('/listings');
})
);

//Update Route
app.put('/listings/:id',asyncWrap( async(req,res)=>{
    const {id} = req.params;
    const listing = req.body.listing;
    const {image} = req.body
    // console.log(image);
    // console.log(id);
    await Listings.findByIdAndUpdate(id, listing);
    await Listings.findByIdAndUpdate(id,{image:{url:image}});

    res.redirect('/listings');
})
);

//get Edit Route
app.get('/listings/:id/edit',asyncWrap( async(req,res)=>{
    let {id} = req.params;
    let listing = await Listings.findById(id);
    console.log(listing);
    res.render('listings/edit.ejs',{listing});
    // res.send('edit route is working')
})
)




//Created Route
app.post('/listings',asyncWrap(  async(req,res,next)=>{
    // res.send('your request is saved')
    // let {title,description,price,image,location,country} = req.body;
   
    // let listing = new Listings({
        //     title:title,
        //     description:description,
        //     price:price,
        //     image:image,
        //     location:location,
        //     country:country,
        
        // });

        // if(!req.body.listing){
        //     next( new ExpressError(400, 'please send valid data for Listing'));
        // }

        let result = listingSchema.validate(req.body);
        // if(result.error){
        //     next(new ExpressError('404', result.error));
        // }

    const newListing = new Listings(req.body.listing);
    
    // console.log(newListing.image);

    await newListing.save()
    // .then(res=>{console.log('listing is saved..' )})
    // .catch(err => console.log(err));

    res.redirect('/listings');

})
);

//New Route
app.get('/listings/new',asyncWrap(  (req,res)=>{
    res.render('listings/new.ejs');
})
);


//Show Route
app.get('/listings/:id/show',asyncWrap( async(req,res)=>{
    let {id} = req.params;
    // console.log(id);

    let listing =await Listings.findById(id);
    // console.log(listing);

    res.render('listings/show.ejs',{listing});
})
);

//Index Route---
app.get('/listings',asyncWrap(  async(req,res)=>{
    const listLen = (await Listings.find()).length;
    console.log(listLen);
    const allListings = await Listings.aggregate([ {$sample:{size:listLen}}]); // using for the shuffled documents representation
    // console.log(listings);
    res.render('listings/index.ejs',{allListings});
})
);


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



//Review Route---
app.post('/listings/:id/review', async(req,res,next)=>{

    const review = new Review(req.body.review);
    console.log(review);
     
    const{id} = req.params;
    console.log(id);

    const listing= await Listings.findById(id);
    console.log(listing);

    listing.review.push(review)
    console.log(listing);

    res.redirect(`/listings/${id}/show`);
    
    
})






//route route
app.get('/',(req,res)=>{
    res.send('Index route is working..');
})

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