require("dotenv").config();
const functions = require("firebase-functions");

const express = require("express");
const sslRedirect = require('heroku-ssl-redirect');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

mongoose.connect(process.env.MONGO_URL).catch(err => {
    console.log('Error in connection');
    console.log(err);
});

app.use(sslRedirect());
app.use(cors({
    origin: 'https://apimovies-30d7a75d93fe.herokuapp.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads',express.static("uploads"));

const moviesRouter = require("./routes/movies");
const rentalsRouter = require("./routes/rentals");
const userRouter = require("./routes/users");

app.use("/movies", moviesRouter);
app.use("/rentals", rentalsRouter);
app.use("/users", userRouter);

app.listen(process.env.PORT, '0.0.0.0' , () => {
    console.log(`Server listens at http://localhost:${process.env.PORT}`);
});

exports.api = functions.https.onRequest(app);