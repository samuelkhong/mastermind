const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const connectDB = require('./config/database');
const flash = require("express-flash");
const logger = require("morgan");

const homeRoutes = require('./routes/home');
const authenticateRoutes = require('./routes/authenticate')
const gameRoutes = require('./routes/gameRoute')

// used to access .env file
require('dotenv').config({path: './config/.env'});

// Passport config  
require("./config/passport")(passport);

// Setup Sessions - stored in MongoDB
const sessionStore = MongoStore.create({
  mongoUrl: process.env.DB_STRING, 
  mongooseConnection: mongoose.connection,
  collectionName: 'sessions', 
});

// // connect to db
connectDB()

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: 'linkedin challenge',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

// use connect-flash middleware 
app.use(flash());


// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// set viewing engine to ejs
app.set('view engine', 'ejs');

//static folder
app.use(express.static('public'));

//body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));


// setup routes server is listening to
app.use('/', homeRoutes);
app.use('/game', gameRoutes )
app.use('/authenticate', authenticateRoutes );

//  check if connected to DB before starting our server
mongoose.connection.once('open', () => {
  console.log("Connected to MongoDB");
  app.listen(process.env.PORT, () => {
    console.log(`Yo da Server is running on port ${process.env.PORT}`);
  });
});

