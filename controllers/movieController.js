const connection = require("../data/db");

//^ Index --> Lista film
const index = (req, res) => {
  const movieSQL = "SELECT * FROM movies";
  connection.query(movieSQL, (err, results) => {
    if (err) {
      const responseData = {
        message: "Database query failed",
      };
      // se siamo in dev environment --> aggiungo una chiave error che aggiunge l'errore. Utile per testare senza poi farlo vedere all'utente
      if (process.env.APP_MODE === "dev") {
        responseData.error = err.message;
      }
      console.log(err.message);
      return res.status(500).json(responseData);
    }
    res.json(results);
  });
};

//^ Show --> Singolo film + Recensioni
const show = (req, res) => {
  const id = req.params.id;

  // Query 1 --> Recupero il film
  const movieSQL = "SELECT * FROM movies WHERE id = ?";
  connection.query(movieSQL, [id], (err, movieResults) => {
    if (movieResults.length === 0)
      return res.status(404).json({
        message: "Movie not found",
      });
    if (err)
      return res.status(500).json({
        message: "Database error",
      });

    const movie = movieResults[0];

    // Query 2 --> Recupero delle recensioni collegate al film
    const reviewsSql = "SELECT * FROM reviews WHERE movie_id = ?";
    connection.query(reviewsSql, [id], (err, reviewsResults) => {
      if (err)
        return res.status(500).json({
          error: "Database error",
        });

      // l'array delle recensioni all'oggetto movie
      movie.reviews = reviewsResults;

      res.json(movie);
    });
  });
};

module.exports = { index, show };
