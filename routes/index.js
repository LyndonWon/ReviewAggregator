var express = require('express');
var request = require('request');
var rp = require('request-promise');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/search', function(req, res, next) {
  if (req.query.query) {
    var query = req.query.query;
    var googleSearchOptions = {
      uri: 'https://maps.googleapis.com/maps/api/place/textsearch/json',
      qs: {
        query: query,
        key: 'AIzaSyBHZ1lNnf4bGtcQSg9BVR3sIKnxCPrFQ28'
      },
      json: true
    };
    rp(googleSearchOptions)
    .then(function(json) {
      console.log(json);
      res.render('search', {restaurants: json.results});
    });
  } else {
    res.render('search');
  }
});

router.get('/restaurant/:place_id', function(req, res, next) {
  var place_id = req.params.place_id;
  console.log(place_id);
  var googleDetailOptions = {
    uri: 'https://maps.googleapis.com/maps/api/place/details/json',
    qs: {
      place_id: place_id,
      key: 'AIzaSyBHZ1lNnf4bGtcQSg9BVR3sIKnxCPrFQ28'
    },
    json: true
  };
  rp(googleDetailOptions)
  .then(function(json) {
    console.log(json);
    res.render('restaurant', {restaurant: json.result});
  });
});


module.exports = router;
