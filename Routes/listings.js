const express = require('express');
const router = express.Router();
const ExpressError = require('../expressError.js');
const {listingSchema, reviewSchema} = require('../schemaValidate.js');

const Listings = require('../models/listing.js');





//Server side Validation -----

const validateListing =(req,res,next)=>{
    let result = listingSchema.validate(req.body);
    if(result.error){
        next(new ExpressError('400', result.error));}
    }
    const validateReview =(req,res,next)=>{
    let result = reviewSchema.validate(req.body);
    if(result.error){
        next(new ExpressError('400', result.error));}
        next();
    }


//Error HANDLER :-       


//All api's Error Handler---
function asyncWrap(fn){
    console.log('error function is working')
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
};




//Delete route-2:55,98%
router.delete('/:id',asyncWrap( async(req,res)=>{
    const {id} = req.params;
    await Listings.findByIdAndDelete(id);
    console.log('delete is working');
    res.redirect('/listings');
})
);



//Update Route
router.put('/:id',  asyncWrap( async(req,res)=>{
    const {id} = req.params;
    const listing = req.body.listing;
    const {image} = req.body.listing;
    // console.log(image);
    // console.log(id);
    await Listings.findByIdAndUpdate(id, listing);
    await Listings.findByIdAndUpdate(id,{image:{url:image}});

    res.redirect(`/listings/${id}/show`);
})
);

//get Edit Route
router.get('/:id/edit',  asyncWrap( async(req,res)=>{
    let {id} = req.params;
    let listing = await Listings.findById(id);
    res.render('listings/edit.ejs',{listing});
    // res.send('edit route is working')
})
)




//Created Route
router.post('/', asyncWrap(  async(req,res,next)=>{
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

        // let result = listingSchema.validate(req.body);
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
router.get('/new',asyncWrap( async (req,res)=>{
    res.render('listings/new.ejs');
})
);


//Show Route
router.get('/:id/show',asyncWrap( async(req,res)=>{
    let {id} = req.params;
        let listing = await Listings.findById(id).populate('review');
        res.render('listings/show.ejs',{listing});

    })
);

//Index Route---
router.get('/', async(req,res)=>{
    const listLen = (await Listings.find()).length;
    
    const allListings = await Listings.aggregate([ {$sample:{size:listLen}}]); // using for the shuffled documents representation

    // const allListings = await Listings.find();
    res.render('listings/index.ejs',{allListings});
});





module.exports = router;