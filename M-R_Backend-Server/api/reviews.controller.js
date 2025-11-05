import ReviewDAO from '../dao/reviewsDAO.js';

export default class ReviewsController {

    // post controller logic: post/create new reviews
    static async apiPostReview(req, res, next) {
        try {
            // Ensure movieId is stored as a number; this keeps DAO queries predictable
            const movieId = parseInt(req.body.movieId);
            const review = req.body.review;
            const user = req.body.user;

            const reviewResponse = await ReviewDAO.addReview(
                movieId,
                user,
                review
            )
            // Log DAO response (contains insertedId) and return insertedId to client
            // so the front-end or caller can reference the newly created review.
            console.log(reviewResponse);
            res.json({ status: 'success', insertedId: reviewResponse.insertedId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // get controller logic: get the review based on the review-id
    static async apiGetReview(req, res, next) {
        try {
            let id = req.params.id || {};
            // Expect a MongoDB _id here; DAO will validate and convert it.
            let review = await ReviewDAO.getReview(id);
            if (!review) return res.status(404).json({ error: 'not found' });
            res.json(review);
        } catch (error) {
            console.log(`api: ${error}`);
            res.status(500).json({ error: error.message });
        }
    }

    // put controller logic: update the existing review
    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.params.id;
            const review = req.body.review;
            const user = req.body.user;

            // Update by review _id. DAO validates the id and returns update result
            const reviewResponse = await ReviewDAO.updateReview(
                reviewId,
                user,
                review
            )

            let { error } = reviewResponse;
            if (error) {
                res.status(400).json({ error });
            }

            if (reviewResponse.modifiedCount === 0) {
                throw new Error('Unable to update review.');
            }

            res.json({ status: 'success' })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // delete controller logic: delete the review based on the reviewId
    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.params.id;
            const reviewResponse = await ReviewDAO.deleteReview(reviewId)
            res.json({ status: 'success' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // get the list of all reviews controller logic: get all the reviews of the specific movie and there movieId
    static async apiGetReviews(req, res, next) {
        try {
            let id = req.params.id || {};
            // This endpoint returns an array of reviews for a numeric movieId.
            // The DAO will do parseInt(movieId) and return an array (possibly empty).
            let reviews = await ReviewDAO.getReviewsByMovieId(id);

            if (!reviews) return res.status(404).json({ error: "Not found" });

            res.json(reviews);
        } catch (error) {
            console.log(`api: ${error}`);
            res.status(500).json({ error: error });
        }
    }
}