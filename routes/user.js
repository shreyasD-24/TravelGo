const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl, isLoggedIn} = require("../middleware.js");

//New User Route
router.get("/signup", (req,res)=>{
    res.render("users/signupForm.ejs");
});

//Create User Route
router.post("/signup", wrapAsync(async (req, res, next)=>{
    try{
        let {username, email, password} = req.body;
        let newUser = new User({
        username, email
        });
        let registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err)=>{
            if(err){
                next(err);
            }  
            req.flash("success", "User Registered Successfully !");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/listings");
    }
}));


//Login Get Route
router.get("/login", (req,res)=>{
    res.render("users/loginForm.ejs");
});

//Login Read Route
router.post("/login",saveRedirectUrl ,passport.authenticate('local', { failureRedirect: '/login', failureFlash : true }), wrapAsync(async (req,res)=>{
    req.flash("success", "Welcome to TravelGo. You are logged in!")
    let redirect = res.locals.redirectUrl || "/listings"
    res.redirect(redirect);

}));

//Logout Route
router.get("/logout", (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Logged Out Successfully!");
        res.redirect("/listings");
    });
});

//Profile delete
router.delete("/deleteUser",isLoggedIn, wrapAsync(async (req,res)=>{
    res.locals.userId = req.user.id;
    req.logout((err)=>{
        if(err){
            return next(err);
        }
    })
    await User.findByIdAndDelete(res.locals.userId);
    req.flash("success", "Account Deleted Succefully !")
    res.redirect("/listings");

}))

module.exports = router;