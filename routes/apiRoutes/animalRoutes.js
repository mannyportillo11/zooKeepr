const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');

//Allows you to declare routes with proper middlware/ need to change all app.get's and app.post's to router.get
const router = require('express').Router();

//migrated from server.js

//changed app.get to route.get and removed api from '/animals' since router will automatically append '/api'
router.get('/animals', (req, res) => {
    let results =  animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

router.get('/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
 
  //return error message if no id
  if (result) {
    res.json(result);
  } else {
    res.send(404); // error message, standard format
  }
});

router.post('/animals', (req, res) => {

  //set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  // if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
    res.status(400).send('The animal is not properly formatted.');
  } else {
    //add animals to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);
    
    //req.body is where our incoming content will be
    res.json(animal); //use res.json to send the data back to the client
  }
});

module.exports = router;