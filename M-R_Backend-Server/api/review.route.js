import express from "express";
import ReviewsCtrl from './reviews.controller.js';

const router = express.Router();

// GET reviews for a movie (movieId is numeric)
router.route("/movie/:id").get(ReviewsCtrl.apiGetReviews);

// POST a new review
router.route("/new").post(ReviewsCtrl.apiPostReview);

// Operations on a single review by its _id
router.route("/:id")
    .get(ReviewsCtrl.apiGetReview) // get a single review by reviewId
    .put(ReviewsCtrl.apiUpdateReview) // update an existing review
    .delete(ReviewsCtrl.apiDeleteReview);


export const review = router;