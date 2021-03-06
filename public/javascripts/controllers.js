'use strict';

/** Controllers */
angular.module('chat.controllers', ['chat.services']).
    controller('ChatCtrl', function ($scope, $http, chatModel, $sce) {
        $scope.rooms = chatModel.getRooms();
        $scope.msgs = [];
        $scope.msg = "";
        $scope.user = "Joe";
        $scope.room = $scope.rooms[0];

        /** change current room, restart EventSource connection */
        $scope.setCurrentRoom = function (room) {
            $scope.room = room;
            if ($scope.chatFeed) {
                $scope.chatFeed.close();
            }
            $scope.msgs = [];
            $scope.listen();

        };

        /** add emoticon string representation to msg input text */
        $scope.emot = function ($event) {
            var icon = $event.target.getAttribute("value");
            $scope.msg = $scope.msg + ' ' + icon;
        }

        /** posting chat text to server */
        $scope.submit = function () {
            console.log("sending message");
            $http.post("/chat", {
                room: $scope.room.value,
                user: $scope.user,
                msg: $scope.msg,
                time: dtFormat(new Date())
            });
            $scope.msg = "";
        };

        /** handle incoming messages: add to messages array */
        $scope.addMsg = function (message) {
            var data = JSON.parse(message.data);
            $scope.$apply(function () {
                $scope.msgs.push($sce.trustAsHtml(
                    enchanceMsg(replaceEmoticons(data.msg), data.time, data.user)
                ));
            });
            $('#chat').scrollTop($('#chat')[0].scrollHeight);
        };

        /** start listening on messages from selected room */
        $scope.listen = function () {
            $scope.chatFeed = new EventSource("/chatFeed/" + $scope.room.value);
            $scope.chatFeed.addEventListener("message", $scope.addMsg, false);
        };

        // Drag and Drop event functions

        /** add drag and drop event to all emoticonst */
        var emots = document.querySelectorAll('.emot');
        [].forEach.call(emots, function (emot) {
            emot.addEventListener('dragstart', emotStart, false);
        });

        /** add drag and drop events to chat div */
        var chat = document.querySelector('.chat');
        chat.addEventListener('dragover', chatOver, false);
        chat.addEventListener('drop', chatDrop, false);

        function emotStart(e) {
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('emot', this.id);
        };

        function chatOver(e) {
            if (e.preventDefault) e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        }

        function chatDrop(e) {
            if (e.stopPropagation) e.stopPropagation();
            var el = e.dataTransfer.getData('emot');
            if ($scope.user != null && $scope.room != null) {
                $scope.msg = angular.element('#' + el).attr('value');
                $scope.submit();
            } else {
                alert("Please specify name");
            }
            if (e.preventDefault) {
                e.preventDefault();
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            return false;
        }

        $scope.listen();

    });

// Text manipulation

function enchanceMsg(msg, time, user) {
    return '<strong>at</strong>: ' + time + '<br>' +
        '<strong>' + user + ': </strong>' + msg + '<hr />';
}

// Emoticons tranformations

var emoticons = {
    ':D': 'emot03.png',
    ':-)': 'emot09.png',
    ':o': 'emot11.png',
    ':&lt;3': 'emot14.png',
    ':)': 'emot15.png',
    ':-?': 'emot17.png'
};

function replaceEmoticons(text) {
    var url = "./assets/images/";
    var patterns = [];
    var metachars = /[[\]{}()*+?.\\|^$\-,&#\s]/g;

    // build a regex pattern for each defined property
    for (var i in emoticons) {
        if (emoticons.hasOwnProperty(i)) { // escape metacharacters
            patterns.push('(' + i.replace(metachars, "\\$&") + ')');
        }
    }

    // build the regular expression and replace
    return text.replace(new RegExp(patterns.join('|'), 'g'), function (match) {
        return typeof emoticons[match] != 'undefined' ?
            '<img src="' + url + emoticons[match] + '" width="40" height="40" />' :
            match;
    });
}

// Date formatter...

function dtFormat(now) {
    var year = "" + now.getFullYear();
    var month = "" + (now.getMonth() + 1);
    if (month.length == 1) {
        month = "0" + month;
    }
    var day = "" + now.getDate();
    if (day.length == 1) {
        day = "0" + day;
    }
    var hour = "" + now.getHours();
    if (hour.length == 1) {
        hour = "0" + hour;
    }
    var minute = "" + now.getMinutes();
    if (minute.length == 1) {
        minute = "0" + minute;
    }
    var second = "" + now.getSeconds();
    if (second.length == 1) {
        second = "0" + second;
    }
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}
