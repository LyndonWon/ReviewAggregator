var express = require('express');
var request = require('request');
var rp = require('request-promise');
var router = express.Router();

/* GET home page. */


router.get('/', function(req, res, next) {
  if (req.query.query) {
    var query = req.query.query;
    var yelpOptions = {
      uri: 'https://api.yelp.com/v3/businesses/search',
      qs: {
        term: query,
        latitude: 49.2827,
        longitude:-123.1207
      },
      headers: {Authorization: "Bearer v1rCb_qfGjOu5vBytcF7ULCOlxZRUWpA-96hiWHxK1g1LvKRhJk1dZOaRS1xQ92p657KyM9DAitM_vbp1FB1UK91UB3M8MDDnsHQmZKtTfHkiAnPW2PRNwUlP-vNWHYx"},
      json: true
    };
    rp(yelpOptions)
    .then(function(json) {
      console.log(json);
      res.render('index', {restaurants: json.businesses});
    });
  } else {
    res.render('index');
  }
});

router.get('/restaurant/:id', function(req, res, next) {
  var id = req.params.id;
  console.log(id);
  var yelpDetailView = {
    uri: 'https://api.yelp.com/v3/businesses/' + id,
    headers: {Authorization: "Bearer v1rCb_qfGjOu5vBytcF7ULCOlxZRUWpA-96hiWHxK1g1LvKRhJk1dZOaRS1xQ92p657KyM9DAitM_vbp1FB1UK91UB3M8MDDnsHQmZKtTfHkiAnPW2PRNwUlP-vNWHYx"},
    json: true
  };
  rp(yelpDetailView)
  .then(function(json) {
    res.render('restaurant', {restaurant: json});
  });
});


module.exports = router;
