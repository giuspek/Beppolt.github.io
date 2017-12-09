const cheerio = require('cheerio');
const svg2png=require('svg2png');
const path = require("path");
const fs=require('pn/fs');

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
    }
    return output;

}


function conversionMap(map,res){
    var sourceBuffer;
    svg2png(map)
    .then(function (buffer) {
        sourceBuffer = new Buffer(buffer, 'base64');
         res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': sourceBuffer.length
          });
        res.end(sourceBuffer);
    })
    .catch(function (error) {
        console.log("Conversion Error!");
    });

}


module.exports = {mesianoFloor1, mesianoFloor2, getMaps, conversionMap};
