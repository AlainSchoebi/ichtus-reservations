var textToolTipGuest = "Un non-membre doit toujours être accompagné par un membre d'Ichtus. <br/> Il n'a donc pas le droit d'aller seul.";
var textToolTipUser = "Sortie pour les membres d'Ichtus<br/><br/>";

function loadActualBookings(_actualBookings) {
    Cahier.actualBookings = _actualBookings;

    $('divTabCahierTableActualBookings').previousElementSibling.innerHTML = "Sorties en cours (" + _actualBookings.length + ")";

    var children = $('divTabCahierTables').children;
    for (var i = 0; i < children.length; i++) {
        if (children[i].id != "divTabCahierTableActualBookings" && children[i].id != "inputTabCahierActualBookingsSearch" && children[i].id != "divTabCahierActualBookingsSearchTitle" && children[i].id != "divTabCahierAlertButtonsLegend") {
            $('divTabCahierTables').removeChild(children[i]);
            i--;
        }
    }

    Cahier.finishedBookings = [];

    newBookingTable(new Date(), "Sorties terminées");// tables sorties finies

    $('inputTabCahierActualBookingsSearch').value = "";

    actualizeActualBookings(Cahier.actualBookings);
}

function actualizeActualBookings(_actualBookings) {

    var all = $('divTabCahierTableActualBookings').getElementsByClassName("TableEntries");
    for (var i = 0; i < all.length; i++) {
        if (all[i].id != "divTabCahierTableActualBookingsTopBar") {
            all[i].parentNode.removeChild(all[i]);
            i--;
        }
    }

    if (_actualBookings.length == 0) {
        var entry = div($('divTabCahierTableActualBookings'));

        entry.classList.add("TableEntries");
        entry.classList.add("TableEntriesHover");

        var cell = div(entry);
    }

    for (var i = 0; i < _actualBookings.length; i++) {

        var container = div($('divTabCahierTableActualBookings'));

        container.id = i;
        container.classList.add("TableEntries");
        container.classList.add("TableEntriesHover");

        container.addEventListener("click", function (event) {

            if (event.target.classList.contains("Buttons")) {
                popBookingFinish(_actualBookings[this.id]);
            }
            else if (event.target.parentElement.classList.contains("TableEntriesBookableBox") || event.target.parentElement.parentElement.classList.contains("TableEntriesBookableBox")) {
                // do nothing
            }
            else if (typeof event.target.getElementsByTagName("div")[0] != "undefined") {
                if (event.target.getElementsByTagName("div")[0].classList.contains("Buttons")) {
                    popBookingFinish(_actualBookings[this.id]);
                }
                else {
                    popBookingInfos(_actualBookings[this.id]);
                }
            }
            else {
                popBookingInfos(_actualBookings[this.id]);
            }
        });

        var divDate = div(container);

        var maxHours = 24;
        if (Date.now() - (new Date(_actualBookings[i].startDate)).getTime() > maxHours/6 * 60 * 60 * 1000) {

            var d = div(divDate);
            d.classList.add('TableEntriesAlert');
            d.style.filter = "grayscale(1) invert(1)";
            d.title = "+ de 4 heures";
            divDate.title = "+ de 4 heures";

            if (Date.now() - (new Date(_actualBookings[i].startDate)).getTime() > maxHours/2 * 60 * 60 * 1000) {
                d.style.filter = "none";
                d.style.filter = "grayscale(1)";
                d.title = "+ de 12 heures";
                divDate.title = "+ de 12 heures";
            }

            if (Date.now() - (new Date(_actualBookings[i].startDate)).getTime() > maxHours * 60 * 60 * 1000) {
                d.style.filter = "none";
                d.title = "+ de 24 heures";
                divDate.title = "+ de 24 heures";
            }
        }


        divDate.id = "SORTING" + (new Date(_actualBookings[i].startDate)).toISOString(); // for the sorting
        divDate.innerHTML += (new Date(_actualBookings[i].startDate)).getNiceTime(":", true);


        var participantCount = div(container);
        participantCount.innerHTML = _actualBookings[i].participantCount;
        participantCount.title = Cahier.getSingularOrPlural(_actualBookings[i].participantCount);

        div(container).innerHTML = Cahier.getOwner(_actualBookings[i],true);

        if (_actualBookings[i].bookables.length == 0) {
            createBookingBookableBox(div(container));
        }
        else {
            var c = div(container);
            for (let k = 0; k < _actualBookings[i].bookables.length; k++) {
                createBookingBookableBox(c, _actualBookings[i].bookables[k]);
            }
        }

        div(container).innerHTML = _actualBookings[i].destination.shorten(150,16);

        div(container).innerHTML = getStartCommentFromBooking(_actualBookings[i]).shorten(200, 16);

        var c = div(container);
        c.title = "Terminer cette sortie";
        var btn = div(c);
        btn.classList.add("Buttons");
    }

    sortTable($('divTabCahierTableActualBookings'));
}


// new search system
function bookingTableSearch(_table) {

    var bookings;
    txts = _table.previousElementSibling.previousElementSibling.value.split(" ");
    // means finishedBookings
    if (_table != $('divTabCahierTableActualBookings'))  {
        var all = document.getElementsByClassName("BookingsTable");
        for (var i = 1; i < all.length; i++) {
            if (all[i] == _table) {
                break;
            }
        }
        bookings = Cahier.finishedBookings[i - 1];
    }
    else { // means actualBookings
        bookings = Cahier.actualBookings;
    }
    var result = [];

    for (let t = 0; t < txts.length; t++) {
        result[t] = [];
        for (let b = 0; b < bookings.length; b++) {

            var add = false;

            if (bookings[b].owner.name.toUpperCase().includes(txts[t].toUpperCase())) {
                add = true;
            }
            else if ((new Date(bookings[b].startDate)).getNiceTime(":", true).includes(txts[t].toUpperCase())) {
                add = true;
            }
            else if ((new Date(bookings[b].endDate)).getNiceTime(":", true).includes(txts[t].toUpperCase())) {
                add = true;
            }
            else if (bookings[b].destination.toUpperCase().includes(txts[t].toUpperCase())) {
                add = true;
            }
            else if (bookings[b].startComment.toUpperCase().includes(txts[t].toUpperCase())) {
                add = true;
            }
            else if (bookings[b].endComment.toUpperCase().includes(txts[t].toUpperCase())) {
                add = true;
            }
            else if (bookings[b].participantCount.toString().includes(txts[t])) {
                add = true;
            }
            else {
                for (let e = 0; e < bookings[b].bookables.length; e++) {
                    if (bookings[b].bookables[e].name.toUpperCase().includes(txts[t].toUpperCase())) {
                        add = true;
                        break;
                    }
                    else if (bookings[b].bookables[e].code.toUpperCase().includes(txts[t].toUpperCase())) {
                        add = true;
                        break;
                    }
                }
            }
            if (add) {
                result[t].push(bookings[b]);
            }
        }
    }

    // merge but only take the bookings which are in every search result !
    var send = result.mergeAND();
    if (_table == $('divTabCahierTableActualBookings')) {
        actualizeActualBookings(send);
    }
    else {
        actualizeFinishedBookingListForDay(send, _table);
    }
}



function createBookingBookableBox(elem, bookable = {code:"ZZZ"}) {

    var d = div(elem);

    var img = div(d);

    d.id = bookable.code;
    var code = div(d);

    if (bookable == Cahier.personalBookable) {
        img.style.backgroundImage = "url(img/icons/own-sail.png)";
        code.style.backgroundImage = "none";
        code.innerHTML = Cahier.personalBookable.name;
        code.style.margin = "0px";
        code.style.fontSize = "16px";
        code.style.lineHeight = "35px";
        d.style.cursor = "unset";
        d.id = "ZZZZ"; // // to be at the bottom of the list
        d.style.backgroundColor = "transparent";
    }
    else {
        d.onclick = function () {
            popBookable(bookable.id);
        };
        img.style.backgroundImage = Cahier.getImageUrl(bookable,35);
        code.innerHTML = bookable.code;
        if (bookable.code.length > 2) {
            div(d).innerHTML = bookable.name.shorten(120, 18);
        }
        else {
            div(d).innerHTML = bookable.name.shorten(150, 18);
        }
    }

    elem.classList.add("TableEntriesBookableBox");
}


function loadTableTopBars(allTables = document.getElementsByClassName("BookingsTable")) {

    for (var u = 0; u < allTables.length; u++) {

        var table = allTables[u];
        var top = table.getElementsByClassName("TableTopBar")[0];
        var all = top.getElementsByTagName("div");

        for (var i = 0; i < all.length; i = i + 2) {
            all[i].getElementsByTagName("div")[0].style.backgroundImage = "url(img/icons/sort-asc.png)";

            if (!(all[i].parentElement.id == 'divTabCahierTableActualBookingsTopBar' && all[i].id == '6')) { // not sort finish buttons

                all[i].addEventListener("click", function () {

                    if (this.getElementsByTagName("div")[0].style.backgroundImage == 'url("img/icons/sort-desc.png")' || !(this.classList.contains("BookingsTopBarSorted"))) {
                        this.getElementsByTagName("div")[0].style.backgroundImage = "url(img/icons/sort-asc.png)";
                        order = 1;
                    }
                    else {
                        this.getElementsByTagName("div")[0].style.backgroundImage = "url(img/icons/sort-desc.png)";
                        order = -1;

                    }

                    var allButtons = this.parentElement.getElementsByTagName("div");
                    for (var k = 0; k < all.length; k = k + 2) {
                        if (allButtons[k] != this) {
                            allButtons[k].classList.remove("BookingsTopBarSorted");
                            allButtons[k].getElementsByTagName("div")[0].style.backgroundImage = "url(img/icons/sort-asc.png)";
                        }
                    }
                    this.classList.add("BookingsTopBarSorted");

                   sortTable(this.parentElement.parentElement);
                });

            }
        }
    }
}

function sortTable(table) {

    var field = parseInt(table.getElementsByClassName("BookingsTopBarSorted")[0].id);
    var order = function () {
        if (table.getElementsByClassName("BookingsTopBarSorted")[0].getElementsByTagName("div")[0].style.backgroundImage == 'url("img/icons/sort-desc.png")') {
            return -1;
        }
        else {
            return 1;
        }
    };

  //  //console.log("table.id: " + table.id, "field: " + field, "order: " + order());

    var all = table.getElementsByClassName("TableEntries");
    var switching = true;
    while (switching) {
        switching = false;
        for (var i = 1; i < all.length - 1; i++) {
            if (getSortingText(all[i].children[field]) > getSortingText(all[i + 1].children[field]) && order() == 1 || getSortingText(all[i].children[field]) < getSortingText(all[i + 1].children[field]) && order() == -1) {
                all[i].parentElement.insertBefore(all[i + 1], all[i]);
                switching = true;
            }
        }
    }
}

function getSortingText(elem) {
    if (elem.id.indexOf("SORTING") == 0) {
        return elem.id;
    }
    else {
        return elem.innerHTML.toUpperCase();
    }
}




function newBookingTable(date,title = "?") {
    if (title == "?"){title = date.getNiceDate();}
    Requests.getFinishedBookingListForDay(date, undefined,title);

    $('divTabCahierButtonMoreBookingsContainer').getElementsByTagName("div")[0].id = date.getPreviousDate();
    $('divTabCahierButtonMoreBookingsContainer').getElementsByTagName("div")[0].innerHTML = "Charger les sorties du " + date.getPreviousDate().getNiceDate(true);
}



function createBookingsTable(date,title) {

    var input = document.createElement("input");
    input.type = "text";
    input.value = "";
    input.spellcheck = "false";
    input.placeholder = "Rechercher";
    input.onkeyup = function () {
        bookingTableSearch(table);
    };
    $('divTabCahierTables').appendChild(input);

    var t = div($('divTabCahierTables'));
    t.classList.add("BookingsTableText");
    if (title == "?") {
        title = date.getNiceDate();
    }
    t.innerHTML = title;

    var table = div($('divTabCahierTables'));
    table.id = date.toISOString();
    table.classList.add("BookingsTable");

    var topBar = div(table);
    topBar.classList.add("TableEntries");
    topBar.classList.add("TableTopBar");

    var fields = ["", "", "", "Responsable", "Embarcation", "Destination", "Commentaire de départ", "Commentaire d'arrivée"];
    var images = ["icons/start", "icons/end","icons/participant-count","icons/responsible","icons/sail", "icons/destination", "icons/start-comment", "icons/end-comment"];

    for (var i = 0; i < fields.length; i++) {
        var d = div(topBar);
        d.id = i;
        div(d);
        var img = document.createElement("img");
        img.src = "img/" + images[i] + ".png";
        img.alt = "?";
       // img.style.width = "25px";
       // img.style.marginRight = "5px";
        d.appendChild(img);
        d.innerHTML += fields[i];
    }

    topBar.getElementsByTagName("div")[0].classList.add("BookingsTopBarSorted");

    var b = div(table);
    b.style.position = "absolute";
    b.style.width = "100%";
    b.style.height = "2px";
    b.style.backgroundColor = "gray";
    b.style.zIndex = "2";


    loadTableTopBars([table]);

    return table;
}

function createNoBookingMessage(date) {
    var t = div($('divTabCahierTables'));
    t.classList.add("BookingsTableTextNoBooking");
    t.innerHTML = "Aucune sortie le "+ date.getNiceDate();
}

function actualizeFinishedBookingListForDay(bookings,table) {

    var all = table.getElementsByClassName("TableEntries");
    for (var i = 0; i < all.length; i++) {
        if (all[i].classList.contains("TableTopBar") == false) {
            all[i].parentNode.removeChild(all[i]);
            i--;
        }
    }

    if (bookings.length == 0) {
        var entry = div(table);

        entry.classList.add("TableEntries");
        entry.classList.add("TableEntriesHover");

        var cell = div(entry);
    }
    else {
        for (var i = 0; i < bookings.length; i++) {

            var entry = div(table);

            entry.id = i;
            entry.classList.add("TableEntries");
            entry.classList.add("TableEntriesHover");

            entry.addEventListener("click", function (event) {
                 if (!(event.target.parentElement.classList.contains("TableEntriesBookableBox") || event.target.parentElement.parentElement.classList.contains("TableEntriesBookableBox"))) {
                     popBookingInfos(bookings[this.id]);
                }

            });

            div(entry).innerHTML = (new Date(bookings[i].startDate)).getNiceTime(":", true);
            div(entry).innerHTML = (new Date(bookings[i].endDate)).getNiceTime(":", true);

            div(entry).innerHTML = bookings[i].participantCount;

            div(entry).innerHTML = Cahier.getOwner(bookings[i],true);


            if (bookings[i].bookables.length == 0) {
                createBookingBookableBox(div(entry));
            }
            else {
                var c = div(entry);
                for (let k = 0; k < bookings[i].bookables.length; k++) {
                    createBookingBookableBox(c, bookings[i].bookables[k]);
                }
            }

            div(entry).innerHTML = bookings[i].destination.shorten(150, 16);
            div(entry).innerHTML = getStartCommentFromBooking(bookings[i]).shorten(200, 16);; // "".shorten(200, 200);//getStartCommentFromBooking(bookings[i]);//.startComment.shorten(200, 20); // BIZARRRRERELRKJASéDL KFJASéDLF JKAéSLDKFJ
            div(entry).innerHTML = getEndCommentFromBooking(bookings[i]).shorten(200,16);//.endComment.shorten(200, 20);

        }

        sortTable(table);
    }
}




