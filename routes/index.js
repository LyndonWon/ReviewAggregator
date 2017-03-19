var express = require('express');
var request = require('request');
var rp = require('request-promise');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/search', function(req, res, next) {
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
      res.render('search', {restaurants: json.businesses});
    });
  } else {
    res.render('search');
  }
});

router.get('/restaurant/:id', function(req, res, next) {
  try {

  var id = req.params.id;
  console.log(id);
  var yelpDetailView = {
    uri: 'https://api.yelp.com/v3/businesses/' + id,
    headers: {Authorization: "Bearer v1rCb_qfGjOu5vBytcF7ULCOlxZRUWpA-96hiWHxK1g1LvKRhJk1dZOaRS1xQ92p657KyM9DAitM_vbp1FB1UK91UB3M8MDDnsHQmZKtTfHkiAnPW2PRNwUlP-vNWHYx"},
    json: true
  };
  rp(yelpDetailView)
  .then(function(json) {
    _zomato_search(json.name, json.coordinates.latitude, json.coordinates.longitude)
    .then(function(zomato) {
      res.render('restaurant', {restaurant: json, z_rating: zomato.aggregate_rating, z_count: Number(zomato.votes)});
    });
  });
} catch(e) {
  console.log(e);
}
});

var _zomato_search = function(name, lat, lon) {
   return new Promise(function(resolve, reject) {
    var options = {
      uri: 'https://developers.zomato.com/api/v2.1/search',
      qs: {
        q: name,
        lat: lat,
        lon: lon,
        count: 1
      },
      headers: {"user-key": "b23904bedbac1ceacd4a337e56fcfa56"},
      json: true
    };
    rp(options)
    .then(function(json) {
      console.log(json.restaurants[0]);
      var res_id = json.restaurants[0].restaurant.R.res_id;
      var detailOptions = {
        uri: 'https://developers.zomato.com/api/v2.1/restaurant',
        qs: {
          res_id: res_id
        },
        headers: {"user-key": "b23904bedbac1ceacd4a337e56fcfa56"},
        json: true
      };
      rp(detailOptions)
      .then(function(detail) {
        console.log(detail.user_rating.votes);
        resolve(detail.user_rating);
      });
    });
  });
}


module.exports = router;
