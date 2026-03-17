const connection = require("../database/db");
const { getFullImageUrl } = require("../utils/utilities");
const { handleDbError } = require("../utils/utilities");

//^ Index --> Lista film
const index = (req, res) => {
  const movieSQL = "SELECT * FROM movies";
  connection.query(movieSQL, (err, results) => {
    if (handleDbError(res, err)) return;

    // map  dei risultati per aggiungere l'URL completo alle immagini
    const movies = results.map((movie) => ({
      ...movie,
      image: getFullImageUrl(req, movie.image),
    }));
    res.json(movies);
  });
};

//^ Show --> Singolo film + Recensioni
const show = (req, res) => {
  const id = req.params.id;

  // Query 1 --> Recupero il film
  const movieSQL = "SELECT * FROM movies WHERE id = ?";
  connection.query(movieSQL, [id], (err, movieResults) => {
    if (handleDbError(res, err)) return;
    if (movieResults.length === 0)
      return res.status(404).json({
        message: "Movie not found",
      });

    const movie = movieResults[0];

    // Path immagine (es. localhost:3000/img/inception.jpg)
    movie.image = getFullImageUrl(req, movie.image);

    // Query 2 --> Recupero delle recensioni collegate al film
    const reviewsSql = "SELECT * FROM reviews WHERE movie_id = ?";
    connection.query(reviewsSql, [id], (err, reviewsResults) => {
      if (handleDbError(res, err)) return;

      // l'array delle recensioni all'oggetto movie
      movie.reviews = reviewsResults;

      res.json(movie);
    });
  });
};

module.exports = { index, show };
