const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    director: {
        type: String
    },
    year: {
        type: Number,
        required: true
    },
    country: {
        type: String
    },
    duration: {
        type: Number,
        required: true
    },
    genre: {
        type: String
    },
    moviePoster: {
        type: String,
    }
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;