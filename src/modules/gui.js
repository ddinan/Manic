window.manic.GUI = (function(manic) {
    'use strict';

    var chatOpen = false;
    var chatbox, chatlog, cursor, debug = null;

    function drawPauseMenu() {
        let container = document.createElement('div');
        container.id = 'pauseMenu';
        container.style.zIndex = '0'; // Hidden by default

        let character = document.createElement('div');
        character.classList.add('character');

        container.appendChild(character);

        let img = document.createElement('img');
        img.src = 'https://i.imgur.com/RAnLDIS.png';

        character.appendChild(img);

        let buttons = document.createElement('div');
        buttons.classList.add('buttons');

        let heading = document.createElement('h1');
        heading.innerText = 'Pause menu';

        buttons.appendChild(heading);
        buttons.appendChild(document.createElement('br'));
        buttons.appendChild(document.createElement('br'));

        let resumeButton = document.createElement('button');
        resumeButton.id = 'resumeButton';
        resumeButton.innerText = 'Resume';

        buttons.appendChild(resumeButton);
        buttons.appendChild(document.createElement('br'));
        buttons.appendChild(document.createElement('br'));

        let buttonsShort = document.createElement('div');
        buttonsShort.classList.add('buttons-short');

        let optionsButton = document.createElement('button');
        optionsButton.id = 'optionsButton';
        optionsButton.innerText = 'Options';

        buttonsShort.appendChild(optionsButton);

        let controlsButton = document.createElement('button');
        controlsButton.id = 'controlsButton';
        controlsButton.innerText = 'Controls';

        buttonsShort.appendChild(controlsButton);

        buttons.appendChild(buttonsShort);
        buttons.appendChild(document.createElement('br'));
        buttons.appendChild(document.createElement('br'));

        let changeTexturesButton = document.createElement('button');
        changeTexturesButton.id = 'changeTexturesButton';
        changeTexturesButton.innerText = 'Change texture pack';

        buttons.appendChild(changeTexturesButton);
        buttons.appendChild(document.createElement('br'));
        buttons.appendChild(document.createElement('br'));

        let mainMenuButton = document.createElement('button');
        mainMenuButton.id = 'mainMenuButton';
        mainMenuButton.innerText = 'Main menu';

        buttons.appendChild(mainMenuButton);

        container.appendChild(buttons);

        document.body.appendChild(container);
    }

    function drawHotbar() {
        let table = document.createElement('table');
        table.id = 'hotbar';
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');

        table.appendChild(thead);
        table.appendChild(tbody);

        document.body.appendChild(table);

        let row = document.createElement('tr');
        let slot1 = document.createElement('th');
        slot1.innerHTML = "1";
        let slot2 = document.createElement('th');
        slot2.innerHTML = "2";
        let slot3 = document.createElement('th');
        slot3.innerHTML = "3";
        let slot4 = document.createElement('th');
        slot4.innerHTML = "4";
        let slot5 = document.createElement('th');
        slot5.innerHTML = "5";
        let slot6 = document.createElement('th');
        slot6.innerHTML = "6";
        let slot7 = document.createElement('th');
        slot7.innerHTML = "7";
        let slot8 = document.createElement('th');
        slot8.innerHTML = "8";
        let slot9 = document.createElement('th');
        slot9.innerHTML = "9";

        row.appendChild(slot1);
        row.appendChild(slot2);
        row.appendChild(slot3);
        row.appendChild(slot4);
        row.appendChild(slot5);
        row.appendChild(slot6);
        row.appendChild(slot7);
        row.appendChild(slot8);
        row.appendChild(slot9);

        thead.appendChild(row);
    }

    function drawDebugMenu() {
        debug = document.createElement('div');
        debug.id = 'debugMenu';

        var coords = document.createElement('p')
        coords.id = 'coords';
        coords.innerText = 'XYZ: -';

        debug.appendChild(coords);
        document.body.appendChild(debug);
    }

    function updateDebugMenu(x, y, z) {
        var coords = document.getElementById('coords');

        x = Math.floor(x);
        y = Math.floor(y - 1.5975); // Not exact but close enough to CC client
        z = Math.floor(z);

        coords.innerText = 'XYZ: ' + x + ', ' + y + ', ' + z;
    }

    function init(sendMessage) {
        drawPauseMenu();
        drawHotbar();
        drawDebugMenu();

        // Cursor
        cursor = document.createElement('img');
        cursor.src = './assets/cursor.png';
        cursor.id = 'cursor';
        document.body.appendChild(cursor);

        // Chat logs
        chatlog = document.createElement('div');
        chatlog.id = 'chatlog';
        document.body.appendChild(chatlog);

        chatbox = document.createElement('input');
        chatbox.type = 'text';
        chatbox.id = 'chatbox';
        chatbox.className = 'hidden text-f';
        document.body.appendChild(chatbox);

        window.onkeypress = function(e) {
            if ((e.charCode || e.keyCode) === 't'.charCodeAt(0)) {
                chatbox.className = 'text-f';
                chatOpen = true;
                chatbox.focus();
            }
        };
        chatbox.onkeydown = function(e) {
            // Return key
            if (e.which === 13) {
                sendMessage(chatbox.value);
                chatbox.value = '';
                chatbox.blur();
                chatbox.className = 'hidden text-f';
                chatOpen = false;
            }

            // Escape key
            if (e.which === 27) {
                chatbox.value = '';
                chatbox.blur();
                chatbox.className = 'hidden text-f';
                chatOpen = false;
            }
        };
    }

    function formatText(target, text) {
        // & is the colour escape character
        var pieces = text.split('&');
        for (var i = 0; i < pieces.length; i++) {
            if (pieces[i].length === 0) {
                continue;
            }

            var element = document.createElement('span');
            // If there was a &
            if (i > 0) {
                element.className = 'text-' + pieces[i][0];
                // Strip &
                pieces[i] = pieces[i].substr(1);
            } else {
                element.className = 'text-f';
            }

            element.textContent = pieces[i];
            target.appendChild(element);
        }
    }

    function chatMessageReceived(text) {
        var message = document.createElement('div');
        formatText(message, text);
        chatlog.appendChild(message);
        chatlog.scrollTop = chatlog.scrollHeight;
    }

    return {
        init: init,
        formatText: formatText,
        chatMessageReceived: chatMessageReceived,
        updateDebugMenu: updateDebugMenu
    };
}(window.manic));