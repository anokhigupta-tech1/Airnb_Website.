const Listing = require("./model/listing");
const Review=require("./model/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");
module.exports.isLogedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // redirect
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must login first to create listings");
    return res.redirect("/login");
  }
  next();
};

// saveRedirects
module.exports.saveRedirect = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// check Owner
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not the owner of this listings");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
//  validate Listing
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body.listings);
  if (error) {
    const errMsg = error.details.map((e) => e.message).join(",");
    console.log(errMsg); // Now reachable
    throw new ExpressError(400, errMsg);
  }
  next();
};

// validate Review

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  // Review not found
  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  // Compare ObjectId directly
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
