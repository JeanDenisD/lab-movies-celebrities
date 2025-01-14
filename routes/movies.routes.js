// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();
const Celebrity = require("../models/Celebrity.model")
const Movie = require("../models/Movie.model")

// all your routes here

// GET route to display the form for new movie => Show a form to create a movie
router.get('/movies/create', (req, res) => {
    Celebrity.find()
    .then(celebritiesArr=>{
        console.log(celebritiesArr)
        res.render('movies/new-movie',{celebrities: celebritiesArr})
    })
    .catch(err=>{
        console.log("Error get celebritiesArr from DB",err)
        res.redirect("/movies/create")

        next(err);
    })
});


//POST: create the new movie into the DB
router.post("/movies/create", (req, res, next)=>{
    const newMovie = {
        title :req.body.title,
        genre: req.body.genre,
        plot: req.body.plot,
        cast: req.body.cast
    }

    Movie.create(newMovie)
    .then(newMovie=>{
        console.log("Movie create into the DB as: ", newMovie.title);
        res.redirect("/movies")
    })
    .catch(err=>{
        console.log("Error creating movie in the DB",err)
        res.redirect("/movies/create")
        next(err);
    })
})


// Show all movies from the DB
router.get("/movies", (req, res, next)=>{
    Movie.find()
    .populate("cast")
        .then(moviesList=>{
            console.log(moviesList);
            res.render("movies/movies",{movies: moviesList})
        })
        .catch(err=>{
            console.log("Error getting the movies list from the DB",err);
            next(err)
        })
})

//See movies details routes
router.get("/movies/:moviesId", (req, res, next) => {
    const id = req.params.moviesId;

    Movie.findById(id)
        .populate("cast")
        .then((movieDetails) => {
            console.log(movieDetails);
            res.render("movies/movie-details", {movie: movieDetails});
        })
        .catch(err => {
            console.log("error getting details of movie from DB", err)
            next(err);
        });
})

// DELETE.
router.post("/:moviesId/delete", (req, res, next) => {
    const id = req.params.bookId;
    Movie.findByIdAndRemove(id)
        .then(response => {
            res.redirect("/movies");
        })
        .catch(err => {
            console.log("error deleting movie from DB", err);
            next(err);
        });
});



module.exports = router;