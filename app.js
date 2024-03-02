if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const Listing = require('./models/listing.js');         //Mongoose(MongoDB) Model
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");                        //For Layouts
const wrapAsync = require("./utils/wrapAsync.js");               //wrapAsync Func. for Async Functions
const ExpressError = require("./utils/ExpressError.js");                 //Custom class for Error Handling
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

let dbUrl = process.env.ATLASDB_URL;


const store = MongoStore.create({
  mongoUrl : dbUrl,
  touchAfter: 24*3600,
  crypto: {
    secret: process.env.SESSION_SECRET
  }
});

const sessionOptions = {
  store,
  secret : process.env.SESSION_SECRET,
  resave : false,
  saveUninitialized : true,
  cookie : { 
    expires : Date.now() + 2*24*60*60*1000,
    maxAge : 2*24*60*60*1000,
    httpOnly : true
  }
};



/*
const {listingSchema} = require("./schema.js");    
const {reviewSchema} = require("./schema.js");            Used in corresponding router in Routes folder
const Review = require("./models/review.js");
*/


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


app.engine('ejs', ejsMate);

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


async function dbConnect(){
  await mongoose.connect(dbUrl);
}

dbConnect()
  .catch(err => console.log(err));


app.listen(8080,()=>{
  console.log("app is listening");
});


//Root route
app.get('/', (req, res) => {
  res.redirect('/listings');
});



// app.get("/demoUser", async (req,res)=>{
//   let fakeUser = new User({
//     email : "abc@gmail.com",
//     username : "user123"
//   });

//   let registeredUser = await User.register(fakeUser, "helloWorld");
//   res.send(registeredUser);
// });

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


app.use("/listings/:id/reviews", reviewRouter);
app.use("/listings", listingRouter);
app.use("/", userRouter);


//Error Handling
app.all("*",(req,res,next) => {
  next(new ExpressError(404,"Page not Found"));
});

app.use((err,req,res,next)=>{
  let {status=500,name , message="Something went wrong"} = err;
  res.status(status).render("error.ejs",{message,name});
});