import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId

let reviews;

export default class ReviewDAO {
    static async injectDB(conn) {
        if (reviews) return;
        try {
            reviews = await conn.db("reviews").collection("reviews");
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
            if (!ObjectId.isValid(reviewId)) return null;
            return await reviews.findOne({ _id: new ObjectId(reviewId) });
        } catch (error) {
            console.error(`Unable to get review: ${error}`);
            return { error };
        }
    }

    static async updateReview(reviewId, user, review) {
        try {
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