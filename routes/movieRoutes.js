const express = require('express');
const movieController = require('../controllers/movieController');
const authController = require('../controllers/authController');
const router = express.Router();
// router.param('id',movieController.checkId);
router.route('/top-rated').get(movieController.getTopRatedMovies,movieController.getAllMovies);
router.route('/movie-stats').get(movieController.getMovieStats);
router.route('/movies-by-genre/:genre?').get(movieController.getMovieByGenre);
router.route('/')
    .get(authController.protect,movieController.getAllMovies)
    .post(movieController.createMovie);

router.route('/:id')
    .get(authController.protect,movieController.getMovie)
    .patch(movieController.updateMovie)
    .delete(movieController.deleteMovie);

module.exports = router;