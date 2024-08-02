const Movie = require('../models/Movie.js');
const auth = require("../auth.js");
const { errorHandler } = auth;

module.exports.addMovie = async (req, res) => {
	const newMovie = new Movie({
		title: req.body.title,
		director: req.body.director,
		year: req.body.year,
		description: req.body.description,
		genre: req.body.genre
	})

	return newMovie.save()
		.then(movie => {
			return res.status(201).send(movie);
		})
		.catch((err) => errorHandler(err, req, res));
}


module.exports.getMovies = async (req, res) => {

	return await Movie.find()
		.then(movies => {
			if (!movies) {
				return res.status(404).send({ message: 'No movie found' });
			}

			return res.status(201).send({ movies: movies });
		})
		.catch((err) => errorHandler(err, req, res));
}

module.exports.getMovie = async (req, res) => {
	const { movieId } = req.params;

	console.log("movieId", movieId);

	return await Movie.findById(movieId)
		.then(movie => {
			if (!movie) {
				return res.status(400).send({ message: 'Movie not found' });
			}
			return res.status(200).send(movie);
		})
		.catch((err) => errorHandler(err, req, res));
}

module.exports.updateMovie = async (req, res) => {
	const { movieId } = req.params;

	console.log("movieId", movieId);

	return await Movie.findByIdAndUpdate(movieId, {
		title: req.body.title,
		director: req.body.director,
		year: req.body.year,
		description: req.body.description,
		genre: req.body.genre
	}, { new: true })
		.then(movie => {
			if (!movie) {
				return res.status(404).send({ message: 'Movie not found' })
			}
			return res.status(200).send({
				message: "Movie updated successfully",
				updatedMovie: movie
			})
		})
		.catch((err) => errorHandler(err, req, res));
}

module.exports.deleteMovie = async (req, res) => {
	const { movieId } = req.params

	console.log("movieId", movieId);

	return Movie.findByIdAndDelete(movieId)
		.then(movie => {
			return res.status(200).send({ message: "Movie deleted successfully" });
		})
		.catch((err) => errorHandler(err, req, res));
}

module.exports.addComment = async (req, res) => {
	const { movieId } = req.params;
	const userId = req.user.id;
	const comment = req.body.comment;

	if (!movieId || !userId || !comment) {
		return res.status(400).send({ message: "movie id, comment is required" });
	}

	return await Movie.findById(movieId)
		.then(movie => {
			if (!movie) {
				return res.status(404).send("Movie not found");
			}

			movie.comments.push({ userId, comment })

			return movie.save()
				.then(movie => {
					return res.status(200).send({ message: "comment added successfully", updatedMovie: movie });
				})
				.catch((err) => errorHandler(err, req, res));
		})
}

module.exports.getComments = (req, res) => {

	const { movieId } = req.params;

	console.log("Movie id", movieId);

	return Movie.findById(movieId)
		.then(movie => {
			if (!movie) {
				return res.status(404).send({ message: "comment not found" });
			}

			return res.status(200).send({
				comments: movie.comments
			})
		})
		.catch((err) => errorHandler(err, req, res));
}