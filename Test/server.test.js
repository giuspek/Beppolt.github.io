const utilities = require('../server/utilities');
const data = require('./data')

const department_id =
    [("economia","E0101"),
    ("lettere","E0801"),
    ("filosofia","E0801"),
    ("mesiano","E0301"),
    ("ingegneria","E0301"),
    ("giurisprudenza","E0201"),
    ("sociologia","E0601"),
    ("scienze cognitive","E0705"),
    ("povo","E0503")];

//inArray function tests.
test('inArray("E0503") should return true', () => {
    expect(utilities.inArray('E0503')).toBeTruthy();
});

test('inArray("povo") should return false', () => {
    expect(utilities.inArray('povo')).not.toBeTruthy();
});

test('inArray("E0000") should return false', () => {
    expect(utilities.inArray('E0000')).not.toBeTruthy();
});  

test('inArray() to throw error', () => {
    expect(utilities.inArray).toThrow(Error);
}); 

test('inArray(23) to throw TypeError', () => {
    expect(function() {utilities.inArray(23)}).toThrow(TypeError);
}); 



const events = data.all.events;

//getRoomList function tests.
test('expect getRoomList() to throw error', () => {
    expect(utilities.getRoomList).toThrow(Error);
});

test('expect getRoomList(23) to throw TypeError', () => {
    expect(function() {utilities.getRoomList(23)}).toThrow(TypeError);
})

test('expect getRoomList(events) to be equal rooms', () => {
    expect(utilities.getRoomList(events)).toEqual(data.rooms);
})

const input = {};

test('expect getRoomList(input) with input as empty object to return empty array', () => {
    expect(utilities.getRoomList(input)).toEqual([]);
})


//cleanSchedule function tests.
test('expect cleanSchedule() to throw error', () => {
    expect(utilities.cleanSchedule).toThrow(Error);
});

test('expect cleanSchedule(23) to throw TypeError', () => {
    expect(function() {utilities.cleanSchedule(23)}).toThrow(TypeError);
})

test('expect cleanSchedule(input) with input as empty object to return empty object', () => {
    expect(utilities.cleanSchedule(input)).toEqual({});
})

test('expect cleanSchedule(data.rooms) to be equal data.cleanedSchedule', () => {
    expect(utilities.cleanSchedule(data.rooms)).toEqual(data.cleanedSchedule);
})


//getFreeRooms function tests.
test('expect getFreeRooms() to throw error', () => {
    expect(function() {utilities.getFreeRooms()}).toThrow(Error);
});

test('expect getFreeRooms(12,23) to throw TypeError', () => {
    expect(function() {utilities.getFreeRooms(12,23)}).toThrow(TypeError);
})

test('expect getFreeRooms(12,{}) to throw TypeError', () => {
    expect(function() {utilities.getFreeRooms(12,{})}).toThrow(TypeError);
})

test('expect getFreeRooms(input,131234) with input as empty object to return empty object', () => {
    expect(utilities.getFreeRooms(input, 131234)).toEqual({});
})

test('expect getFreeRooms(data.cleanedSchedule) to be equal data.freeRooms', () => {
    expect(utilities.getFreeRooms(data.cleanedSchedule, 1511427600)).toEqual(data.freeRooms);
})

test('expect getFreeRooms(data.cleanedSchedule, -1) to throw Error', () => {
    expect(function() {utilities.getFreeRooms(data.cleanedSchedule, -1)}).toThrow(Error);
})



//cleanPastSchedule function tests.
test('expect cleanPastSchedule() to throw error', () => {
    expect(function() {utilities.cleanPastSchedule()}).toThrow(Error);
});

test('expect cleanPastSchedule(12,23) to throw TypeError', () => {
    expect(function() {utilities.cleanPastSchedule(12,23)}).toThrow(TypeError);
})

test('expect cleanPastSchedule(12,{}) to throw TypeError', () => {
    expect(function() {utilities.cleanPastSchedule(12,{})}).toThrow(TypeError);
})

test('expect cleanPastSchedule(data.freeRooms, -1) to throw Error', () => {
    expect(function() {utilities.cleanPastSchedule(data.freeRooms, -1)}).toThrow(Error);
})

test('expect cleanPastSchedule(data.freeRooms) to be equal data.afterCleanPastSchedule', () => {
    expect(utilities.cleanPastSchedule(data.freeRooms, 1511442099)).toEqual(data.afterCleanPastSchedule);
})


//idRoomCode function tests.
const url = "https://easyroom.unitn.it/Orario/rooms_call.php?form-type=rooms&sede=E0503&_lang=it&date=20-12-2017"

test('expect idRoomCode() to throw error', () => {
    expect(function() {utilities.idRoomCode()}).toThrow(Error);
});

test('Wrong url(wer.lol) as idRoomCode parameter should catch error', () => {
    return utilities.idRoomCode('wer.lol').catch(e => expect(e).toMatch(e));
  });

test('expect idRoomCode() to throw error', () => {
    expect(typeof utilities.idRoomCode(url)).toBe("object");
});  

test('expect idRoomCode(url) to be equal data.roomCode', () => {
    return utilities.idRoomCode(url).then(response => {
        expect(response).toEqual(data.roomCode);
    });
});


//getRoomSchedule function tests.
test('expect getRoomSchedule() to throw error', () => {
    expect(function() {utilities.getRoomSchedule()}).toThrow(Error);
});

test('expect getRoomSchedule(data.all.events, {}) to throw error', () => {
    expect(function() {utilities.getRoomSchedule(data.all.events,{})}).toThrow(TypeError);
});

test('expect getRoomSchedule(data.eventi, 440) to be data.scheduleA106', () => {
    expect(utilities.getRoomSchedule(data.eventi,440)).toEqual(data.scheduleA106);
});

test('expect getRoomSchedule({}, 440) to send "Nessuna lezione oggi in questa aula"', () => {
    expect(utilities.getRoomSchedule({},440)).toEqual("Nessuna lezione oggi in questa aula");
});