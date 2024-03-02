const express = require("express");
const router = express.Router();
const Listing = require('../models/listing.js');         //Mongoose(MongoDB) Model
const User = require('../models/user.js');
const wrapAsync = require("../utils/wrapAsync.js");               //wrapAsync Func. for Async Functions
const {listingValidate, isLoggedIn, isOwner} = require("../middleware.js");
const {cloudinary, storage} = require("../cloudConfig.js");
const multer  = require('multer');
const ExpressError = require("../utils/ExpressError.js");
const upload = multer({ storage });
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });


//Index route
router.get("/",wrapAsync(async (req,res)=>{
    let {country: qcountry, category : qcategory} = req.query;
    if(typeof qcountry !== "undefined"){
      let listings = await Listing.find({country : `${qcountry}`});
      return res.render("listings/index.ejs", {listings});
    }
    if(typeof qcategory !== "undefined"){
      let listings = await Listing.find({category: `${qcategory}`});
      return res.render("listings/index.ejs", {listings});
    }
    let listings = await Listing.find();
    res.render("listings/index.ejs", {listings});
  }));
  
//new route
router.get('/new',isLoggedIn, (req,res)=>{
  res.render('listings/new.ejs');
});

//show route 
router.get("/:id",wrapAsync( async (req,res)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id).populate({path: "reviews", populate : {path: "author"}}).populate("owner");
  if(!listing){
    req.flash("error", "Listing requested by you does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", listing);
}));

//edit route
router.get('/:id/edit',  isLoggedIn ,isOwner,wrapAsync( async (req,res) =>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing){
    req.flash("error", "Listing requested by you does not exist!");
     return res.redirect("/listings");
  }
  let originalUrl = listing.image.url.replace("upload/", "upload/w_300/");
  res.render('listings/edit.ejs', {listing, originalUrl});
}));

//update route
router.put('/:id',isLoggedIn,isOwner, upload.single('listing[image]'),listingValidate, wrapAsync(async (req,res,next) => {
  let {id} = req.params;
  let listing = await Listing.findByIdAndUpdate(id,req.body.listing);
  if(typeof req.file !== 'undefined'){
    cloudinary.uploader.destroy(listing.image.filename, function (error, result) {
      if(error){
        next(new ExpressError(500, error.message));
      }
    });
    let {path : url, filename} = req.file;
    listing.image = {url, filename};
  }
  let coordinates = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit : 1
  }).send();
  listing.geometry = coordinates.body.features[0].geometry;
  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
}));

//create route
router.post('/',isLoggedIn, upload.single('listing[image]'), listingValidate, wrapAsync(async (req,res,next)=>{
  let {path : url, filename} = req.file;
  let {listing} = req.body;
  let data = new Listing(listing);
  data.owner = req.user._id;
  data.image = {url, filename};
  let coordinates = await geocodingClient.forwardGeocode({
    query: listing.location +", "+ listing.country,
    limit : 1
  }).send();
  data.geometry = coordinates.body.features[0].geometry;
  await data.save();
  let currUser = await User.findById(req.user._id);
  currUser.lists.push(data);
  await currUser.save();
  req.flash("success", "New Listing Created Successfully!");
  res.redirect('/listings');
}));


//destroy route
router.delete('/:id',isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
  let {id} = req.params;
  let listing = await Listing.findByIdAndDelete(id);
  if(listing.image.filename !== "listingimage"){
    cloudinary.uploader.destroy(listing.image.filename, function (error, result) {
      if(error){
        next(new ExpressError(500, error.message));
      }
    });
  }
  let currUser = await User.findById(req.user._id);
  let index = currUser.lists.indexOf(id);
  currUser.lists.splice(index,1);
  await currUser.save();
  req.flash("success", "Listing Deleted!");
  res.redirect('/listings');
}));

module.exports = router;