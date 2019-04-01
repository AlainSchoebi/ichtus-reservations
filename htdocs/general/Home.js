// shortucts
function $(id) {
    return document.getElementById(id);
}
function div(loc) {
    var x = document.createElement("div");
    loc.appendChild(x);
    return x;
}
function input(loc,_placeholder = "") {
    var x = document.createElement("input");
    x.autocomplete = "off";
    x.type = "text";
    x.spellcheck = "false";
    x.placeholder = _placeholder;
    loc.appendChild(x);
    return x;
}
function br(loc) {
    var x = document.createElement("br");
    loc.appendChild(x);
}

//Load
function load() {
    currentTabElement = $("divTabCahier");
    actualizeTime();
    setInterval(actualizeTime, 5000);  //5 secondes
    createProgressBar();
    createAllPropositions();
    window.location = "#" + "divTabCahier";
    loadReturnButtons();
    popUser(0, $("divTabCahierMemberContainer"));

    loadTableTopBars();
    loadCahierEquipmentChoice();
    loadEscListener();

    //SERVER
    ServerInitialize();
    Requests.checkLogin();
    loadBottoms();

    loadMateriel();
}

// too complicated now...
//function loadButtonFocus() {
//    var btn = document.getElementsByClassName('ValidateButtons');
//    for (var i = 0, len = btn.length; i < len; i++) {
//        btn[i].setAttribute('tabindex', '0');
//    }
//}

var Time = {
    getActualMinutes: function (m = date.getMinutes()) {
        if (m < 10) {
            x = "0" + m;
        }
        else {
            x = m.toString();
        }
        return x;
    }
};


Date.prototype.getNiceTime = function (separator = ":", addZero = false) {
    if (addZero == true && this.getHours() < 10) {
        return Time.getActualMinutes(this.getHours()) + separator + Time.getActualMinutes(this.getMinutes());
    }
    else {
        return this.getHours() + separator + Time.getActualMinutes(this.getMinutes());
    }
};
Date.prototype.getNiceDate = function (substr = false, year = false) {
    var r = "";
    if (substr) {
        r = Jours[this.getDay()] + " " + this.getDate() + " " + Mois[this.getMonth()].substring(0,3);
    }
    else {
        r = Jours[this.getDay()] + " " + this.getDate() + " " + Mois[this.getMonth()];
    }
    if (year) {
        r += " " + this.getFullYear();
    }
    return r;
};

Date.prototype.getPreviousDate = function () {
    var yesterday = new Date(this);
    yesterday.setDate(this.getDate() - 1);
    return yesterday;
};

function DeleteObjects() {
    for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] != "undefined" && typeof arguments[i].parentElement != "undefined" && arguments[i].parentElement != null) {
            arguments[i].parentElement.removeChild(arguments[i]);
        }
        else {
            //console.log("tried to delete a non-existent object");
        }
    }
}


//Time
var date;
var Jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
var Mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
function actualizeTime() {
    date = new Date();
    $("divTopBarTime").innerHTML = date.getNiceTime() + "<br/>" + date.getNiceDate(true); //.substring(0, 3)
}


// 1 -> checked //  0 --> not
function check(checkParent) {
    if (checkParent.getElementsByClassName('checkBox')[0].id == undefined || checkParent.getElementsByClassName('checkBox')[0].id == 1) {
        checkParent.getElementsByClassName('checkBox')[0].id = 0;
        checkParent.getElementsByClassName('checkBox')[0].style.backgroundImage = 'none';
    }
    else {
        checkParent.getElementsByClassName('checkBox')[0].id = 1;
        checkParent.getElementsByClassName('checkBox')[0].style.backgroundImage = 'url(img/icons/check-black.png)';
    }
}

function loadReturnButtons() {
    var allReturnButtons = document.getElementsByClassName("ReturnButtons");
    for (var i = 0; i < allReturnButtons.length; i++) {
        allReturnButtons[i].title = "Retour";
    }
}


var lastModals = 0;
function openPopUp() {

    var modal = div(document.body);
    modal.onclick = function (event) {
        closePopUp(event);
    };
    lastModals++;
    modal.id = "divModal" + lastModals;
    modal.classList.add("Modals");
    modal.style.display = "block";
    setTimeout(function () { modal.style.opacity = 1; }, 10);

    $('divScreen').classList.add("Blur");
    $('divTopBar').classList.add("Blur");

    return modal;
}
function closePopUp(e) {
    var t = false;
    if (e == "last") {
        if (lastModals != 0) {
            t = true;
        }
    }
    else if (e.target.id.indexOf("divModal") != -1) {
        t = true;
    }
    if (t) {
        var modal = $('divModal' + lastModals);
        modal.style.opacity = 0;
        setTimeout(function () { modal.style.display = 'none'; modal.innerHTML = ""; modal.parentNode.removeChild(modal); }, 100);

        lastModals--;

        if (lastModals == 0) {
            $('divScreen').classList.remove("Blur");
            $('divTopBar').classList.remove("Blur");

            //special
            //document.body.removeEventListener("keyup", eventListenerFunction);
        }
    }
}
function loadEscListener() {
    document.body.addEventListener("keydown", function (event) {
        if (event.keyCode == 27) {
            //console.log("ESC");
            closePopUp("last");

        }
    });
}



String.prototype.pixelLength = function (_fontSize = 20) {
    var c = document.createElement("span");
    document.body.appendChild(c);
    c.innerHTML = this;
    c.style.fontSize = _fontSize + "px";
    var length = c.offsetWidth;
    document.body.removeChild(c);
    return length;
};

String.prototype.shorten = function (maxLength, _fontSize = 20) {
    var txt = this;
    if (this == "" || (txt).pixelLength(_fontSize) <= maxLength) {
        return this;
    }
    while ((txt + "...").pixelLength(_fontSize) > maxLength - "...".pixelLength(_fontSize) && txt.length > 0) {
        txt = txt.substr(0, txt.length - 1);
    }
    return txt + "...";
};


function grayBar(elem,marginTop = 10, marginBottom = 15) {
    var d = div(elem);
    d.style.backgroundColor = "lightgray";
    d.style.height = "2px";
    d.style.marginBottom = marginBottom + "px";
    d.style.marginTop = marginTop + "px";
    d.borderRadius = "2px";

    // '<div style="background-color:gray; height:2px; margin-bottom:15px; margin-top:10px; border-radius:2px;"></div>';
}


function getStartCommentFromBooking(booking,fill = false) {
    var a = booking.startComment.indexOf("[");
    var b = booking.startComment.indexOf("]");
    var txt = "";

    if (a == 0 && b != -1) {
        txt = booking.startComment.slice(b + 2, booking.startComment.length); // +2 pour enlever l'espace après le ]
    }
    else {
        txt = booking.startComment;
    }
    ////console.log(txt.length);
    if (txt.length == 0 && fill) {
        txt = "Pas de commentaire";
    }
    return txt;
}
function getEndCommentFromBooking(booking, fill = false) {
    var a = booking.endComment.indexOf("[");
    var b = booking.endComment.indexOf("]");
    var txt = "";

    if (a == 0 && b != -1) {
        txt = booking.endComment.slice(b + 1, booking.endComment.length);
    }
    else {
        txt = booking.endComment;
    }
    if (txt.length == 0 && fill) {
        txt = "Pas de commentaire";
    }
    return txt;
}



// ARRAY PROTOTYPES
Array.prototype.switch = function (i1, i2) {
    var content_i1 = this[i1];
    this.splice(i1, 1, this[i2]);
    this.splice(i2, 1, content_i1);
    return this;
};

Array.prototype.inverse = function (i1, i2) {
    for (var i = i1; i < parseInt((i1 + i2) / 2 + 0.5); i++) {
        this.switch(i, i1 + i2 - i);
    }
    return this;
};
Array.prototype.findIndex = function (x) {
    var index = -1;
    for (var i = 0; i < this.length; i++) {
        if (this[i] == x) {
            index = i;
            break;
        }
    }
    return index;
};

Array.prototype.sortBy = function (sortFields, order = 1) {

    if (order == "ASC") {
        order = -1;
    }
    else if (order == "DESC") {
        order = 1;
    }

    ////console.log("sort: ", this, "by: ", sortFields, "order: ", order);

    var switching = true;
    while (switching) {
        switching = false;
        for (var i = 0; i < this.length - 1; i++) {
            if (sortFields[i] > sortFields[i + 1] && order == 1 || sortFields[i] < sortFields[i + 1] && order == -1) { //
                this.switch(i, i + 1);
                sortFields.switch(i, i + 1);
                switching = true;
            }
        }
    }
    //console.log("result of sorting: ",this, "by: ", sortFields);
};

Array.prototype.fillArray = function (length, what = 0) {
    for (var i = 0; i < length; i++) {
        this[i] = what;
    }
};

// merge and only takes the elements which are in every array
Array.prototype.mergeAND = function () {
    var send = [];
    for (let b = 0; b < this[0].length; b++) {
        var item = this[0][b];
        var c = 0;
        for (let r2 = 1; r2 < this.length; r2++) {
            if (this[r2].findIndex(item) != -1) {
                c++;
            }
        }
        if (c == this.length - 1) {
            send.push(item);
        }
    }
    return send;
};

function transformBookings(_bookings) { // one booking with many bookables

    if (_bookings.length > 0) { //if no booking return []

        var final = [];

        final.push(_bookings[0]);
        final[0].ids = [_bookings[0].id];

        if (_bookings[0].bookables.length == 0) {
            final[0].bookables = [Cahier.personalBookable];
        }
        else {
            final[0].bookables = [_bookings[0].bookables[0]];
        }

        for (var i = 1; i < _bookings.length; i++) {

            // add bookable
            if (_bookings[i].startDate == _bookings[i - 1].startDate && _bookings[i].owner.id == _bookings[i - 1].owner.id) {

                if (_bookings[i].bookables.length == 0) {
                    final[final.length - 1].bookables.push(Cahier.personalBookable);
                }
                else {
                    final[final.length - 1].bookables.push(_bookings[i].bookables[0]);
                }

                final[final.length - 1].ids.push(_bookings[i].id);
            }

            // new booking
            else {
                final.push(_bookings[i]);
                final[final.length - 1].ids = [_bookings[i].id];

                if (_bookings[i].bookables.length == 0) {
                    final[final.length - 1].bookables = [Cahier.personalBookable];
                }
                else {
                    final[final.length - 1].bookables = [_bookings[i].bookables[0]];
                }

            }
        }
        return final;

    }
    else {
        return [];
    }
}
