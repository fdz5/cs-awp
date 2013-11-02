$(function () {

    /** set message time and send it by invoking sendMsg function */
    $('#sendForm').submit(function (event) {
        msg = $('#msg').val();
        time = new Date();
        sendMsg(msg, time)
        event.preventDefault();
    });

    /** listen the chat div for change its html and replace emoticons with their images if so */
    $('#chat').bind("DOMSubtreeModified", function () {
        var html = $('#chat').html();
        for (e in emoticons) {
            if (html.indexOf(e) !== -1) {
                $('#chat').html(replaceEmoticons(html));
            }
        }
    });

    /** add emoticon string representation to msg input text */
    $(".emot").click(function () {
        icon = $(this).attr("value");
        $('#msg').val(function (index, val) {
            return val + ' ' + icon;
        });
    });

    /** listen the roomSelect for change, update global chat num and invoke listening */
    $("#roomSelect").change(function () {
        if (chatRoom !== $(this).val()) {
            chatRoom = $(this).val();
            $('#chat').html('');
            listen(chatRoom);
        }
    });

    /** add drag and drop event to all emoticonst */
    var emots = document.querySelectorAll('.emot');
    [].forEach.call(emots, function (emot) {
        emot.addEventListener('dragstart', emotStart, false);
    });

    /** add drag and drop events to chat div */
    var chat = document.querySelector('.chat');
    chat.addEventListener('dragover', chatOver, false);
    chat.addEventListener('drop', chatDrop, false);

    /** handle incoming messages: add to chat div.
     * Prepend is used in order to keep the latest messages on top,
     * otherwise auto scroll to the bottom of div is mandatory
     * however, it does not work... */
    function addMsg(msg) {
        data = JSON.parse(msg.data);
        $('#chat').prepend(enchanceMsg(data.msg, data.time, data.user));
        $('#msg').val('');
//        $('#chat').scrollTop($('#chat')[0].scrollHeight);
    };

    /** start listening on messages from selected room */
    function listen(room) {
        console.log(room);
        chatFeed = new EventSource("/chatFeed/" + room);
        chatFeed.addEventListener("message", addMsg, false);
    };

});

// Global chat room

var chatRoom;

// Text manipulation

function enchanceMsg(msg, time, user) {
    return '<strong>At</strong>: ' + time + '<br />' +
        '<strong>' + user + ': </strong>' + msg + '<hr />';
}

// Ajax calls

function sendMsg(msg, time) {
    json = {
        room: $('#roomSelect').val(),
        user: $('#user').val(),
        msg: msg,
        time: dtFormat(time)
    }
    console.log(json);
    $.ajax({
        url: '/chat',
        type: "POST",
        data: JSON.stringify(json),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            console.log('success');
        }
    })
}

// Drag and Drop event functions

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
    if ($('#user').val().trim() !== '') {
        el = e.dataTransfer.getData('emot');
        time = new Date();
        msg = $('#' + el).attr('value');
        sendMsg(msg, time);
    } else {
        if ($('#error-ph').html() === '') {
            $('#error-ph').append('<div id="error" class="alert alert-error"><a class="close" data-dismiss="alert">&times;</a><strong>Error!</strong> Please specify your name.</div>');
            $('#error').delay(3500).fadeOut("slow", function () {
                $(this).remove();
            });
        }
    }
    if (e.preventDefault) {
        e.preventDefault();
    }
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    return false;
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
    year = "" + now.getFullYear();
    month = "" + (now.getMonth() + 1);
    if (month.length == 1) {
        month = "0" + month;
    }
    day = "" + now.getDate();
    if (day.length == 1) {
        day = "0" + day;
    }
    hour = "" + now.getHours();
    if (hour.length == 1) {
        hour = "0" + hour;
    }
    minute = "" + now.getMinutes();
    if (minute.length == 1) {
        minute = "0" + minute;
    }
    second = "" + now.getSeconds();
    if (second.length == 1) {
        second = "0" + second;
    }
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}
