const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

//need both MIDDLEWARE functions set up every time you create a server that is looking to accept POST data
  // parse incoming string or array data
  app.use(express.urlencoded({ extended: true })); //built in method; takes incoming POST data and converts it to key/value pairs that are accessed in req.body
  // parse incoming JSON data
  app.use(express.json()); //takes incoming POST data in the form of JSON and parses it into the req.body javascript object

  //middleware to create file path to CSS and JS files located in public folder to make static resources, with no specific server endpoint
  app.use(express.static('public'));

  
  // need this middlware to use the router we set up in apiRoutes
  app.use('/api', apiRoutes);
  app.use('/', htmlRoutes);

const { animals } = require( './data/animals')

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });