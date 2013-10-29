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
    chat.addEventListener('dragover', charOver, false);
    chat.addEventListener('dragleave', chatLeave, false);
    chat.addEventListener('drop', chatDrop, false);

});

// Drag and Drop helper functions

function emotStart(e) {
    console.log("dragstart");
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
};

function chatDrop(e) {
    console.log('chatDrop');
    $("#chat").text( $("#chat").text + e.attr('value') );
}

function chatLeave(e) {
//    console.log('chatLeave');
}

function charOver(e) {
//    console.log('chatOver');
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

replaceEmoticons('this is a simple test :-) :-| :D :)');


