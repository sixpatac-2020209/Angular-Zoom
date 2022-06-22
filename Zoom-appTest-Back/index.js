const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const request = require("request");
const router = express.Router();
const moment = require('moment');

const app = express();
const port = 3000;

app.use(cors());


// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/pruebaGet', (req,res) => res.send(req.body));

app.post('/schedule-meeting', (req, res) => {
  const playload = req.body;
  console.log(playload);
  /*let date = moment.utc(playload.date).format('YYYY-MM-DD hh:mm:ss AZ');*/
  let date = (playload.date).toLocaleString('UTC',{timeZone: 'America/Guatemala'});
  let splitDate = date.split('T')[0];
  let setDate = splitDate + 'T'+ playload.time + ':00.000 Z'
  
  console.log(setDate)

  const config = {
    token: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6IkNwZ2o0aGM4UndpMXZsUU1oX2Q2emciLCJleHAiOjE2NTYzOTAwNDYsImlhdCI6MTY1NTc4NTI0N30.TAhD9Px_ZkcLoZCDOPnKAa-x2OHjMJ-VAe3pHGnIcak",
    email: "sixpatac-2020209@kinal.edu.gt",
  };
  try {
    var options = {
      url: `https://api.zoom.us/v2/users/${config.email}/meetings`,
      method: "POST",
      auth: {
        bearer: config.token,
      },
      json: true,
      body: {
        start_time: setDate,
        duration: playload.duration,
        topic: playload.name,
        type: 2,
      },
    };
    request(options, (error, response, body) => {
      
      if (!error && response.statusCode === 201) {
        res.send({ message: "meeting has been successfully created " });
        
      } else {
        console.log(body);
        res.send({ message: body.message });
      }
    });
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

app.listen(port, () =>
  console.log(`Hello world app listening on port ${port}!`)
);
