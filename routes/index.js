var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectId;

/* GET home page. */
router.get('/', function(req, res, next) {
  let date = new Date();
  let day = date.getDay();
  let startDate = new Date();
  let endDate = new Date();
  startDate.setDate(date.getDate()-day+1);
  endDate.setDate(startDate.getDate() + 4);

  req.collection.find({})
    .toArray()
    .then(results => {
      bookings = []
      for(var i = 0; i < 16; ++i){
        bookings.push([]);
        for(var j = 0; j < 5; ++j){
          bookings[i].push(null);
        }
      }
      res.render('index', { bookings: bookings, startDate:startDate.toDateString(), endDate: endDate.toDateString() });
    })
    .catch(error => res.send(error));
});

router.post('/', (req, res, next) => {
  console.log(req.body)
});

module.exports = router;