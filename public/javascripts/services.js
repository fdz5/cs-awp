'use strict';

angular.module('chat.services', []).service('chatModel', function () {
    var getRooms = function () {
        return [
//            {name: 'Select value', value: ''},
            {name: 'Room 1', value: 'room1'},
            {name: 'Room 2', value: 'room2'},
            {name: 'Room 3', value: 'room3'},
            {name: 'Room 4', value: 'room4'}
        ];
    };
    return { getRooms: getRooms };
});
