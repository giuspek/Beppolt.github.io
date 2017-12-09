var department_id =[("economia","E0101"),
("lettere","E0801"),
("filosofia","E0801"),
("mesiano","E0301"),
("ingegneria","E0301"),
("giurisprudenza","E0201"),
("sociologia","E0601"),
("scienze cognitive","E0705"),
("povo","E0503")];

var depIdToName = {
    'E0101': 'economia',
    'E0801': 'lettere',
    'E0801': 'filosofia',
    'E0301': 'ingegneria',
    'E0201': 'giurisprudenza',
    'E0601': 'sociologia',
    'E0705': 'scienze cognitive',
    'E0503': 'povo'
}
var dep_id = {
    "economia":"E0101",
    "lettere":"E0801",
    "filosofia":"E0801",
    "mesiano":"E0301",
    "ingegneria":"E0301",
    "giurisprudenza":"E0201",
    "sociologia":"E0601",
    "scienze cognitive":"E0705",
    "povo":"E0503"};

var dep_coordinates = {
"E0601" : {latitude:46.06666060000001, longitude:11.1196512},
"E0705" : {latitude:45.89370539999999, longitude:11.0435276},
"E0101" : {latitude:46.0662709, longitude:11.1176511},
"E0201" : {latitude:46.0669596, longitude:11.1195936},
"E0801" : {latitude:46.0677156, longitude:11.1166435},
"E0301" : {latitude:46.06551,longitude:11.1407375},
"E0503" : {latitude:46.067012, longitude:11.1499029}
};

module.exports = {department_id, dep_coordinates , dep_id, depIdToName};
