const express = require("express");
const router = express.Router();
const Rental = require("../models/rental");
const Movie = require("../models/movie");
const cors = require('cors');
const { default: mongoose } = require("mongoose");
const authCheck = require("../middleware/authenticationcheck");

router.use(cors());

router.get('/', authCheck, async (req, res)=>{
    const userId = req.userData._id;
    try{
        Rental.find({ user_id: userId })
        .select("movie_id ini_date end_date _id")
        .populate("movie_id")
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                rentals: docs
            })
        })

    } catch(error) {
        res.status(500).json({msg: error.message});
    }

});

router.get('/:id', authCheck, getRental, (req, res)=>{
    res.send(res.rental)
});

router.post('/', authCheck, async (req, res) => {
    try {
        const movie = await Movie.findById(req.body.movie_id);
        if (!movie) {
            return res.status(404).json({ msg: "movie_id does not exist" });
        }

        const ini_date = new Date();
        const end_date = new Date(ini_date);
        end_date.setDate(end_date.getDate() + 7);

        const rental = new Rental({
            movie_id: req.body.movie_id,
            user_id: req.userData._id,
            ini_date: ini_date,
            end_date: end_date
        });

        const newRental = await rental.save();
        res.location(`${req.protocol}://${req.get('host')}${req.originalUrl}/${newRental._id}`).json(newRental);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});


async function getRental(req, res, next) {
    let rental;
    try{
        rental = await Rental.findById({ _id: req.params.id, user_id: req.userData._id })
        .select("movie_id user_id ini_date end_date")
        if(rental == null){
            return res.status(404).json({msg: `Can not find the rental with id: ${req.params.id}`});
        }

    }catch(err){
        return res.status(500).json({msg: err.message});
    }
    res.rental = rental;
    next();
}


module.exports = router;