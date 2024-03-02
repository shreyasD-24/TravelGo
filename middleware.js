const ExpressError = require("./utils/ExpressError");       //Custom error handling class
const {listingSchema, reviewSchema} = require("./schema.js");             //Schema for Server Side schema validation
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const wrapAsync = require("./utils/wrapAsync.js");

//Listing Schema Validation Middleware
module.exports.listingValidate = (req,res,next) =>{
    let result = listingSchema.validate(req.body);
    if(result.error){
      next(new ExpressError(400, result.error));
    }else{
      next();
    }
};

//Review Schema Validation Middleware
module.exports.reviewValidate = (req,res,next) => {
    let result = reviewSchema.validate(req.body);
    if(result.error){
      next(new ExpressError(400 , result.error));
    }else{
      next();
    }
};


//Middleware to check if a someone is logged in or not
module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
};


//Middleware to save redirectUrl if any
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

//Middleware to give Authorisation
module.exports.isOwner = wrapAsync(async (req,res,next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("owner");
    if(!req.user._id.equals(listing.owner._id)){
        req.flash("error","Listings can only be handled by their Owners!");
        return res.redirect(`/listings/${id}`);
    }
    next();
});

//Middleware to check if current user is owner of Review
module.exports.isReviewAuthor = wrapAsync(async (req,res,next) => {
    let {reviewId,id} = req.params;
    let review = await Review.findById(reviewId).populate("author");
    if(!req.user._id.equals(review.author._id)){
        req.flash("error", "Only Authors can delete their Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
});