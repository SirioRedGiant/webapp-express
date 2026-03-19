const connection = require("../database/db");
const {
  getFullImageUrl,
  validateReview,
  handleDbError,
} = require("../utils/utilities");

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

//^ StoreReview - Salva/Aggiunge una nuova recensione
const storeReview = (req, res) => {
  const { id } = req.params; // l'ID del film daell'URL --> movie_id perchè riguarda il film specifico

  //note controllo dati ricevuti validateReview --> utility function se non li passa entra in validationError
  const validationError = validateReview(req.body);
  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }

  const { name, vote, text } = req.body; // i dati dal form per React.. il body della richiesta

  // Query SQL
  const storeReviewSql =
    "INSERT INTO reviews (movie_id, name, vote, text) VALUES (?, ?, ?, ?)";

  connection.query(storeReviewSql, [id, name, vote, text], (err, results) => {
    if (handleDbError(res, err)) return;

    res.status(201).json({
      message: "Review added",
      id: results.insertId,
    });
  });
};
module.exports = { index, show, storeReview };
