const express = require("express");
const router = express.Router( {mergeParams:true});
const {  reviewSchema } = require("../schema.js");
const Listing = require("../model/listing.js");
const Review = require("../model/review.js");
const wrapAsync = require("../utils/wrapAsyc.js");
const {validateReview,isLogedIn, isReviewAuthor}=require("../middleware.js")
// constroller
const reviewController=require("../controller/review.js");

router.post("/:id/reviews", isLogedIn,validateReview, wrapAsync(reviewController.createReview));

// Delete review
router.delete("/:id/reviews/:reviewId",isLogedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;
