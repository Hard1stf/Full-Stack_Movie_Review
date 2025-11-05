

const API_LINK = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=03b0e5690181c33b493a7ede4fc3e50c&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?&api_key=03b0e5690181c33b493a7ede4fc3e50c&query=';

const main = document.getElementById('section');
const form = document.getElementById('form');
const search = document.getElementById('query');

async function returnMovies(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log(data.results);

        main.innerHTML = ''; //clear before rendering.

        const div_row = document.createElement('div');
        div_row.className = 'row';

        const frag = document.createDocumentFragment();

        data.results.forEach(movie => {
            const column = document.createElement('div');
            column.className = 'column';

            const card = document.createElement('div');
            card.className = 'card';

            const img = document.createElement('img');
            img.className = 'thumbnail';
            img.alt = movie.title || 'movie poster';
            img.src = movie.poster_path ? (IMG_PATH + movie.poster_path) : `../assets/sample-img.jpg`;


            const title = document.createElement('h3');
            title.className = 'movie-title';
            // encode the title and use & between query params
            // Explanation: the original code used `$title=` which produced a broken
            // query string and made `movie.html` read undefined for `title`.
            // encodeURIComponent ensures special characters/spaces in the title
            // don't break the URL. We also use '&' to separate query params.
            const safeTitle = encodeURIComponent(movie.title || '');
            title.innerHTML = `${movie.title || 'Undefined'}<br>
                            <a href="movie.html?id=${movie.id}&title=${safeTitle}">reviews</a>`;

            card.appendChild(img);
            card.appendChild(title);
            column.appendChild(card);
            frag.appendChild(column);
        });

        div_row.appendChild(frag);
        main.appendChild(div_row);
    } catch (error) {
        console.error('Failed to load movies', error);
        main.innerHTML = '<p>Unable to load movies. Try again Later.</p>';
    }
}

returnMovies(API_LINK);

form.addEventListener('submit', e => {
    e.preventDefault();
    const searchItem = search.value.trim();
    if (searchItem) {
        returnMovies(SEARCH_API + encodeURIComponent(searchItem));
        search.value = '';
    }
});
