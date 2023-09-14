const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/views"));
app.set('view engine', 'ejs');

app.get("/", function (req, res) {
    
    const url = "https://api.openweathermap.org/data/2.5/weather?q=delhi&units=metric&appid="+process.env.appid+"#";
    https.get(url, function (response) {
        console.log(response.statusCode);

        if(response.statusCode==200)
        {
        
        
        
         response.on("data", function (data) {
            const weatherdata = JSON.parse(data);
            const temp = weatherdata.main.temp;
            const des = weatherdata.weather[0].description;
            const iconid = weatherdata.weather[0].icon;
            const lon = weatherdata.coord.lon;
            const lat = weatherdata.coord.lat;

            //console.log(weatherdata);
            const imageurl = "https://openweathermap.org/img/wn/" + iconid + "@2x.png";

            https.get("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid="+process.env.appid+"&units=metric#", function (results) {
                console.log(results.statusCode);


                results.on("data", async function (data5) {
                    const weather5 =await JSON.parse(data5);

                    

                    var tmpResult = {};
                    var resultdata = [];

                    // create unique object and use date as key
                    weather5.list.forEach(function (item) {
                        var min = item.main.temp_min;
                        var max = item.main.temp_max;
                        var desc = item.weather[0].description;
                        var icon="https://openweathermap.org/img/wn/" +item.weather[0].icon+ "@2x.png";

                        if (!tmpResult[new Date(item.dt_txt).toLocaleString('en-us', {weekday:'long'})]) {
                            tmpResult[new Date(item.dt_txt).toLocaleString('en-us', {weekday:'long'})] = {
                                "min_temp": min,
                                "max_temp": max,
                                "descrip" : desc,
                                "icon" : icon
                            }
                        } else {
                            var prevMin = tmpResult[new Date(item.dt_txt).toLocaleString('en-us', {weekday:'long'})].min_temp;
                            var prevMax = tmpResult[new Date(item.dt_txt).toLocaleString('en-us', {weekday:'long'})].max_temp;
                            tmpResult[new Date(item.dt_txt).toLocaleString('en-us', {weekday:'long'})] = {
                                min_temp: min < prevMin ? min : prevMin,
                                max_temp: max > prevMax ? max : prevMax,
                                descrip : desc,
                                icon : icon
                            }
                        }
                    })

                   // console.log(tmpResult);

                    for (var date in tmpResult) {
                        resultdata.push({
                          "dt_txt" : date,
                          "min_temp": tmpResult[date].min_temp,
                          "max_temp": tmpResult[date].max_temp,
                          "descrip" : tmpResult[date].descrip,
                          "icon" : tmpResult[date].icon
                        })
                      }
                    //  console.log(resultdata);
                    res.render('index', { City: "Delhi", temp: temp, des: des, imgsrc: imageurl, days5: resultdata });
                 
                });

            });
        });
    }
    else{
        res.render('index', { City: "No City Found", temp: "", des: "", imgsrc: "", days5: "" });
    }
    });

});




app.post("/", function (req, res) {

    const city = req.body.cityname;

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid="+process.env.appid+"#";
    https.get(url, function (response) {
        console.log(response.statusCode);

        if(response.statusCode==200)
        {
        
        
        
         response.on("data", function (data) {
            const weatherdata = JSON.parse(data);
            const temp = weatherdata.main.temp;
            const des = weatherdata.weather[0].description;
            const iconid = weatherdata.weather[0].icon;
            const lon = weatherdata.coord.lon;
            const lat = weatherdata.coord.lat;

            //console.log(weatherdata);
            const imageurl = "https://openweathermap.org/img/wn/" + iconid + "@2x.png";

            https.get("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid="+process.env.appid+"&units=metric#", function (results) {
                console.log(results.statusCode);

            let data5="";
                results.on("data", function (datas) {
                 
                data5+=datas;
                });
                    results.on("end", function() {

                    

                    var weather5 =JSON.parse(data5);


                    var tmpResult = {};
                    var resultdata = [];

                    // create unique object and use date as key
                    weather5.list.forEach(function (item) {
                        var min = item.main.temp_min;
                        var max = item.main.temp_max;
                        var desc = item.weather[0].description;
                        var icon="https://openweathermap.org/img/wn/" +item.weather[0].icon+ "@2x.png";

                        if (!tmpResult[new Date(item.dt_txt).toLocaleString('en-us', {weekday:'long'})]) {
                            tmpResult[new Date(item.dt_txt).toLocaleString('en-us', {weekday:'long'})] = {
                                "min_temp": min,
                                "max_temp": max,
                                "descrip" : desc,
                                "icon" : icon
                            }
                        } else {
                            var prevMin = tmpResult[new Date(item.dt_txt).toLocaleString('en-us', {weekday:'long'})].min_temp;
                            var prevMax = tmpResult[new Date(item.dt_txt).toLocaleString('en-us', {weekday:'long'})].max_temp;
                            tmpResult[new Date(item.dt_txt).toLocaleString('en-us', {weekday:'long'})] = {
                                min_temp: min < prevMin ? min : prevMin,
                                max_temp: max > prevMax ? max : prevMax,
                                descrip : desc,
                                icon : icon
                            }
                        }
                    })

                   // console.log(tmpResult);

                    for (var date in tmpResult) {
                        resultdata.push({
                          "dt_txt" : date,
                          "min_temp": tmpResult[date].min_temp,
                          "max_temp": tmpResult[date].max_temp,
                          "descrip" : tmpResult[date].descrip,
                          "icon" : tmpResult[date].icon
                        })
                      }
                    //  console.log(resultdata);
                    res.render('index', { City: city, temp: temp, des: des, imgsrc: imageurl, days5: resultdata });
                 
                });

            });
        });
    }
    else{
        res.render('index', { City: "No City Found", temp: "", des: "", imgsrc: "", days5: "" });
    }
    });



    //5 days forecast
    //https://api.openweathermap.org/data/2.5/forecast?lat=51.5085&lon=-0.1257&appid=55d22cd648f90ad80af932acbd0f2e7b&units=metric#
});

app.listen(port, "0.0.0.0", function () {
    console.log('server at 5000');
});

// list[0].dt_txt
// list[0].main.temp_min
// list[0].main.temp_max
// list[0].weather[0].description
// list[0].weather[0].icon
