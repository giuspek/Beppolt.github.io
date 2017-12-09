const fetch = require("node-fetch");
const geolib = require("geolib");
const cheerio = require('cheerio');
const svg2png=require('svg2png');
const fs=require('pn/fs');
const express = require('express');
const path = require("path");
const request = require('request');
const cors = require('cors');
const dataStruct = require('./data');

var mesianoFloor2 ={
    "398" : "#2d",
    "397" : "#2f",
    "396" : "#2m",
    "399" : "#2a",
    "379" : "#2c",
    "380" : "#2b",
    "387" : "#2q",
    "395" : "#2n"
}

var mesianoFloor1 ={
    "384" : "#1a",
    "383" : "#1b",
    "377" : "#1d",
    "382" : "#1p",
    "391" : "#t3",
    "390" : "#t4"
}

function inArray(sede){
    if(sede === undefined) {
        throw new Error('No parameter inserted');
    }
    if(typeof sede != "string") {
        throw new TypeError('No string parameter inserted');
    }
    for (let i = 0; i < dataStruct.department_id.length; i++)
    {
        if(sede === dataStruct.department_id[i])
            return true;
    }
    return false;
}

function getMaps(rooms,sede, value){
    var output;
    var $;

    switch(sede){
        case 'E0503':

        switch(value){
            case 1:  //Povo A piano P1
                $ = cheerio.load(fs.readFileSync(path.join(__dirname+'/../img/Povo1P1.svg')));
                for(i = 0; i<rooms.length;i++){
                    if(rooms[i].room <= 437 && rooms[i].room >= 414){
                        var id = 201 + (437 - rooms[i].room) ;
                        var stringa = "#a" + id;
                        var rect = $(stringa);
                        rect.attr('fill','green');
                    }
                }
                output =  $.html();
            break;
            case 0: //Povo A piano PT
                $ = cheerio.load(fs.readFileSync(path.join(__dirname+'/../img/Povo1PT.svg')));
                for(i = 0; i<rooms.length;i++){
                    if(rooms[i].room <= 445 && rooms[i].room >= 438){
                        var id = 101 + (445 - rooms[i].room) ;
                        var stringa = "#a" + id;
                        var rect = $(stringa);
                        rect.attr('fill','green');
                    }
                }
                output =  $.html();
            break;
            case 2:   //Povo B piano PT
                $ = cheerio.load(fs.readFileSync(path.join(__dirname+'/../img/Povo2PT.svg')));
                for(i = 0; i<rooms.length;i++){
                    if(rooms[i].room <= 408 && rooms[i].room >= 404){
                        var id = 101 + (408 - rooms[i].room) ;
                        var stringa = "#b" + id;
                        var rect = $(stringa);
                        rect.attr('fill','green');
                    }
                }
            output=  $.html();
            break;
            case 3:   //Povo B piano P1
                $ = cheerio.load(fs.readFileSync(path.join(__dirname+'/../img/Povo2P1.svg')));
                for(i = 0; i<rooms.length;i++){
                    if(rooms[i].room <= 403 && rooms[i].room >= 402){
                        var id = 106 + (403 - rooms[i].room) ;
                        var stringa = "#b" + id;
                        var rect = $(stringa);
                        rect.attr('fill','green');
                    }
                }
                output = $.html();
            break;
        }

        break;

        //-------------------

        case 'E0301':

        switch(value){
            case 0: //Mesiano PT
                $ = cheerio.load(fs.readFileSync(path.join(__dirname+'/../img/MesianoPT.svg')));
                for(i = 0; i<rooms.length;i++){
                    if(rooms[i].room == 392){
                        var rect=$('#t2');
                        rect.attr('fill','green');
                    }
                    if(rooms[i].room == 458 || rooms[i].room == 459){
                        var rect=$('#t1');
                        rect.attr('fill','green');
                    }
                }

                output =  $.html();
            break;
            case 1: //Mesiano P1
                $ = cheerio.load(fs.readFileSync(path.join(__dirname+'/../img/MesianoP1.svg')));
                 for(i = 0; i<rooms.length;i++){
                        var stringa = mesianoFloor1[rooms[i].room];
                        var rect = $(stringa);
                        rect.attr('fill','green');
                }
                output =  $.html();
            break;
            case 2: //Mesiano P2
                $ = cheerio.load(fs.readFileSync(path.join(__dirname+'/../img/MesianoP2.svg')));
                for(i = 0; i<rooms.length;i++){
                        var stringa = mesianoFloor2[rooms[i].room];
                        var rect = $(stringa);
                        rect.attr('fill','green');
                }
                output =  $.html();
            break;
            case 3: //Mesiano P4
                $ = cheerio.load(fs.readFileSync(path.join(__dirname+'/../img/MesianoP4.svg')));
                for(i = 0; i<rooms.length;i++){
                    if(rooms[i].room == 394){
                        var rect=$('#4a');
                        rect.attr('fill','green');
                    }
                    if(rooms[i].room == 393){
                        var rect=$('#4b');
                        rect.attr('fill','green');
                    }
                }
                output =  $.html();
            break;

        }

        //console.log(rooms);
    }
        //console.log(output);
    return output;

}

function getRoomList(events) {
    if(events === undefined) {
        throw new Error('No parameter inserted');
    }
    if(typeof events != "object") {
        throw new TypeError('No object parameter inserted');
    }
    let rooms = [];
    for(let i = 0; i < events.length; i++) {
        let room = {room: events[i].room,
                    NomeAula: events[i].NomeAula,
                    orario: [{
                        from: events[i].from,
                        to: events[i].to,
                        timestamp_day: events[i].timestamp_day,
                        timestamp_from: events[i].timestamp_from,
                        timestamp_to: events[i].timestamp_to
                    }]
                    };
        let id = -1;
        for(let j = 0; j < rooms.length; j++) {
            if(rooms[j].room === room.room) {
                id = j;
            }
        }

        if(id >= 0) {
            let newOrario = {
                from: events[i].from,
                to: events[i].to,
                timestamp_day: events[i].timestamp_day,
                timestamp_from: events[i].timestamp_from,
                timestamp_to: events[i].timestamp_to
            };
            rooms[id].orario.push(newOrario);
            id = -1;
        } else {
            rooms.push(room);
        }

    }
    return rooms;
}

function cleanSchedule(rooms) {
    if(rooms === undefined) {
        throw new Error('No parameter inserted');
    }
    if(typeof rooms != "object") {
        throw new TypeError('No object parameter inserted');
    }
    for(let i = 0; i < rooms.length; i++) {
        for(let j = 0; j < rooms[i].orario.length - 1; j++) {
            if(rooms[i].orario[j].timestamp_to === rooms[i].orario[j + 1].timestamp_from) {
                rooms[i].orario[j].to = rooms[i].orario[j + 1].to;
                rooms[i].orario[j].timestamp_to = rooms[i].orario[j + 1].timestamp_to;
                rooms[i].orario.splice(j + 1, 1);
                j--;
            }
        }
    }
    return rooms;
}

function getFreeRooms(rooms, timeStamp) {
    if(rooms === undefined)  {
        throw new Error('No parameter inserted')
    }
    if(typeof rooms != "object" || typeof timeStamp != "number") {
        throw new TypeError("Wrong parameters' type");
    }
    if(timeStamp <= 0) {
        throw new Error("Timestamp can't be null or negative");
    }
    let closeTimeStamp;
    if(rooms.length > 0) {
        closeTimeStamp = rooms[0].orario[0].timestamp_day + 72000; // Time 20:00
    }
    for(let i = 0; i < rooms.length; i++) {
		if(rooms[i].NomeAula.indexOf("Aula") == -1 && rooms[i].NomeAula.indexOf("AULA") == -1 && rooms[i].NomeAula.indexOf("aula") == -1) {
			rooms.splice(i,1);
			i--;
		}

        //Check if the current time is between 00:00 and 20:00
        else if(rooms[i].orario.length > 0 && (timeStamp > rooms[i].orario[0].timestamp_day && timeStamp < closeTimeStamp)) {
            for(let j = 0; j < rooms[i].orario.length; j++) {
                if(rooms[i].orario[j].timestamp_from <= timeStamp && rooms[i].orario[j].timestamp_to > timeStamp) {
                    rooms.splice(i, 1);
                    i--;
                    break;
                }
            }
        }
    }
    return rooms;
}

//Delete those schedules that are in the past.
function cleanPastSchedule(rooms, timestamp) {
    if(rooms === undefined)  {
        throw new Error('No parameter inserted')
    }
    if(typeof rooms != "object" || typeof timestamp != "number") {
        throw new TypeError("Wrong parameters' type");
    }
    if(timestamp <= 0) {
        throw new Error("Timestamp can't be null or negative");
    }
    for(let i = 0; i < rooms.length; i++) {
        for(let j = 0; j < rooms[i].orario.length; j++) {
            if(timestamp > rooms[i].orario[j].timestamp_from) {
                rooms[i].orario.splice(j,1);
                j--;
            }
        }
    }
    return rooms.length !== 0 ? rooms : 'Nessuna aula disponibile al momento';
}

//Genera un oggetto contenente ogni room code come proprietà e il relativo id.
function idRoomCode(uri) {
    if(uri === undefined) {
        throw new Error('No parameter inserted');
    }
    return fetch(uri)
        .then(response => {
            return response.json()
        })
        .then(json => {
            let areaRooms = json.area_rooms;
            return areaRooms;
        })
        .then(areaRooms => {
            let couple = {};
            Object.keys(areaRooms).map(sede => {
                Object.keys(areaRooms[sede]).map(room => {
                    couple[areaRooms[sede][room ].room_code] = areaRooms[sede][room].id;
                });
            });
            return couple;
        })
        .catch(error => {
            console.log(error);
        });
}

function getRoomSchedule(events, roomId) {
    if(events === undefined || roomId === undefined) {
        throw new Error('No parameter inserted');
    }
    if(typeof roomId != "number") {
        throw new TypeError("Wrong parameters' type");
    }
    let ris;
    for(let i = 0; i < events.length; i++) {
        if(events[i].room == roomId) {
            if(ris == null) {
                if(events[i].Utenti[0] != null) {
                    ris = { room: events[i].room,
                        NomeAula: events[i].NomeAula,
                        orario: [{
                            nomeMateria : events[i].name,
                            nomeProf : events[i].Utenti[0].Nome + " " + events[i].Utenti[0].Cognome,
                            from: events[i].from,
                            to: events[i].to,
                            timestamp_day: events[i].timestamp_day,
                            timestamp_from: events[i].timestamp_from,
                            timestamp_to: events[i].timestamp_to
                        }]
                    };
                } else {
                    ris = { room: events[i].room,
                        NomeAula: events[i].NomeAula,
                        orario: [{
                            nomeMateria : events[i].name,
                            from: events[i].from,
                            to: events[i].to,
                            timestamp_day: events[i].timestamp_day,
                            timestamp_from: events[i].timestamp_from,
                            timestamp_to: events[i].timestamp_to
                        }]
                    };
                }
            } else {
                let newOrario;
                if(events[i].Utenti[0] != null) {
                    newOrario = {
                        nomeMateria : events[i].name,
                        nomeProf : events[i].Utenti[0].Nome + " " + events[i].Utenti[0].Cognome,
                        from: events[i].from,
                        to: events[i].to,
                        timestamp_day: events[i].timestamp_day,
                        timestamp_from: events[i].timestamp_from,
                        timestamp_to: events[i].timestamp_to
                    };
                } else {
                    newOrario = {
                        nomeMateria : events[i].name,
                        from: events[i].from,
                        to: events[i].to,
                        timestamp_day: events[i].timestamp_day,
                        timestamp_from: events[i].timestamp_from,
                        timestamp_to: events[i].timestamp_to
                    };
                }
                ris.orario.push(newOrario);
            }
        }
    }
    return ris == null ? "Nessuna lezione oggi in questa aula" : ris;
}

function getDaySchedule(sede, room, day, month, year) {
    let roomCode = sede + '/' + room;

    let url = "https://easyroom.unitn.it/Orario/rooms_call.php?form-type=rooms&sede=" + sede + "&_lang=it&date=" + day + "-" + month + "-" + year;

    return new Promise((resolve, reject) => {
        idRoomCode(url)
        .then(response => {
            return response[roomCode];
        })
        .then(id => { //id della stanza
            fetch(url)
            .then(body => {
                return body.json();
            })
            .then(data => {
                let events = data.events; //cerchiamo tutti gli eventi in quella sede per quel determinato giorno

                let room =  getRoomSchedule(events, id); //otteniamo lo schedule della stanza prescelta e lo inviamo come json

                resolve(room);
            })
            .catch(error => {
                console.log(error);
            })
        })
        .catch(error => {
            console.log(error);
        });
    })
}

function getFreeRooms4xHours(rooms, hours, currentTimestamp) {
    let ris = [];
    if(typeof rooms === "string") {
        return "Nessuna aula libera";
    } else {
        rooms.map(room => {
            if(room.orario[0]) {
                let nextLessonTimestamp = room.orario[0].timestamp_from;
                let secondToNextLesson = nextLessonTimestamp - currentTimestamp;
                if(secondToNextLesson >= hours * 3600) { //Se la prossima lezione è tra più di hours ore
                    ris.push(room);
                }
            }        
        });
    }

    return ris.length !== 0 ? ris : 'Nessuna aula sarà libera per ' + hours + " ore.";
}

function getNearestLocation(userCoord) {
    let min = 100000;
    let ris;
    for (var sede in dataStruct.dep_coordinates) {
        if (dataStruct.dep_coordinates.hasOwnProperty(sede)) {
            let d = getDistanceFromLatLonInKm(userCoord.latitude, userCoord.longitude,
                 dataStruct.dep_coordinates[sede].latitude, dataStruct.dep_coordinates[sede].longitude);
            if(d < min) {
                min = d;
                ris = sede;
            }
        }
    }
    return ris;
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
  }

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

module.exports = {inArray, getRoomList, cleanSchedule, getFreeRooms,
                cleanPastSchedule, idRoomCode, getRoomSchedule,
                 getNearestLocation, getMonday, getFreeRooms4xHours,
                 getDaySchedule};
