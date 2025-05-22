// ==UserScript==
// @name         FF Cytube Script
// @namespace    http://tampermonkey.net/
// @version      2025-05-22
// @description  enhanced functionality for the FF CyTube channel
// @author       Awaclus
// @match        https://cytu.be/r/Fancutfags
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cytu.be
// @grant        none
// ==/UserScript==

var $ = window.jQuery;

(function() {
    'use strict';

    //NND
    $.get('https://cdn.jsdelivr.net/gh/deerfarce/cytube-nnd-chat@master/index.js');

    var ADDONESECOND = '';

    // Clock above chat
    let clockInterval = 0;
    const chatClock = document.createElement('p');
    chatClock.id = 'chatClock';
    chatClock.style.flexGrow = '2';
    chatClock.style.fontFamily = 'Atkinson Hyperlegible Mono';
    chatClock.style.transform = 'scaleX(0.7)';
    document.getElementById("usercount").insertAdjacentElement('afterend', chatClock);

    const setChatClock = () => {
        const clockDate = new Date();
        const localTime = clockDate.toLocaleTimeString("JPN");
        const UTCTime = clockDate.toLocaleTimeString("JPN", {timeZone: 'UTC'});

        chatClock.innerText = `Local ${localTime} | UTC ${UTCTime}`;
    }

    setChatClock();
    clockInterval = setInterval(setChatClock, 1000);

    // megucas
    Callbacks.usercount = function(count) {
        CHANNEL.usercount = count;
        var text = count + " meguca";
        if(count != 1) {
            text += "s";
        }
        $("#usercount").text(text);
    };
    Callbacks.usercount(CHANNEL.usercount);


    //videotime
    function getVideoTime(data) {
	clearInterval(ADDONESECOND);
	var hour = Math.floor(data.currentTime / 3600);
	var minute = Math.floor(data.currentTime / 60 % 60);
	var second = Math.floor(data.currentTime % 60);
	second < 10 ? second = '0' + second : '';
	if (hour === 0) {
		$("#findtime").text(minute + ':' + second);
	} else {
		minute < 10 ? minute = '0' + minute : '';
		$("#findtime").text(hour + ':' + minute + ':' + second);
	}
	ADDONESECOND = setInterval(function() {
		if (!PLAYER.paused) {
			second = parseInt(second, 10) + 1;
			minute = parseInt(minute, 10);
			if (second === 60) {
				second = 0;
				minute++;
				if (minute === 60) {
					minute = 0;
					hour = parseInt(hour, 10) + 1;
				}
			}
			second < 10 ? second = '0' + second : '';
			if (hour === 0) {
				$("#findtime").text(minute + ':' + second);
			} else {
				minute < 10 ? minute = '0' + minute : '';
				$("#findtime").text(hour + ':' + minute + ':' + second);
			}
		}
	}, 1000);
}

    let currenttimebtn = $('<button id="findtime" class="pointer label label-default" style="width: 120px;" title="Display current video time without loading the video">Show video time</button>')
	.appendTo("#chatheader")
	.on("click", function() {
		if ($(this).text() !== 'Show video time') {
			$(this).text('Show video time');
			clearInterval(ADDONESECOND);
			socket.removeListener("mediaUpdate", getVideoTime);
		} else {
			getVideoTime({currentTime:getCurrentPlayerTime()});
			socket.on("mediaUpdate", getVideoTime);
		}
});

    function getCurrentPlayerTime() {
	try {
		if (typeof PLAYER.player !== "undefined") {
			return PLAYER.player.currentTime(); // "FilePlayer, Vimeo"
		} else if (typeof PLAYER.yt !== "undefined") { // "YouTube"
			return PLAYER.yt.getCurrentTime(); // "YouTube"
		} else if (typeof PLAYER.dm !== "undefined") {
			return PLAYER.dm.currentTime; // "Daily Motion"
		} else {
			return CurrentVideoTime; // default to variable
		}
	} catch {
		return CurrentVideoTime;
	}
}

var CurrentVideoTime = 0;

    // Favicon
    const favicon=document.createElement('link');
    favicon.id='favicon';
    favicon.rel='shortcut icon';
    favicon.type='image/x-icon';
    favicon.sizes='64x64';
    favicon.href=`https://ffclock.awaclus.eu/favicon.ico`;
    document.head.appendChild(favicon);



    // Keybinds
    var keyHeld = false; //control keypress rapidfire
    $(window).bind('keyup', function(){ keyHeld=false; });

    $(window).bind('keydown', function(event) {
        var inputBox = document.getElementById("chatline");
        var inputVal = inputBox.value;

        if (event.ctrlKey && !event.shiftKey){
            switch (String.fromCharCode(event.which).toLowerCase()) {
            case 'a': { //Select input box
                // Check if we already have some form of text input focused
                const INPUT_TAGS = ["INPUT", "TEXTAREA"];
                if (INPUT_TAGS.includes(document.activeElement.tagName)) return;

                event.preventDefault();
                if(!keyHeld){
                    keyHeld=true;
                    inputBox.focus();
                    inputBox.setSelectionRange(0,inputVal.length);
                }

                break; }
            case 's': { //spoiler
                if (!keyHeld) {
                    keyHeld=true;
                    event.preventDefault();
                    var selSt = inputBox.selectionStart;
                    var selEnd = inputBox.selectionEnd;

                    if (inputBox === document.activeElement) {
                        if(inputBox.selectionStart == inputBox.selectionEnd) {
                            inputBox.value = inputVal.substring(0,selSt) +"[sp]"+ inputVal.substring(selSt,selEnd) +"[/sp]"+inputVal.substring(selEnd,inputVal.length);
                            inputBox.setSelectionRange(selSt +4,selSt +4);
                        } else if (inputBox.selectionStart < inputBox.selectionEnd) {
                            inputBox.value = inputVal.substring(0,selSt) +"[sp]"+ inputVal.substring(selSt,selEnd) +"[/sp]"+inputVal.substring(selEnd,inputVal.length);
                            inputBox.setSelectionRange(selEnd+9,selEnd+9);
                        }
                    }
                }

                break; }

            }
        }
    });



    //hover options button (actual effect is in CSS)
    let hoveroptionsbtn = $('<button id="hoveroptions" class="pointer label label-default" style="width: 100px;" title="Toggle emote hover mode left/right/chat/off">Left hover</button>')
	.appendTo("#chatheader")
	.on("click", function() {
		if ($(this).text() == 'Left hover') {
			$(this).text('Right hover');
            document.getElementById("messagebuffer").classList.add("hoverlarge");
		} else if ($(this).text() == 'Right hover') {
            $(this).text('Chat hover');
            document.getElementById("messagebuffer").classList.remove("hoverlarge");
            document.getElementById("messagebuffer").classList.add("hovertraditional");
            document.getElementById("messagebuffer").classList.add("hovernone");
        } else if ($(this).text() == 'Chat hover') {
            $(this).text('No hover');
            document.getElementById("messagebuffer").classList.remove("hovertraditional");
        } else {
            $(this).text('Left hover');
            document.getElementById("messagebuffer").classList.remove("hovernone");
        }
});




})();