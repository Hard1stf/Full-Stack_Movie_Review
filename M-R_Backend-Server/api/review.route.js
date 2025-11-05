import express from "express";
import ReviewsCtrl from './reviews.controller.js';

const router = express.Router();

// Route mapping notes:
// GET  /movie/:id   -> returns all reviews for the numeric movieId (controller: apiGetReviews)
// POST /new        -> create a new review (controller: apiPostReview)
// GET  /:id        -> returns a single review by its MongoDB _id (controller: apiGetReview)
// PUT  /:id        -> update a review by _id (controller: apiUpdateReview)
// DELETE /:id      -> delete a review by _id (controller: apiDeleteReview)
// Important: distinguishing /movie/:id (movieId) from /:id (review _id) prevents mixing the two
// types of identifiers and avoids the bug where a review _id was treated as a movieId.
router.route("/movie/:id").get(ReviewsCtrl.apiGetReviews);
router.route("/new").post(ReviewsCtrl.apiPostReview);
router.route("/:id")
    .get(ReviewsCtrl.apiGetReview)
    .put(ReviewsCtrl.apiUpdateReview)
    .delete(ReviewsCtrl.apiDeleteReview);


export const review = router;