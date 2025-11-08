# Full-Stack Movie Review Site

A small full-stack project that displays movies (via TheMovieDB API) and lets users post, read, update and delete reviews stored in MongoDB.

This repository contains:

- Front-end (static files) in `FrontEnd_Movie-API/`
  - `index.html`, `movie.html` — UI pages
  - `script.js`, `movie.js`, `movie.review-2.js` — front-end JavaScript
  - `style.css`
- Back-end (Express + MongoDB) in `M-R_Backend-Server/`
  - `index.js`, `server.js` — server bootstrap and app
  - `api/` — route and controller logic
    - `review.route.js` — reviews routes
    - `reviews.controller.js` — controller methods
  - `dao/` — database access objects
    - `reviewsDAO.js` — Mongo queries for reviews
  - `.env` — environment variables used locally (not committed)

This README explains how to set up, run, and test the project locally, plus notes on troubleshooting and improvements.

---

## Quick summary

- Front-end fetches movie listings from TMDB (client-side) and links to a movie page that queries the backend for reviews.
- Backend exposes a small REST API backed by MongoDB to create/read/update/delete reviews.

---

## Prerequisites

- Node.js (recommended v18+)
- npm (comes with Node)
- A MongoDB deployment (MongoDB Atlas recommended) and credentials
- (Optional) A static server for the front-end (or VS Code Live Server)

---

## Backend: Setup & run

1. Open a terminal in `M-R_Backend-Server/` and install dependencies:

```bash
cd M-R_Backend-Server
npm install
```

2. Create a `.env` file in `M-R_Backend-Server/` with the following environment variables (example):

```
MONGO_USERNAME=movie-review_db_user
MONGO_PASSWORD=YourMongoPasswordHere
# Optional (if code expects other vars): MONGO_DB=Movie_Review_DB
# PORT=8000 (optional)
```

3. Start the backend:

```bash
npm start
# or to run directly
node index.js
```

The server listens on port `8000` by default.

Notes about the MongoDB connection:

- The code uses a MongoDB connection string of the form `mongodb+srv://<username>:<password>@cluster0.bpoovu9.mongodb.net/<db>?retryWrites=true&w=majority`.
- If your password contains special characters, URL-encode it (e.g. `encodeURIComponent`) or wrap appropriately in `.env` and the code will URL-encode it if updated.
- Ensure your Atlas cluster network access allows your IP (or `0.0.0.0/0` for testing) and that SRV DNS lookups are allowed on your network.

Troubleshooting common Mongo errors:

- `MongoParseError: mongodb+srv URI cannot have port number` — Make sure you are using `mongodb+srv://...` without specifying a port.
- TLS/SSL handshake errors — check network/firewall/proxy; try connecting from another network or use MongoDB Compass to verify connectivity.

---

## Frontend: Run & test locally

The front-end is plain static HTML/JS/CSS in `FrontEnd_Movie-API/`.

To serve it locally (recommended) you can use a static server, for example:

```bash
# from your repo root or the FrontEnd_Movie-API folder
npx serve FrontEnd_Movie-API
# or if you prefer http-server
npx http-server FrontEnd_Movie-API -p 3000
```

Or use VS Code Live Server from the folder.

Important: the front-end contacts the backend at `http://127.0.0.1:8000/api/v1/reviews` by default. Make sure the backend is running and accessible from your browser.

Security note: the front-end currently contains a TMDB API key in the `script.js` file. This is for learning/demo purposes only — do not commit or expose API keys in public repos. Move API calls server-side for production.

---

## API endpoints

Base: `http://127.0.0.1:8000/api/v1/reviews`

Available endpoints (examples):

- Create a review (POST)

  - URL: `/new`
  - Example (curl):
    ```bash
    curl -X POST http://127.0.0.1:8000/api/v1/reviews/new \
      -H "Content-Type: application/json" \
      -d '{"movieId": 12, "user": "beau", "review": "good"}'
    ```
  - Response: `{ status: 'success', insertedId: '...' }`

- Get all reviews for a movie (GET)

  - URL: `/movie/:movieId` — `movieId` is the numeric ID used by the front-end
  - Example:
    ```bash
    curl http://127.0.0.1:8000/api/v1/reviews/movie/12
    ```
  - Response: JSON array of review documents `[{ _id, movieId, user, review }, ...]`

- Get a single review by its MongoDB `_id` (GET)

  - URL: `/:id`
  - Example:
    ```bash
    curl http://127.0.0.1:8000/api/v1/reviews/690a38da024a59ced8f46aac
    ```

- Update a review (PUT)

  - URL: `/:id`
  - Example:
    ```bash
    curl -X PUT http://127.0.0.1:8000/api/v1/reviews/<id> \
      -H "Content-Type: application/json" \
      -d '{"user": "newname", "review": "updated text"}'
    ```

- Delete a review (DELETE)
  - URL: `/:id`
  - Example:
    ```bash
    curl -X DELETE http://127.0.0.1:8000/api/v1/reviews/<id>
    ```

---

## Notes on code and fixes applied

During development several small fixes and improvements were made. Highlights:

- Route mapping corrected so `/movie/:id` returns reviews for a numeric `movieId` and `/:id` returns a single review by its MongoDB `_id`.
- Controller fixes: return `insertedId` on POST; parse `movieId` as number on create to avoid type mismatches.
- DAO improvements: validate `_id` with `ObjectId.isValid(...)` and construct `new ObjectId(id)` to prevent runtime `Class constructor ObjectId cannot be invoked without 'new'` errors.
- Front-end fixes:
  - The movie list link was corrected to use `movie.html?id=<id>&title=<encodedTitle>` and `encodeURIComponent` to avoid broken URLs.
  - The movie detail page now calls `/movie/:id` and expects an array response, rendering reviews safely.
  - Edit/save UI was fixed: PUT/DELETE now call the correct `/api/v1/reviews/:id` endpoints and show errors in the console.

These changes make the app's frontend and backend contract consistent.

---

## Development tips & troubleshooting

- If you get TypeScript / editor warnings referencing `node_modules` package tsconfigs (e.g. `Cannot find type definition file for 'node'`), install dev types locally:

```bash
cd M-R_Backend-Server
npm install --save-dev @types/node
```

- If the server errors on Mongo connection:

  - Verify env variables and connection string.
  - Make sure the Atlas cluster allows your IP address.
  - Try connecting with MongoDB Compass from the same machine.

- If the front-end fetches return `404`, verify the backend routes and base URL (the front-end expects `http://127.0.0.1:8000` by default).

- Node version: use a current LTS (v18+). Older Node builds may not support some modern ES module behaviors.

---

## Suggested next steps / improvements

- Move TMDB API calls to the backend to hide the API key.
- Add input validation and sanitization for review fields.
- Add pagination for reviews when there are many.
- Add basic authentication so users can only edit/delete their own reviews.
- Add automated tests (Jest / supertest) for the API.
- Improve front-end UX (inline edit without reload, form to post a new review from movie page, success toasts).

---

## Contribution

If you want to contribute, please fork the repo, create a feature branch, and open a pull request with a clear description of changes and rationale.

---

## License

This project is provided as-is for learning purposes. Add an appropriate open-source license when you publish.

