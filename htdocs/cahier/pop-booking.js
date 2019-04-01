// set true if wanna a comment by bookable !!
var bookablesComment = false;



// popBookings
function loadConfirmation() {
    var elem = $('divTabConfirmationOneBookingContainer');
    openBooking("confirmation", elem);
}
function popBooking(_booking) { // without all bookables... so if the booking is not complete
    var elem = openPopUp();
    openBooking("infos", elem);
    Requests.getBookingWithBookablesInfos(_booking, "infos", elem);
}
function popBookingInfos(_booking) {
    var elem = openPopUp();
    openBooking("infos", elem);
    actualizePopBooking(_booking, "infos", elem);
}
function popBookingFinish(_booking) {
    var elem = openPopUp();
    openBooking("finish", elem);
    actualizePopBooking(_booking, "finish", elem);
}


function openBooking(which = "confirmation", elem = $('divTabConfirmationOneBookingContainer')) {

    var fields = ["Responsable", "Heure de départ", "Heure d'arrivée", "Embarcations", "Nbr de participants", "Destination", "Commentaire dép.", "Commentaire arr."];
    var images = ["icons/responsible", "icons/start", "icons/end", "icons/sail", "icons/participant-count", "icons/destination", "icons/start-comment", "icons/end-comment"];

    var container;

    // TITLE
    if (which == "confirmation") {
        elem.innerHTML = ""; // empty elem
        container = div(elem);
        container.style.position = "relative";
        container.style.minHeight = "10px";
        container.innerHTML += '<div style=" font-size:25px; text-align:center; color:black;">Votre sortie</div>';
    }
    else {
        container = div(elem);
        container.style.position = "absolute";
        container.style.top = "50%";
        container.style.marginLeft = "0px";
        container.style.left = "50%";
        container.style.transform = "translate(-50%,-50%)";
        container.innerHTML += '<div style=" font-size:25px; text-align:center; color:black;">Sortie en chargement...</div>';

        var close = div(container);
        close.className = "divPopUpClose";
        close.onclick = function () {
            closePopUp({ target: elem }, elem);
        };
    }

    container.className = "divTabCahierConfirmationContainer";

    grayBar(container, 5);

    // OWNER & DATES
    var c = 2;
    if (which != "confirmation") {
        c = 3;
    }
    for (let i = 0; i < c; i++) {
        var d = div(container);
        d.classList.add("divConfirmationTexts");
        div(div(d)).style.backgroundImage = "url(img/" + images[i] + ".png)";
        div(d).innerHTML = fields[i];
        div(d);
    }

    grayBar(container);

    // EMBARCATIONS
    d = div(container);
    d.classList.add("divConfirmationTexts");
    d.style.backgroundColor = "rgb(235,235,235)";
    div(div(d)).style.backgroundImage = "url(img/" + images[3] + ".png)";
    div(d).innerHTML = fields[3];
    div(d);

    var embContainer = div(container);
    embContainer.classList.add("divTabCahierConfirmationEmbarcationContainer");

    var emb = div(embContainer);
    emb.className = "divTabCahierConfirmationEmbarcationBox";
    div(div(emb));

    var texts = div(emb);
    texts.className = "divTabCahierConfirmationContainerTextsContainer";

    div(texts).innerHTML = "...";
    div(texts).innerHTML = "...";

    if (which == "finish" && bookablesComment) { // desactivated

        var radioContainer = div(emb);
        radioContainer.className = "radioContainer";

        var r1 = div(radioContainer);
        r1.classList.add("radioSelected");
        r1.onclick = function () { this.classList.add("radioSelected"); this.nextElementSibling.classList.remove("radioSelected"); this.parentElement.nextElementSibling.children[0].disabled = true; this.parentElement.nextElementSibling.children[0].style.backgroundColor = "lightgray"; this.parentElement.nextElementSibling.style.opacity = 0.5; }; //this.parentElement.parentElement.getElementsByTagName("textarea")[0].style.opacity = 0;
        div(div(r1)); div(r1).innerHTML = "En bon état";
        var r2 = div(radioContainer);
        r2.onclick = function () { this.classList.add("radioSelected"); this.previousElementSibling.classList.remove("radioSelected"); this.parentElement.nextElementSibling.children[0].disabled = false; this.parentElement.nextElementSibling.children[0].style.backgroundColor = "white"; this.parentElement.nextElementSibling.style.opacity = 1; };//area.style.opacity = 1;};
        div(div(r2)); div(r2).innerHTML = "Endommagé";

        var areaContainer = div(emb);
        areaContainer.style.width = "0px";
        areaContainer.style.height = "0px";
        areaContainer.style.opacity = 0.5;
        var area = document.createElement("textarea");
        area.placeholder = "État de l'embarcation...";
        area.spellcheck = false;
        area.style.left = "350px";
        area.style.top = "30px";
        area.style.height = "95px";
        area.style.width = "290px";
        area.style.backgroundPositionX = "245px";
        area.disabled = "true"; area.style.backgroundColor = "lightgray";
        areaContainer.appendChild(area);
    }

    if (which == "confirmation") {
        var u = div(container);
        u.classList.add("divTabCahierConfirmationEmbarcationButtonContainer");
        var btn = div(u);
        btn.innerHTML = "Modifier";
        btn.classList.add("Buttons");
        btn.classList.add("ReturnButtons");
        btn.onclick = function () { newTab('divTabCahierEquipmentChoice'); };
    }

    grayBar(container);


    // END COMMENT
    if (which == "finish") {

        d = div(container);
        d.classList.add("divConfirmationTexts");
        d.style.backgroundColor = "rgb(235,235,235)";
        div(div(d)).style.backgroundImage = "url(img/" + images[7] + ".png)";
        div(d).innerHTML = fields[7];
        var area2 = document.createElement("textarea");
        area2.spellcheck = false;
        area2.placeholder = "Comment ça s'est passé...";
        div(d).appendChild(area2);

        var btnFinish = div(container);
        btnFinish.classList.add("Buttons");
        btnFinish.classList.add("ValidateButtons");
        btnFinish.style.backgroundColor = "red";
        btnFinish.innerHTML = "Terminer";
        // for function see - actualizeBooking...
    }


    // INFOS
    var l = 8;
    if (which == "confirmation") {
        l = 7;
    }
    else if (which == "finish") {
        l = 4; //no infos
    }

    for (var i = 4; i < l; i++) {
        d = div(container);
        d.classList.add("divConfirmationTexts");
        div(div(d)).style.backgroundImage = "url(img/" + images[i] + ".png)";
        div(d).innerHTML = fields[i];
        div(d);
        if (i / 2 == Math.floor(i / 2)) {
            d.style.backgroundColor = "rgb(235,235,235)";
        }
        else {
            d.style.backgroundColor = "white";
        }
    }


    // EDIT BUTTON
    if (which == "confirmation") {

        // INFOS
        var bar = div(container);
        bar.classList.add("divConfirmationTexts");
        bar.style.height = "50px";
        bar.style.backgroundColor = "white";
        div(bar);
        div(bar);
        var u = div(bar);
        u.style.height = "100%";

        var btn2 = div(u);
        btn2.innerHTML = "Modifier";
        btn2.classList.add("Buttons");
        btn2.classList.add("ReturnButtons");
        btn2.onclick = function () { popCahierInfos(0); };
    }


    // FILL POP UP BOOKING
    if (which == "confirmation") {
         actualizePopBooking(Cahier.bookings[0], which, elem);
    }
}




function actualizePopBooking(booking, which, container = $('divTabCahierConfirmationContainer')) {

    var allDiv = container.getElementsByClassName("divConfirmationTexts");
    var allDivTexts = [];
    for (var i = 0; i < allDiv.length; i++) {
        allDivTexts[i] = allDiv[i].getElementsByTagName('div')[3];
    }

    allDivTexts[0].innerHTML = Cahier.getOwner(booking, true, { length: 1000000, fontSize: 35 });

    if (which == "confirmation") {
        allDivTexts[1].innerHTML = (new Date()).getNiceTime();
        allDivTexts[3].innerHTML = Cahier.getSingularOrPlural(booking.participantCount, " Participant");
        allDivTexts[4].innerHTML = booking.destination;
        allDivTexts[5].innerHTML = getStartCommentFromBooking(booking, false);
    }
    else if (which == "infos") {
        container.getElementsByClassName('divTabCahierConfirmationContainer')[0].getElementsByTagName("div")[0].innerHTML = "Sortie du " + (new Date(booking.startDate)).getNiceDate(false, true);
        allDivTexts[1].innerHTML = (new Date(booking.startDate)).getNiceTime();
        if (booking.endDate == null) {
            allDivTexts[2].innerHTML = "Pas encore rentré(e)";
        }
        else {
            allDivTexts[2].innerHTML = (new Date(booking.endDate)).getNiceTime();
        }
        allDivTexts[4].innerHTML = Cahier.getSingularOrPlural(booking.participantCount, " Participant");
        allDivTexts[5].innerHTML = booking.destination;
        allDivTexts[6].innerHTML = getStartCommentFromBooking(booking, false);
        allDivTexts[7].innerHTML = getEndCommentFromBooking(booking, false);
    }
    else if (which == "finish") {
        container.getElementsByClassName('divTabCahierConfirmationContainer')[0].getElementsByTagName("div")[0].innerHTML = "Terminer sortie du " + (new Date(booking.startDate)).getNiceDate(false, true);
        allDivTexts[1].innerHTML = (new Date(booking.startDate)).getNiceTime();
        allDivTexts[2].innerHTML = (new Date()).getNiceTime();

        var btn = container.getElementsByClassName("ValidateButtons")[0];

        btn.addEventListener("click", function () {

            if (bookablesComment) {
                var comments = [];

                for (var i = 0; i < booking.ids.length; i++) {
                    var area = container.getElementsByClassName("divTabCahierConfirmationEmbarcationBox")[i].getElementsByTagName("textarea")[0];
                    if (typeof area != "undefined") {
                        if (area.value != "") {
                            comments[i] = "![" + area.value + "]! " + container.getElementsByTagName("textarea")[container.getElementsByTagName("textarea").length - 1].value;
                        }
                        else {
                            comments[i] = container.getElementsByTagName("textarea")[container.getElementsByTagName("textarea").length - 1].value;
                        }
                    }
                    else {
                        comments[i] = container.getElementsByTagName("textarea")[container.getElementsByTagName("textarea").length - 1].value;
                    }
                }

                Requests.terminateBooking(booking.ids, comments);
            }
            else {
                var comments = [];
                comments.fillArray(booking.ids.length, container.getElementsByTagName("textarea")[container.getElementsByTagName("textarea").length - 1].value);
                Requests.terminateBooking(booking.ids, comments);
            }
            closePopUp({ target: container }, container);
        });

    }



    var embContainer = container.getElementsByClassName('divTabCahierConfirmationEmbarcationContainer')[0];
    var emb1 = embContainer.getElementsByClassName('divTabCahierConfirmationEmbarcationBox')[0];

    if (booking.bookables.length == 0) { // should happen not anymore
        //container.getElementsByClassName('divTabCahierConfirmationContainerTextsContainer')[0].getElementsByTagName('div')[0].innerHTML = "";
        //container.getElementsByClassName('divTabCahierConfirmationContainerTextsContainer')[0].getElementsByTagName('div')[1].innerHTML = "";
        //emb1.getElementsByTagName("div")[0].classList.add("PersonalSail");
    }
    else {
        embContainer.innerHTML = "";
        for (let i = 0; i < booking.bookables.length; i++) {
            var emb = div(embContainer);
            emb.className = "divTabCahierConfirmationEmbarcationBox";
            var img = div(emb);
            img.style.backgroundImage = "url(img/icons/info.png)," + Cahier.getImageUrl(booking.bookables[i]);
            div(img);

            texts = div(emb);
            texts.className = "divTabCahierConfirmationContainerTextsContainer";

            div(texts).innerHTML = booking.bookables[i].code;
            div(texts).innerHTML = booking.bookables[i].name.shorten(2 * 150, 20);

            if (booking.bookables[i] == Cahier.personalBookable) {
                img.classList.add("PersonalSail");
                img.innerHTML = "";
            }
            else {
                img.addEventListener("click", function () { popBookable(booking.bookables[i].id); });
            }

            if (which == "finish" && bookablesComment) {

                emb.style.display = "block";

                if (booking.bookables[i] != Cahier.personalBookable) {

                    var radioContainer = div(emb);
                    radioContainer.className = "radioContainer";

                    var r1 = div(radioContainer);
                    r1.classList.add("radioSelected");
                    r1.onclick = function () { this.classList.add("radioSelected"); this.nextElementSibling.classList.remove("radioSelected"); this.parentElement.nextElementSibling.children[0].disabled = true; this.parentElement.nextElementSibling.children[0].style.backgroundColor = "lightgray"; this.parentElement.nextElementSibling.style.opacity = 0.3; }; //this.parentElement.parentElement.getElementsByTagName("textarea")[0].style.opacity = 0;
                    div(div(r1)); div(r1).innerHTML = "En bon état";
                    var r2 = div(radioContainer);
                    r2.onclick = function () { this.classList.add("radioSelected"); this.previousElementSibling.classList.remove("radioSelected"); this.parentElement.nextElementSibling.children[0].disabled = false; this.parentElement.nextElementSibling.children[0].style.backgroundColor = "white"; this.parentElement.nextElementSibling.style.opacity = 1; };//area.style.opacity = 1;};
                    div(div(r2)); div(r2).innerHTML = "Endommagé";

                    var areaContainer = div(emb);
                    areaContainer.style.width = "0px";
                    areaContainer.style.height = "0px";
                    areaContainer.style.opacity = 0.5;
                    var area = document.createElement("textarea");
                    area.placeholder = "État de l'embarcation...";
                    area.spellcheck = false;
                    area.style.left = "350px";
                    area.style.top = "30px";
                    area.style.height = "80px";
                    area.style.width = "290px";
                    area.style.backgroundPositionX = "248px";
                    area.style.backgroundPositionY = "35px";
                    area.disabled = "true"; area.style.backgroundColor = "lightgray";
                    areaContainer.appendChild(area);
                    //area.focus();
                }
            }
        }
    }








}




//function createConfirmationBooking(booking,nbr) {
//    var fields = [Cahier.getOwner(booking,true), Cahier.getSingularOrPlural(booking.participantCount), booking.destination, booking.startComment.shorten(295, 25), Cahier.getBookableName(booking).shorten(265,25)];
//    var images = ["icons/responsible", "icons/participant-count", "icons/destination", "icons/start-comment", "icons/sail"];
//    var titles = ["Reponsable", "Nbr de participants", "Destination", "Commentaire","Embarcation"];

//    var container = div($('divTabConfirmationBookingsContainer'));
//    container.style.position = "relative";
//    container.style.minHeight = "10px";
//    container.classList.add("divTabCahierConfirmationContainer");
//    container.classList.add("confirmationTab");

//    if (nbr == 0) {
//        container.innerHTML += '<div style=" font-size:25px; text-align:center; color:black;">Votre sortie</div>';
//    }
//    else {
//        container.innerHTML += '<div style=" font-size:25px; text-align:center; color:black;"> Sortie de ' + Cahier.getFullName(booking) + '</div>';
//    }

//    grayBar(container, 5,10);

//    for (var i = 0; i < 4; i++) {
//        var d = div(container);
//        d.classList.add("divConfirmationTexts");
//        d.classList.add("confirmationTab");
//        d.title = titles[i];
//        div(div(d)).style.backgroundImage = "url(img/" + images[i] + ".png)";
//        div(d).innerHTML = fields[i];
//        if (i == 0 && nbr != 0) {
//            var a = div(d);
//            var btn = div(a);
//            btn.innerHTML = "Changer";
//            btn.classList.add("Buttons");
//            btn.classList.add("ReturnButtons");
//            btn.style.backgroundImage = "url(img/icons/responsible.png)";
//            btn.style.backgroundBlendMode = "exclusion";
//            if (booking.guest) {
//                btn.onclick = function () { popGuest(nbr); };
//            }
//            else {
//                btn.onclick = function () { popUser(nbr); };
//            }

//        }
//    }

//    var embarcationContainer = div(container);
//    embarcationContainer.classList.add("divTabCahierConfirmationEmbarcationBoxContainer");
//    embarcationContainer.classList.add("confirmationTab");

//    d = div(embarcationContainer);
//    d.classList.add("divConfirmationTexts");
//    d.classList.add("confirmationTab");
//    d.title = titles[4];
//    d.style.backgroundColor = "rgb(235,235,235)";
//    div(div(d)).style.backgroundImage = "url(img/" + images[4] + ".png)";
//    div(d).innerHTML = fields[4];

//    // only if not MP
//    var emb = div(embarcationContainer);
//    emb.classList.add("divTabCahierConfirmationEmbarcationBox");
//    emb.classList.add("confirmationTab");
//    div(div(emb));
//    if (booking.bookables.length != 0) {
//        emb.getElementsByTagName("div")[0].addEventListener("click", function () { popBookable(booking.bookables[0].id); });
//    }
//    else {
//        emb.getElementsByTagName("div")[0].classList.add("PersonalSail");
//    }

//    var texts = div(emb);
//    texts.className = "divTabCahierConfirmationContainerTextsContainer";
//    div(texts).innerHTML = Cahier.getBookableName(booking).shorten(180,25);
//    div(texts).innerHTML = Cahier.getBookableCode(booking).shorten(180,20);

//    var btn = div(container);
//    btn.innerHTML = "Modifier";
//    btn.classList.add("Buttons");
//    btn.classList.add("ReturnButtons");
//    btn.onclick = function () { popCahierInfos(nbr); };

//    var btn = div(emb);
//    btn.classList.add("Buttons");
//    btn.classList.add("ReturnButtons");
//    btn.onclick = function () { popCahierBookable(nbr); };
//    if (booking.bookables.length != 0) {
//        btn.innerHTML = "Modifier";
//    }
//    else {
//        btn.classList.add("ButtonChose");
//        btn.innerHTML = "Choisir";
//    }


//    if (nbr != 0) {
//        var r = div(container);
//        r.classList.add("divTabCahierConfirmationDeleteBooking");
//        r.addEventListener("click", function () {
//            this.parentElement.style.animationName = "shrink";
//            setTimeout(function () { Cahier.deleteBooking(nbr); }, 500);
//        });
//    }
//    else {
//        container.style.border = "5px solid lightgray";
//    }

//}