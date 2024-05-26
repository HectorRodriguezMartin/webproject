const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const Movie = require("../models/movie");
const cors = require('cors');
const authCheck = require("../middleware/authenticationcheck");

router.use(cors());

router.get('/', async (req, res)=>{
    try{
        const movies = await Movie.find({})
        .select("title director year country duration genre moviePoster _id")
        const totalMovies = await Movie.countDocuments();

        const response = {
            total_movies: totalMovies,
            movies: movies
        };
        res.json(response);

    } catch(error) {
        res.status(500).json({msg: error.message});
    }

});

router.get('/:id', getMovie, (req, res)=>{
    res.send(res.movie)
});

router.post('/', authCheck, async (req, res)=>{
    
    const movie = new Movie({
        title: req.body.title,
        director: req.body.director,
        year: req.body.year,
        country: req.body.country,
        duration: req.body.duration,
        genre: req.body.genre,
        moviePoster: req.body.moviePoster
    })
    try{
        const newMovie = await movie.save();
        res.location(`${req.protocol}://${req.get('host')}${req.originalUrl}/${newMovie._id}`).json(newMovie);
    } catch (err){
        res.status(400).json({msg: err.message})
    }
    
});

router.put('/:id', authCheck, getMovie, async (req, res)=>{
    
    if(req.body.title != null){
        res.movie.title = req.body.title;
    }
    if(req.body.director != null){
        res.movie.director = req.body.director;
    }
    if(req.body.year != null){
        res.movie.year = req.body.year;
    }
    if(req.body.country != null){
        res.movie.country = req.body.country;
    }
    if(req.body.duration != null){
        res.movie.duration = req.body.duration;
    }
    if(req.body.genre != null){
        res.movie.genre = req.body.genre;
    }
    if(req.body.moviePoster != null){
        res.movie.moviePoster = req.body.moviePoster;
    }
    try{
        const updatedMovie = await res.movie.save();
        res.json(updatedMovie);
    }catch(err){
        res.status(500).json({msg: err.message});
    }
});


router.delete('/:id', authCheck, getMovie, async (req, res)=>{

    try{
        await res.movie.deleteOne();
        res.status(201).json({msg: 'The movie was deleted'});
    }catch(err){
        res.status(500).json({msg: err.message})
    }
});

async function getMovie(req, res, next) {
    let movie;
    try{
        movie = await Movie.findById(req.params.id)
        .select("title director year country duration genre moviePoster _id");
        if(movie == null){
            return res.status(404).json({msg: `Can not find the movie with id: ${req.params.id}`});
        }

    }catch(err){
        return res.status(500).json({msg: err.message});
    }
    res.movie = movie;
    next();
}

module.exports = router;
