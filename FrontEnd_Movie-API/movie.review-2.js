
const url = new URL(location.href);
const movieId = url.searchParams.get('id');
const movieTitle = url.searchParams.get('title');

const API_BASE = `http://127.0.0.1:8000/api/v1/reviews`;

const main = document.getElementById('section');
const title = document.getElementById('title');


title.innerText = movieTitle ? decodeURIComponent(movieTitle) : 'Unknown Title';

const list = document.createElement('div');
        list.className = 'reviews-list';

// get the list of the review
const returnMovies = async () => {

    if (!movieId) return main.innerHTML = '<p>No Movie selected.</p>';

    const uriToFetch = `${API_BASE}/movie/${encodeURIComponent(movieId)}`;

    try {
        const res = await fetch(uriToFetch);
        // console.log(res.json());
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json(); // this will return you the list of Array.
        console.log('reviews', data);

        main.innerHTML = '';

        if (!Array.isArray(data) || data.length === 0) return main.innerHTML = '<p>No reviews yet fro this movie.</p>';


        data.forEach(review => {
            const card = document.createElement('div');
            card.className = 'review-card';

            card.innerHTML = `
                <div class="row">
                    <div class="column">
                        <div class="card" id="${review._id}">
                        <p><strong>User: </strong>${review.user}</p>
                        <p><strong>Review: </strong>${review.review}</p>
                            <p>
                                <a href="#" onclick="editReview('${review._id}','${review.review}','${review.user}')">📝</a>
                                <a href="#" onclick="deleteReview('${review._id}')">🗑️</a>
                            </p>
                        </div>
                    </div>
                </div>
                `

            list.appendChild(card);
        });

        main.appendChild(list);

    } catch (error) {
        console.error('Failed to load movies', error);
        main.innerHTML = '<p>Unable to load reviews. Try again later.</p>';
    }
}

// create a new review
const createNewReview = async () => {
    const createNewReview = document.createElement('div');
    createNewReview.className = 'new new-review'
    createNewReview.innerHTML = `
        <div class="row">
            <div class="column">
                <div class="card">
                New Review
                    <p><strong>User: </strong>
                        <input type="text" id="new-user" value="">
                    </p>
                    <p><strong>Review: </strong>
                        <input type="text" id="new-review" value="">
                    </p>
                    <p>
                    <a href="#" onclick="saveReview('new-review','new-user')">💾</a>
                    </p>
                </div>
            </div>
        </div>
    `;
    list.appendChild(createNewReview);
    main.appendChild(list);
}


// update the review
const editReview = async (reviewId, review, user) => {

    const selectedReviewCard = document.getElementById(reviewId);
    const reviewInputId = 'review' + reviewId;
    const userInputId = 'user' + reviewId;

    selectedReviewCard.innerHTML = `
        <p><strong>User: </strong>
        <input type="text" id="${userInputId}" value="${user}">
        </p>
        <p><strong>Review: </strong>
            <input type="text" id="${reviewInputId}" value="${review}">
        </p>
        <p>
        <a href="#" onclick="saveReview('${reviewInputId}','${userInputId}','${reviewId}')">💾</a>
        </p>
    `
}

// Save the updated review
const saveReview = async (reviewInputId, userInputId, reviewId='') => {

    const updatedReview = document.getElementById(reviewInputId).value;
    const updatedUser = document.getElementById(userInputId).value;

    if(reviewId){

        try {
    
            // Build the correct URL: API_BASE is the collection base, the route expects '/:id'
            const putURL = `${API_BASE}/${encodeURIComponent(reviewId)}`;
    
            const res = await fetch(putURL, {
                method: "PUT",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: updatedUser, review: updatedReview })
            });
    
            // Better error handling so failures are visible in console
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`HTTP ${res.status} ${text}`);
            }
    
            const data = await res.json();
            console.log('update response', data);
            // reload to show updated review
            location.reload();
        } catch (error) {
            console.error('Unable to update now, try again later.', error);
        }
    }else{

        try {
            const postURL = `${API_BASE}/new`;
            
            const res = await fetch(postURL, {
                method: "POST",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: updatedUser, review: updatedReview, movieId: movieId })
            });

            if(!res.ok) {
                const text = await res.text();
                throw new Error(`HTTP ${res.status} ${text}`);
            }

            const data = await res.json();
            console.log(`Create new review`, data);
            location.reload();
        } catch (error) {
            console.error(`Unable to create a new review, try again later.`, error);
        }
    }

}


// Delete a review by id
const deleteReview = async (reviewId) => {
    if (!confirm('Are you sure?')) return ;

    try {
        const deleteURL = `${API_BASE}/${encodeURLComponent(reviewId)}`;
        const res = await fetch(deleteURL, {method: 'DELETE'});

        if(!res.ok) {
            const text = await res.text();
            throw new Error(`HTTP ${res.status} ${text}`);
        }

        const data = await res.json();
        console.log(`delete response: ${data}`);
        location.reload();
    } catch (error) {
        console.error(`Unable to delete review`, error);
        alert('Unable to delete review. See console for details.');
    }
} 



returnMovies();