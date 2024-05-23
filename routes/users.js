const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwebtoken = require("jsonwebtoken");

const User = require("../models/user");
const cors = require('cors');
router.use(cors());

router.post("/signup", (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409 /*Conflict*/).json({ msg: "The user already exists" });
            } else {
                bcrypt.hash(req.body.password, 10, (error, hash) => {  //10 is for salting
                    if (error) {
                        return res.status(500).json({ error: error });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            role: req.body.role || 'user'  // Default role is 'user'
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({ msg: "User created successfully" })
                            })
                            .catch(err => {
                                res.status(500).json({ error: err })
                            })
                    }
                })
            }
        })
});

router.post("/login", (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({ msg: "Authentication failed" })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({ msg: "Authentication failed" })
                }
                if (result) {
                    const token = jwebtoken.sign(
                        { email: user[0].email, _id: user[0]._id, role: user[0].role },
                        process.env.JWEBTOKEN_KEY,
                        {}
                    );
                    return res.status(200).json({
                        msg: "Correct authentication",
                        token: token,
                        _id: user[0]._id,
                        email: user[0].email,
                        role: user[0].role
                    });
                }
                res.status(401).json({ msg: "Authentication failed" });
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })
});


router.delete("/:id", (req, res)=> {
    User.deleteOne()
        .exec()
        .then(
            res.status(200).json({ msg: `User with id: ${req.params.id} deleted succesfully`})
        )
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        })
})

module.exports = router;

