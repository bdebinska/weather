const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

// render the main page
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

// get the weather from openweathermap api and send it to the main page
app.post("/", function(req, res) {

    const query = req.body.cityName;
    const apiKey = "d42ccb70971968b87ed98f20c7ac4c5a";
    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;

    https.get(url, function(response) {
        console.log(response.statusCode);

        response.on("data", function(data) {

            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.write("<p>The weather is currently " + description + ".</p>");
            res.write("<p>The temperature in " + query + " is " + temp + " degrees Celcius.</p>");
            res.write("<img src=" + imageURL + ">");
            res.send();
        });
    });
});

// listen on port 3000
app.listen(3000, function() {
    console.log("Server is running on port 3000.");
});
