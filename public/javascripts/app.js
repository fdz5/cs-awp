$(function () {
    $('#sendForm').submit(function (event) {
		console.log();
		msg = $('#msg').val();
		time = new Date();
		sendMsg(msg, time)
		$('#chat').append(enchanceMsg(msg, time));
		$('#msg').val('');
		$("#chat").scrollTop($("#chat")[0].scrollHeight);
        event.preventDefault();
    });

    $("#chat").html(function () {
        return replaceEmoticons($(this).html());
    });
	
	$('#chat').bind("DOMSubtreeModified",function(){
		console.log('chat change');
		var html = $('#chat').html();
		for (e in emoticons) {
			if (html.indexOf(e) !== -1) {
				$('#chat').html(replaceEmoticons(html));
			}
		}
	});

    $(".emot").click(function () {
        icon = $(this).attr("value");
        $('#msg').val(function (index, val) {
            return val + ' ' + icon;
        });
    });

    $("#roomSelect").change(function () {
		console.log($(this).val());
        if ($(this).val() === 'room1') {
            alert("asdsa");
        }
    });

    var emots = document.querySelectorAll('.emot');
    [].forEach.call(emots, function (emot) {
        emot.addEventListener('dragstart', emotStart, false);
    });

    var chat = document.querySelector('.chat');
    chat.addEventListener('dragover', chatOver, false);
    chat.addEventListener('drop', chatDrop, false);

});

// Text manipulation

function enchanceMsg(msg, time) {
    // TODO format date
	return 'At: ' + time.toUTCString() + '<br />' +
		'<strong>' + $('#user').val()
		+ ': </strong>' + msg + '<hr />';
}

// Ajax calls

function sendMsg(msg, time) {
	json = {
		'room' : $('#roomSelect').val(),
		'user' : $('#user'),
		'msg' : msg,
		'time' : time
	}
    // TODO ajax call
}

// Drag and Drop event functions

function emotStart(e) {
    console.log("dragstart");
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('emot', this.id);
};

function chatDrop(e) {
    // TODO call submit on sendForm
	el = e.dataTransfer.getData('emot');
	time = new Date();
	msg = $('#' + el).attr('value');
	sendMsg(msg, time);
    console.log('chatDrop');
    $("#chat").append(enchanceMsg(msg, time));
}

function chatOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
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
