import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });

//ROOT ROUTE

app.get("/", function (request, response) {
  response.json("Welcome To my Movie Review API");
});

//get all the movies with their detailes and tags

app.get("/movies", async function (request, response) {
  console.log("Request to /movies received");
  const result = await db.query(`
    SELECT
    movies.id,
    movies.title,
    movies.description,
    movies.category,
    movies.favorite,
    ARRAY_AGG(reviews.review) AS reviews
    FROM movies
    LEFT JOIN reviews ON movies.id = reviews.movie_id
    GROUP BY movies.id, movies.title, movies.description, movies.category, movies.favorite`);

  const movies = result.rows;

  response.json(movies);
});

//add new movie

app.post("/movies", async function (request, response) {
  const { title, description, category } = request.body;

  const result = await db.query(
    `
    INSERT INTO movies (title, description, category)
    VALUES ($1, $2, #3)
    RETURNING *
    `,
    [title, description, category]
  );

  const newMovie = result.rows[0];
  response.json(newmovie);
});

//add review to a movie

app.post("/movies/:id/revies", async function (request, response) {
  const { id } = request.params;
  const { review } = request.body;

  const result = await db.query(
    `
    INSERT INTO reviews (movie_id, review)
    VALUES ( $1, $2)
    RETURNING *
    `,
    [id, review]
  );

  const newReview = result.rows[0];
  response.json(newReview);
});

//toggle favourite status of a movie

app.post("/movies/:id/favorite", async function (request, response) {
  const { id } = request.params;

  const result = await db.query(
    `
    UPDATE movies
    SET favorite = NOT favorite
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  const updateMovie = result.rows[0];
  response.json(updateMovie);
});

//SERVER LISTENING ON PORT 8080
app.listen(8080, () => console.log("App is running on port 8080"));
