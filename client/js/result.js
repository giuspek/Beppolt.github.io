//script per caricare il titolo
var polo = getQueryVariable_q(window.location.href);
if(polo !== null) {
    var name = "Aule libere presso: " + polo;    
} else {
    var name = "Tentativo di utilizzo geolocalizzazione";
}
document.getElementById("nome_polo").innerHTML = name;




let url;
//script per creare la tabella degli orari
var sede = getQueryVariable_q(window.location.href);
var geoloc = getQueryVariable_geoloc(window.location.href);
if (sede != null) {
    sede = sede.replace("%20", " ");
    switch (sede) {
        case "povo": sede = "E0503"; break;
        case "economia": sede = "E0101"; break;
        case "lettere": sede = "E0801"; break;
        case "filosofia": sede = "E0801"; break;
        case "mesiano": sede = "E0301"; break;
        case "ingegneria": sede = "E0301"; break;
        case "giurisprudenza": sede = "E0201"; break;
        case "sociologia": sede = "E0601"; break;
        case "scienze cognitive": sede = "E0705"; break;
        case "giuri": sede = "E0201"; break;
        case "socio": sede = "E0601"; break;
        case "help": location.href = "index.html?q=help";
    }
    url = "https://uniroomtn.herokuapp.com/sede/"+ sede;
    $.getJSON(url, function (data) {
        if((data == "Nessuna aula disponibile al momento")||(data == null)||(data == undefined)){
            $("#command_table").append("<tr><td>Nessuna aula libera</td><td></td><td></td></tr>");
        }
        else{
            $.each(data, function (key, val) {
                if (val.orario[0]) {
                    $("#command_table").append("<tr><td>" + val.NomeAula + "</td><td>ora</td><td>" + val.orario[0].from + "</td></tr>");
                }
                else {
                    $("#command_table").append("<tr><td>" + val.NomeAula + "</td><td>ora</td><td>fine giornata</td></tr>");
                }
            });
        }        
    });
} 
else if(geoloc != null)
{
    var getPosition = function (options) {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });
    }

    getPosition()
    .then((position) => {
        document.getElementById("nome_polo").innerHTML = "Ricerca in corso...";
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        fetch("http://uniroomtn.herokuapp.com/room?lat="+ lat + "&&lng=" + lng)
        .then(ris => {
            let data = ris.json();
            data.then(result => {
                var name = "Aule libere presso: " + result[0].sede;
                document.getElementById("nome_polo").innerHTML = name;
                $.each(result, function (key, val) 
                    {
                    if (val.orario[0]) 
                    {
                        $("#command_table").append("<tr><td>" + val.NomeAula + "</td><td>ora</td><td>" + val.orario[0].from + "</td></tr>");
                    }
                    else 
                    {
                        $("#command_table").append("<tr><td>" + val.NomeAula + "</td><td>ora</td><td>fine giornata</td></tr>");
                    }
                });
            })
            .catch((err) => {
                console.error(err.message);
            })					
        })
    })
    .catch((err) => {
        console.error("Errore nella geolocalizzazione" + err.message);
    });		
}
else {
    location.href = "index.html?q=dc";
}

