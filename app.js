// environment

  require("dotenv").config();

const MongoStore = require("connect-mongo");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError.js");

const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user.js");

const app = express();

// -------------------------------------------
// 1️⃣ DATABASE CONNECTION
// -------------------------------------------
async function main() {
  try {
    await mongoose.connect(process.env.DB);

    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.log("❌ MongoDB Connection Error:", err.message);
  }
}

main();

// -------------------------------------------
// 2️⃣ View Engine Setup
// -------------------------------------------
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// -------------------------------------------
// 3️⃣ Middleware
// -------------------------------------------
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// -------------------------------------------

const sessionOptions = {
  secret: process.env.SECRET || "mysuperSecretcode",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
      mongoUrl: process.env.DB, // replace with your DB
      ttl: 14 * 24 * 60 * 60, // 14 days (optional)
    }),
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// -------------------------------------------
// 5️⃣ Passport Authentication
// -------------------------------------------
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// -------------------------------------------
// 6️⃣ Flash + Current User Middleware
// -------------------------------------------
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
app.get("/",(req,res)=>{
  res.render("home.ejs")
})

// -------------------------------------------
// 7️⃣ Routes
// -------------------------------------------
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// -------------------------------------------
// 8️⃣ Error Handler
// -------------------------------------------
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error.ejs", { err });
});

// -------------------------------------------
// 9️⃣ Start Server
// -------------------------------------------
app.listen(8080, () => {
  console.log("🚀 Server running on http://localhost:8080");
});
