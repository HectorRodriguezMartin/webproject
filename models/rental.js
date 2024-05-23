const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    movie_id: {
        type: String,
        ref: "Movie",
        required: true
    },
    user_id: {
        type: String,
        ref: "User",
        required: true
    },
    ini_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    }
});

const Rental = mongoose.model('Rental', rentalSchema);

module.exports = Rental;