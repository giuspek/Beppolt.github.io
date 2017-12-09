const express = require('express');
const path = require("path");
const request = require('request');
const cors = require('cors');
const utilities = require('./utilities');
const fetch = require("node-fetch");
const department = require("./data.js");
//const geolib = require("geolib");
const map = require('./map');

const datastruc = require('./data')
const cheerio = require('cheerio');
const svg2png=require('svg2png');
const fs=require('pn/fs');
const apiai = require('apiai');
var nlapp = apiai("f3673557663f4ae8b3f299c5b9c8f836");

var povo = ['/img/Povo1PT.svg','/img/Povo1P1.svg','/img/Povo2PT.svg','/img/Povo2P1.svg']

var port = process.env.PORT || 8080;

const app = express();
app.use(cors());

//funzione che data una stringa estrae i dati (place,ecc.) e redirige la richiesta
app.get('/nl', (req,res) => {
    let frase = req.query.frase; //frase ricevuta
    var request = nlapp.textRequest(frase , {
        sessionId: '0' //non ci serve, non abbiamo bisogno di creare dialoghi
    });

    request.on('response', function(response) {
        //dati estratti dalla stringa
        var nlresp = {"action" : response.result.action,
            "Place" : response.result.parameters.Place,
            "date" : response.result.parameters.date,
            "time" : response.result.parameters.time};

        let urldate = '';
        let urltime = '';

        if(nlresp.date != undefined) urldate = 'date=' + nlresp.date;
        if(nlresp.time != undefined) urltime = 'time=' + nlresp.time;

        if(nlresp.action === "return.aulalibera") {
            if(nlresp.Place != null) {
                place = nlresp.Place.toLowerCase();
                let code_place = department.dep_id[place];

                res.redirect('http://localhost:8080/sede/' + code_place + '?' + urldate + '&' + urltime);
            } else res.redirect('http://localhost:8080/');

        }
        else res.redirect('http://localhost:8080/');

        


    }).on('error', function(error) {
        console.log(error);
    }).end();

});

//funzione che data sede e giorno restituisce le aule libere quel giorno
app.get('/sede/:sede', (req,res) => {
    let url;
    let sede;
    if (utilities.inArray(req.params.sede))
    {
        let timeStamp;
        sede = req.params.sede;
        if (req.query.date != undefined && req.query.time != undefined)       //se nella request ci sono i parametri day,month,year
        {
            let datePar = req.query.date;
            let date = new Date(datePar);
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();

            let time = req.query.time;
            let timeString = time.split(':');
            date.setHours(parseInt(timeString[0]));
            date.setMinutes(parseInt(timeString[1]));
            timeStamp = date.getTime() / 1000;
            url = "https://easyroom.unitn.it/Orario/rooms_call.php?form-type=rooms&sede="+ sede +"&_lang=it&date=" + day + "-" + month + "-" + year;
        }
        else        //se nella request non ci sono i parametri day,month,year significa "in questo momento"
        {
            let now = new Date();
            let day = now.getDate();
            let month = now.getMonth() + 1;
            let year = now.getFullYear();
            timeStamp = now.getTime() / 1000;
            url = "https://easyroom.unitn.it/Orario/rooms_call.php?form-type=rooms&sede="+ sede +"&_lang=it&date=" + day + "-" + month + "-" + year;
        }

        let durataOre = 0;
        if(req.query.durataOre) {
            durataOre = req.query.durataOre;
        }

        fetch(url)
        .then(body => {
            return body.json();
        })
        .then(data => {
            return data.events;
        })
        .then(events => {
            let rooms = utilities.getRoomList(events);
            rooms =  utilities.cleanSchedule(rooms);
            rooms =  utilities.getFreeRooms(rooms, timeStamp);
            rooms =  utilities.cleanPastSchedule(rooms, timeStamp);
            if(durataOre > 0) {
                rooms = utilities.getFreeRooms4xHours(rooms,durataOre,timeStamp);
            }         
            res.json(rooms); //Get the list of rooms with events that day and the hours in which they are busy.
        })
        .catch(error => {
            console.log(error);
        });
    }
});


app.get('/schedule/sede/:sede/aula/:aula', (req, res) => {
    let sede = req.params.sede;  //Id della sede
    let room = req.params.aula;  //nome aula

    let now = new Date();

    let risultato = [];

    let monday = utilities.getMonday(now);

    let currentDay = monday;

    for(let i = 0; i < 5; i++) { //Da lunedi a venerdi
        let day = currentDay.getDate();
        let month = currentDay.getMonth() + 1;
        let year = currentDay.getFullYear();

        risultato.push(utilities.getDaySchedule(sede, room, day, month, year));
        currentDay.setDate(currentDay.getDate() + 1);
    }

    Promise.all(risultato)
    .then(results => {
        res.json(results);
    })
});


app.get('/room', (req, res) => {
    let lat = req.query.lat;
    let lng = req.query.lng;

    let userCoord = {latitude:lat, longitude:lng};
    let nearestLocation =  utilities.getNearestLocation(userCoord);
    let sede = datastruc.depIdToName[nearestLocation];
    let url;

    let now = new Date();
    let day = now.getDate();
    let month = now.getMonth() + 1;
    let year = now.getFullYear();

    url = "https://easyroom.unitn.it/Orario/rooms_call.php?form-type=rooms&sede="+ nearestLocation +"&_lang=it&date=" + day + "-" + month + "-" + year;
    let currentTimestamp = now.getTime() / 1000;

    fetch(url)
    .then(body => {
        return body.json();
    })
    .then(data => {
        return data.events;
    })
    .then(events => {
        let rooms = utilities.getRoomList(events);
        rooms = utilities.cleanSchedule(rooms);
        rooms = utilities.getFreeRooms(rooms, currentTimestamp);
        rooms = utilities.cleanPastSchedule(rooms, currentTimestamp);
        rooms[0].sede = sede; //Solo il primo elemento avrà il campo sede che servirà per cambiare il titolo alla pagina
        res.json(rooms); //Get the list of rooms with events that day and the hours in which they are busy.
    })
    .catch(error => {
        console.log(error);
    });
});

app.listen(port);
console.log("Server started on port " + port);
