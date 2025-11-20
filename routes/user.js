const express = require("express");
const router = express.Router();
const User = require("../model/user.js");
const wrapAsyc = require("../utils/wrapAsyc.js");
const passport = require("passport");
const { saveRedirect } = require("../middleware.js");

// v=controller
const userController = require("../controller/user.js");

// combine /sigup routes
router
  .route("/signup")
  .get((req, res) => {
    res.render("users/signup.ejs");
  })
  .post(wrapAsyc(userController.signUp));

// login user combine

router
  .route("/login")
  .get(userController.loginForm)
  .post(
    saveRedirect,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    async (req, res) => {
      req.flash("success", "welcome back to Wanderlust");
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
    }
  );

// logout
router.get("/logout", userController.logout);

module.exports = router;
