var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectId;


function getDateOfISOWeek(w, y) {
  var simple = new Date(y, 0, 1 + (w - 1) * 7);
  var dow = simple.getDay();
  var ISOweekStart = simple;
  if (dow <= 4)
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}

function render(week, year, req, res){
  let startDate = getDateOfISOWeek(week, year);

  let days = [];
  for(let i = startDate.getDate(); i <= startDate.getDate() + 5; ++i){
    days.push(i);
  }

  req.collection.find({})
    .toArray()
    .then(results => {
      console.log("resuts: ", results);
      bookings = []
      for(var i = 0; i < 16; ++i){
        bookings.push([]);
        for(var j = 0; j < 5; ++j){
          bookings[i].push(null);
        }
      }
      res.render('index', { 
        bookings: bookings, 
        week: week, 
        year: year, 
        days: days });
    })
    .catch(error => res.send(error));
}

/* GET home page. */
router.get('/', function(req, res, next) {
  let now = new Date();
  let week = Math.ceil(Math.floor((now - (new Date(now.getFullYear(), 0, 1))) / (24 * 60 * 60 * 1000)) / 7);
  let year = now.getFullYear();
  render(week, year, req, res);
});

router.post('/', (req, res, next) => {
  console.log(req.body)
  let year = req.body.week.split("-")[0];
  let week = req.body.week.split("W")[1];
  bookings = {};
  if(Array.isArray(req.body.bookings)){
    for(let i in req.body.bookings){
      bookings[req.body.bookings[i]] = req.body.name;
    }
  }else{
    bookings[req.body.bookings] = req.body.name;
  }
  
  console.log(bookings);
  req.collection.updateOne(
    { week, name: req.body.name, desk: },
    { $push: {bookings: bookings} },
    {upsert: true}
  );
  
  render(week, year, req, res);
});

module.exports = router;