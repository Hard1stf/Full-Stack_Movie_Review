
// Parse the current page URL for the movie id and title.
// We expect links to open movie.html?id=<movieId>&title=<encodedTitle>
const url = new URL(location.href);
const movieId = url.searchParams.get("id");
const movieTitle = url.searchParams.get("title");

// Backend endpoint base. We will call GET /api/v1/reviews/movie/:id
const API_BASE = 'http://127.0.0.1:8000/api/v1/reviews';

const main = document.getElementById('section');
const title = document.getElementById('title');

// decode the title for display (it was encoded when building the link)
title.innerText = movieTitle ? decodeURIComponent(movieTitle) : 'Unknown Title';

// Fetch reviews for this movieId and render them
// Note: the server returns an array of review documents for a movie (not data.results)
async function returnMovies() {
    if (!movieId) {
        main.innerHTML = '<p>No movie selected.</p>';
        return;
    }

    const urlToFetch = `${API_BASE}/movie/${encodeURIComponent(movieId)}`;
    try {
        const res = await fetch(urlToFetch);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json(); // server returns an array of reviews
        console.log('reviews:', data);

        main.innerHTML = ''; // clear before rendering.

        if (!Array.isArray(data) || data.length === 0) {
            main.innerHTML = '<p>No reviews yet for this movie.</p>';
            return;
        }

        const list = document.createElement('div');
        list.className = 'reviews-list';

        data.forEach(r => {
            const card = document.createElement('div');
            card.className = 'card review-card';

            const h = document.createElement('h4');
            h.textContent = r.user || 'Anonymous';

            const p = document.createElement('p');
            p.textContent = r.review || '';

            const meta = document.createElement('small');
            meta.textContent = `id: ${r._id ?? ''}`;

            card.appendChild(h);
            card.appendChild(p);
            card.appendChild(meta);

            list.appendChild(card);
        });

        main.appendChild(list);
    } catch (error) {
        console.error('Failed to load movies', error);
        main.innerHTML = '<p>Unable to load reviews. Try again later.</p>';
    }
}

returnMovies();