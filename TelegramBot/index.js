var TelegramBot = require('node-telegram-bot-api'),
		telegram = new TelegramBot("483774152:AAFNnHRXFF_LHCQGm7fRpWDspwMMPVcPRA0", { polling: true });
const fetch = require("node-fetch");
const mapper = require('../server/map.js');
const utilities = require ('../server/utilities.js')
const svg2png=require('svg2png');

var povo1p1 = '../img/Povo1P1.svg';
var povo1pt = '../img/Povo1PT.svg';
var povo2p1 = '../img/Povo2P1.svg';
var povo2pt = '../img/Povo2PT.svg';
var photo = '../photo_2017-10-12_10-39-45.jpg';


var mesiano ={
    "0" : "mesiano piano terra",
    "1" : "mesiano piano 1",
    "2" : "mesiano piano 2",
    "3" : "mesiano piano 4",
}

var povo ={
    "0" : "povo A piano terra",
    "1" : "povo A piano 1",
    "2" : "povo B piano -1",
    "3" : "povo B piano terra",
}

function getData(sede) {
    return new Promise((resolve, reject) => {
        url = "https://uniroomtn.herokuapp.com/sede/"+ sede;
        fetch(url)
        .then(data => {
            return data.json();
        })
        .then(body => {
            resolve(body);
        })
        .catch(error => {
            reject(error);
        })
    });
}

function getDataAndMaps(sede, id, value){
	getData(sede)
	.then(rooms => {
		if(rooms === "Nessuna aula disponibile al momento") {
			return noInfoAvaible(id,value);
		} else {
			var maps = mapper.getMaps(rooms,sede,value);
			return maps;
		}		
	})
	.then(maps => {
  	  	svg2png(maps)
    	.then(function (buffer) {
            if(sede=="E0503")
        	   telegram.sendPhoto(id,buffer,{caption : povo[value]});
            else if (sede=="E0301")
                telegram.sendPhoto(id,buffer,{caption : mesiano[value]});
        })
    	.catch(function (error) {
        	console.error("Conversion Error! "+error);
    	});
	})
	.catch(error => {
			console.error("Errore nel parsing json: "+error);
	});
}


function noInfoAvaible(id,value) {
	return new Promise((resolve, reject) => {
		if(value == 0)	telegram.sendMessage(id,"Nessuna informazione disponibile");
	});
}

function Print(sede,chatid){
		let message;
		let msg = "";
		getData(sede)
		.then(rooms => {
			if(rooms !== "Nessuna aula disponibile al momento") {
				for(let i = 0; i < rooms.length; i++) {
					if(rooms[i].orario.length > 0) {
						msg += rooms[i].NomeAula+" libera fino alle "+rooms[i].orario[0].from+"\n";
						message = msg;
					}
					else {
						msg += rooms[i].NomeAula+" libera fino a chiusura.\n";
						message = msg;
					}
				}
			} else {
				message = rooms;
				telegram.sendMessage(chatid, message);
			}			
		})
		.catch(error => {
			console.error(error);
		})
}

telegram.on("text", (message) => {
	if (message.text == "/start")
	{
		telegram.sendMessage(message.chat.id, "Ciao! Grazie a questo bot puoi sapere le aule di Unitn libere del dipartimento che vuoi! Digita /help per sapere i comandi disponibili.", {parse_mode: "Markdown"});
	}
	else if (message.text == "/help")
	{
		telegram.sendMessage(message.chat.id, "I comandi disponibili sono: \n/help \n/start \n/povo \n/socio \n/economia \n/scicogn \n/lettere \n/giuri \n/mesiano \n/filosofia \n/mappePovo \n/mappeMesiano");
	}
	else if (message.text == "/mappepovo"){
        telegram.sendMessage(message.chat.id, "_Sto disegnando le mappe..._", {parse_mode: "Markdown"})
    	for(let i=0; i < 4;i++){
    		getDataAndMaps("E0503",message.chat.id,i);
    	}
    }
    else if (message.text == "/mappemesiano"){
        telegram.sendMessage(message.chat.id, "_Sto disegnando le mappe..._", {parse_mode: "Markdown"})
    	for(let i=0; i < 4;i++){
    		getDataAndMaps("E0301",message.chat.id,i);
    	}
    }
	else if (message.text.toLowerCase().includes("povo"))Print("E0503",message.chat.id);
	else if (message.text.toLowerCase().includes("ingegneria") || message.text.toLowerCase().includes("mesiano"))Print("E0301",message.chat.id);
	else if (message.text.toLowerCase().includes("giurisprudenza") || message.text.toLowerCase().includes("giuri"))Print("E0201",message.chat.id);
	else if (message.text.toLowerCase().includes("sociologia") || message.text.toLowerCase().includes("socio"))Print("E0601",message.chat.id);
	else if (message.text.toLowerCase().includes("filosofia") || message.text.toLowerCase().includes("lettere"))Print("E0801",message.chat.id);
	else if (message.text.toLowerCase().includes("scienze cognitive") || message.text.toLowerCase().includes("scicogn"))Print("E0705",message.chat.id);
	else if (message.text.toLowerCase().includes("economia"))Print("E0101",message.chat.id);

	else
    {
		telegram.sendMessage(message.chat.id,"Comando non riconosciuto! Digita /help per conoscere la lista dei comandi.")
	}
});
