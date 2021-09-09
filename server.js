const fs = require('fs');
const path = require('path');
const { query } = require('express');
const express = require ('express');
const PORT = process.env.PORT || 3001;
const app = express();
  // parse incoming string or array data
  app.use(express.urlencoded({ extended: true })); //built in method; takes incoming POST data and converts it to key/value pairs that are accessed in req.body
  // parse incoming JSON data
  app.use(express.json()); //takes incoming POST data in the form of JSON and parses it into the req.body javascript object
  //need both MIDDLEWARE functions set up every time you create a server that is looking to accept POST data 
const { animals } = require( './data/animals')

function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  // Note that we save the animalsArray as filteredResults here:
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    // Save personalityTraits as a dedicated array.
    // If personalityTraits is a string, place it into a new array and save.
    if (typeof query.personalityTraits === 'string') {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    // Loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach(trait => {
      // Check the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray,
      // but here we're updating it for each trait in the .forEach() loop.
      // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one 
      // of the traits when the .forEach() loop is finished.
      filteredResults = filteredResults.filter(
        animal => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
      }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }    
    return filteredResults;
}

function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
}

function createNewAnimal(body, animalsArray) {
  const animal = body;
  // our function's main code will go here!
  animalsArray.push(animal);
  fs.writeFileSync(
    path.join(__dirname, './data/animals.json'),
    JSON.stringify({ animals: animalsArray }, null, 2)
  );
  // return finished code to post route for response
  return animal;
}

app.get('/api/animals', (req, res) => {
    let results =  animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
 
  //return error message if no id
  if (result) {
    res.json(result);
  } else {
    res.send(404); // error message, standard format
  }
});

app.post('/api/animals', (req, res) => {

  //set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  //add animals to json file and animals array in this function
  const animal = createNewAnimal(req.body, animals);
  //req.body is where our incoming content will be
  console.log(req.body); //use console log to view the data
  res.json(animal); //use res.json to send the data back to the client
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });