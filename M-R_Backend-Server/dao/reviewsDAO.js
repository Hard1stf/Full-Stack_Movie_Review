import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId

let reviews;

export default class ReviewDAO {
    static async injectDB(conn) {
        if (reviews) return;
        try {
            reviews = await conn.db("movie-reviews").collection("reviews");
        } catch (error) {
            console.error(`Unable to establish collection handles in userDAO: ${error}`);
        }
    }


    static async addReview(movieId, user, review) {
        try {
            const reviewDoc = {
                movieId: movieId,
                user: user,
                review: review,
            }

            return await reviews.insertOne(reviewDoc);
        } catch (error) {
            console.error(`Unable to post review: ${error}`);
            return { error };
        }
    }

    static async getReview(reviewId) {
        try {
            // Validate the id before constructing ObjectId to avoid runtime errors.
            // ObjectId.isValid prevents trying to create a new ObjectId from an invalid string.
            if (!ObjectId.isValid(reviewId)) return null;
            // Use `new ObjectId(...)` because ObjectId is a class in the current driver.
            return await reviews.findOne({ _id: new ObjectId(reviewId) });
        } catch (error) {
            console.error(`Unable to get review: ${error}`);
            return { error };
        }
    }

    static async updateReview(reviewId, user, review) {
        try {
            // Validate and construct ObjectId for the update query.
            if (!ObjectId.isValid(reviewId)) return { error: 'invalid id' };
            const updateResponse = await reviews.updateOne(
                { _id: new ObjectId(reviewId) },
                { $set: { user: user, review: review } }
            )

            return updateResponse;
        } catch (error) {
            console.error(`Unable to update review: ${error}`);
            return { error };
        }
    }

    static async deleteReview(reviewId) {
        try {
            // Same validation for delete: return helpful error if id is invalid.
            if (!ObjectId.isValid(reviewId)) return { error: 'invalid id' };
            const deleteResponse = await reviews.deleteOne({
                _id: new ObjectId(reviewId)
            });

            return deleteResponse;
        } catch (error) {
            console.error(`Unable to delete review: ${error}`);
            return { error };
        }
    }

    static async getReviewsByMovieId(movieId) {
        try {
            // movieId in the database is stored as a number. To ensure the
            // query matches, parse the incoming movieId to an integer.
            // This avoids type mismatch where '12' (string) wouldn't match 12 (number).
            const cursor = await reviews.find({ movieId: parseInt(movieId) });
            // console.log(cursor);
            return cursor.toArray();
        } catch (error) {
            console.error(`Unable to get the review: ${error}`);
            return { error };
        }
    }
}

// curl -X POST http://127.0.0.1:8000/api/v1/reviews/new -H "Content-Type: application/json" -d '{"movieId": 12,"user": "beau", "review": "good"}'
// curl -X GET http://127.0.0.1:8000/api/v1/reviews/690a38da024a59ced8f46aac