var express = require('express');
const { start } = require('repl');
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

function getDateStamp(date){
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  return year + (month < 10 ? "0" : "") + month + (day < 10 ? "0" : "") + day;
}

function render(week, year, req, res){
  let startDate = getDateOfISOWeek(week, year);

  let days = [];
  for(let i = startDate.getDate(); i <= startDate.getDate() + 5; ++i){
    days.push(i);
  }

  req.collection.findOne({_id: `${year}-W${week}`})
    .then(result => {
      if(result == null) result = {};
      console.log("result", result)
      bookings = []
      for(var i = 0; i < 16; ++i){
        bookings.push([]);
        for(var j = 0; j < 5; ++j){
          key = `${i}_${j}`
          bookings[i].push((key in result && result[key].length ? result[key] : null));
        }
      }
      console.log("bookings: ", bookings)
      res.render('index', { 
        bookings: bookings,
        week: week, 
        year: year,
        startDate: startDate.toDateString(),
        days: days 
      });
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

router.get('/:year/:week', function(req, res, next) {
  render(req.params.week, req.params.year, req, res);
});

router.post('/reserve', (req, res, next) => {
  let year = req.body.week.split("-")[0];
  let week = req.body.week.split("W")[1];
  if(req.body.desk && req.body.week && req.body.day){
    req.collection.updateOne(
      { _id: req.body.week },
      { $set: {_id: req.body.week, [`${req.body.desk}_${req.body.day}`]: req.body.name } },
      { upsert: true }
    );
  }
  res.send(200);
});

module.exports = router;