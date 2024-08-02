const express = require('express');
const movieController = require('../controllers/movie.js')

const { verify, isLoggedIn, verifyAdmin } = require("../auth.js");

const router = express.Router();

router.post('/addMovie', verify, movieController.addMovie);

router.get('/getMovies', movieController.getMovies);

router.get('/getMovie/:movieId', movieController.getMovie);

router.patch('/updateMovie/:movieId', verify, verifyAdmin, movieController.updateMovie);

router.delete('/deleteMovie/:movieId', verify, verifyAdmin, movieController.deleteMovie);

router.patch('/addComment/:movieId', verify, movieController.addComment);

router.get('/getComments/:movieId', verify, movieController.getComments);

module.exports = router;