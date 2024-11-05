const express = require('express');
const router = express.Router();
const {listingSchema, reviewSchema} = require('../schemaValidate.js');


const ExpressError = require('../expressError.js');


const Review = require('../models/review.js');
const Listings = require('../models/listing.js');


//All api's Error Handler---
function asyncWrap(fn){
    console.log('error function is working')
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
};


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



//Review Route---
router.post('/:id', asyncWrap(async(req,res,next)=>{

    const newReview = new Review(req.body.review);
    await newReview.save()
    // console.log(newReview);
     
    const {id} = req.params;
    console.log(id);

    const listing= await Listings.findById(id);
    console.log( 'Before push :-',listing);
    
// IN THIS CASE REVIEW IN ITSELF SOTRE IN THE LISTING ---    
    let result =listing.review.push(newReview);
     await listing.save();
    // console.log('After push',listing);


//INCASE WE WANT TO STORY ID OF THE REVIEW AND LATER POPULATE IT ...
    // listing.review = newReview;
    // await listing.save();
    // const newList = await Listing.findById(id).populate('review');
    
    const newList = await Listings.findById(id);
    // console.log('After push search',newList);

    // const allReview =await Review.find({})
    // console.log(allReview);

    res.redirect(`/listings/${id}/show`);

    
    
})
);


//Review delete Route

router.delete('/:id/:reviewId', asyncWrap( async(req,res)=>{
    // res.send('review Delete Route is WOrking')

    let{id, reviewId} = req.params;

    await Listings.findByIdAndUpdate(id, {$pull:{review: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}/show`);
}))


module.exports = router;