
const url = new URL(location.href);
const movieId = url.searchParams.get('id');
const movieTitle = url.searchParams.get('title');

const API_BASE = `http://127.0.0.1:8000/api/v1/reviews`;

const main = document.getElementById('section');
const title = document.getElementById('title');


title.innerText = movieTitle ? decodeURIComponent(movieTitle) : 'Unknown Title';


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

        const list = document.createElement('div');
        list.className = 'reviews-list';
        
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
                                <a href="#" onclick="editReview('${review._id}','${review.review}','${review.user}')">✏️</a>
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


    
    
    returnMovies();