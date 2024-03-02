const mongoose = require("mongoose");
const Review = require("./review.js");

let listingSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },

    description : String,
    image : {
        url : String,
        filename : String
    },
    price : Number,
    location : String,
    country : String,
    reviews : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Review"
    }],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    category: {
        type: String,
        enum:["trending","rooms","iconic cities", "mountains", "arctic", "castles", "amazing pools", "camping", "farms", "coastal", "nature"]
    },

});

listingSchema.post("findOneAndDelete", async (listing) => {
    let result = await Review.deleteMany({_id : {$in : listing.reviews}});
});

let Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;