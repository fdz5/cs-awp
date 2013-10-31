/**
 * Created with IntelliJ IDEA.
 * User: fdziedzic
 * Date: 29.10.13
 * Time: 17:33
 * To change this template use File | Settings | File Templates.
 */

$(function () {
    $("#sendForm").submit(function (event) {
        alert("asda");
        event.preventDefault();
    });

    $("#chat").html(function () {
        return replaceEmoticons($(this).html());
    });
	
	$('#chat').bind("DOMSubtreeModified",function(){
		// TODO replace emots
		console.log('change chat');
		html = $(this).html();
		$(this).innerHTML = replaceEmoticons(html);
	});

    $(".emot").click(function () {
        icon = $(this).attr("value");
        $("#textField").val(function (index, val) {
            return val + ' ' + icon;
        });
    });

    $("#roomSelect").change(function () {
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
    chat.addEventListener('dragleave', chatLeave, false);
    chat.addEventListener('drop', chatDrop, false);

});

// Drag and Drop event functions

function emotStart(e) {
    console.log("dragstart");
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('emot', this.id);
};

function chatDrop(e) {
    console.log('chatDrop');
	el = e.dataTransfer.getData('emot');
    $("#chat").append($('#' + el).attr('value'));
	$('#chat').append('<br /><hr />');
}

function chatLeave(e) {
}

function chatOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    return false;
}

// Emoticons tranformations

function replaceEmoticons(text) {
    var emoticons = {
            ':D': 'emot03.png',
            ':-)': 'emot09.png',
            ':o': 'emot11.png',
            ':<3': 'emot14.png',
            ':)': 'emot15.png',
            ':-?': 'emot17.png'
        }, url = "./assets/images/", patterns = [],
        metachars = /[[\]{}()*+?.\\|^$\-,&#\s]/g;

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


