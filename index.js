/*
Av Jenny Enckell 17TS

This script retrieves data from newsapi.org and renders them inside HTML elements using Express on localhost, port 3000.

Potential fixes:
Variables such as url and port can be changed so that the user can
choose what article is retireved and where everyting will be sent.
*/

const request = require('request');

//Define url and API-key from newsapi.org

let c = process.argv[2]; //Lets user pick which country news are retireved from in the second (third) argument on startup
var url = 'https://newsapi.org/v2/top-headlines?' +
          'country='+ c +'&' +
          'apiKey=8aa46648d3fe4a66a72831569b12403d';


//Express and other modules
const express = require("express");
let app = express();
const logger = require("morgan");
const errorhandler = require("errorhandler");
const bodyparser = require("body-parser");
const router = express.Router();

//Middleware setup
app.use(logger("dev"));
app.use(errorhandler());
app.use(bodyparser.json({
  extended: true
}));

//Get news from url, using promise to pick up data before sending anything
var doNews = new Promise(function(resolve, reject) {
    let news;
    request(url, function (err, response, body) {
        if(err) {
            console.log(err);
          }
          else {
              news = JSON.parse(body);

            resolve(news);
          }
    });
});

app.get('/', function(req, res) {
    doNews.then(function(news) {
        res.setHeader('Content-Type', 'text/html');

        var results = news['totalResults'];
        var arti = news['articles'];

        var newsTitle = arti[1].title;
        var newsContent = arti[1].content;
        var newsDate = arti[1].publishedAt;

        var title = JSON.stringify(newsTitle);
        var description = JSON.stringify(newsDate);
        var content = JSON.stringify(newsContent);






//Send data inside some HTML-elements
        res.send("<div> <h1>" + title + "</h1> <br> <p>" + description + "</p> <br> <p>" + content + "</p> </div>");
        console.log("Success!");
    });
});



app.listen(3000);



console.log("Listening on localhost:3000");
