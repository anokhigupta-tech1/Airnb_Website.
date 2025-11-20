const express = require("express");
const router = express.Router();
const { reviewSchema } = require("../schema.js");
const Listing = require("../model/listing.js");
const Review = require("../model/review.js");
const wrapAsync = require("../utils/wrapAsyc.js"); // Note: Check for typo in filename (wrapAsync.js?)

// controllers
const listingController = require("../controller/listing.js");

// image upload
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage:storage})


// middleware to check login
const {
  isLogedIn,
  isOwner,
  validateListing,
  isReviewAuthor,
} = require("../middleware.js");

// ✅ Validate Review
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

// compact  / request code
router
  .route("/")
  .get(wrapAsync(listingController.index))

  .post(isLogedIn,
    upload.single("listing[image]"),
    validateListing,
     wrapAsync(listingController.addNew));
 


// ✅ Create form page (must come before :id)
router.get("/create", isLogedIn, listingController.newRender);

// compact :/id request code
router
  .route("/:id")
  .get(wrapAsync(listingController.showOne))
  .put(
    isLogedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.UpdateListing)
  )
  .delete(isLogedIn, isOwner, wrapAsync(listingController.deleteListing));

// ✅ Edit form (must come before :id)
router.get(
  "/:id/edit",
  isLogedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

// ✅ Add Review
router.post(
  "/:id/reviews",
  validateReview,
  isLogedIn,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    let UserId = req.user._id;
    console.log(UserId);
    newReview.author = UserId;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review added!");
    res.redirect(`/listings/${listing._id}`);
  })
);

// ✅ Delete Review
router.delete(
  "/:id/reviews/:reviewId",
  isLogedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
