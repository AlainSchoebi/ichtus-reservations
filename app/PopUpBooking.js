function popBooking(bookingId) {
    var elem = openPopUp();
    Requests.getBookingInfos(bookingId, elem);
    loadConfirmation(elem);
}
function loadConfirmation(elem = $('divTabCahierConfirmation')) {

    var fields = ["Responsable", "Heure de d�part", "Embarcation", "Nbr de participants", "Destination", "Commentaire d�p.", "Commentaire arr."];
    var images = ["IconResponsible", "IconStart",  "IconSail","IconParticipantCount", "IconDestination", "IconStartComment", "IconEndComment"];

    var container;

    if (elem != $('divTabCahierConfirmation')) {
        container = div(elem);
        container.style.position = "absolute";
        container.style.top = "50%";
        container.style.marginLeft = "0px";
        container.style.left = "50%";
        container.style.transform = "translate(-50%,-50%)";
    }
    else {
        container = document.createElement("div");
        elem.insertBefore(container, elem.getElementsByClassName("ValidateButtons")[0].parentElement);
        container.style.position = "relative";
        container.style.minHeight = "10px";
    }

    container.className = "divTabCahierConfirmationContainer";

    container.innerHTML += '<div style=" font-size:25px; text-align:center; color:black;">Votre sortie</div>';
    grayBar(container, 5);

    for (var i = 0; i < 2; i++) {
        var d = div(container);
        d.classList.add("divConfirmationTexts");
        div(div(d)).style.backgroundImage = "url(Img/" + images[i] + ".png)";
        div(d).innerHTML = fields[i];
        div(d);
        if (i == 1 && elem != $('divTabCahierConfirmation')) {
            d = div(container);
            d.classList.add("divConfirmationTexts");
            div(div(d)).style.backgroundImage = "url(Img/" + "IconEnd" + ".png)";
            div(d).innerHTML = "Heure d'arriv�e";
            div(d);
        }
    }

    grayBar(container);

    d = div(container);
    d.classList.add("divConfirmationTexts");
    d.style.backgroundColor = "rgb(235,235,235)";
    div(div(d)).style.backgroundImage = "url(Img/" + images[2] + ".png)";
    div(d).innerHTML = fields[2];
    div(d);

    var emb = div(container);
    emb.className = "divTabCahierConfirmationEmbarcationBox";
    div(div(emb));

    var texts = div(emb);
    texts.className = "divTabCahierConfirmationContainerTextsContainer";
    div(texts).innerHTML = "...";
    div(texts).innerHTML = "...";

    grayBar(container);

    for (var i = 3; i < 6; i++) {
        d = div(container);
        d.classList.add("divConfirmationTexts");
        div(div(d)).style.backgroundImage = "url(Img/" + images[i] + ".png)";
        div(d).innerHTML = fields[i];
        div(d);
        if (elem == $('divTabCahierConfirmation')) {
            if (i / 2 == Math.floor(i / 2)) {
                d.style.backgroundColor = "white";
            }
            else {
                d.style.backgroundColor = "rgb(235,235,235)";
            }
        }
    }

    if (elem != $('divTabCahierConfirmation')) {
        d = div(container);
        d.classList.add("divConfirmationTexts");
        div(div(d)).style.backgroundImage = "url(Img/" + images[6] + ".png)";
        div(d).innerHTML = fields[6];
        div(d);

        var close = div(container);
        close.className = "divPopUpClose";
        close.onclick = function () {
            closePopUp({ target: elem }, elem);
        };
    }  
}


function actualizePopBooking(booking, container = $('divTabCahierConfirmationContainer')) {
    var allDiv = container.getElementsByClassName("divConfirmationTexts");
    var allDivTexts = [];
    for (var i = 0; i < allDiv.length; i++) {
        allDivTexts[i] = allDiv[i].getElementsByTagName('div')[3];
    }

    container.getElementsByClassName('divTabCahierConfirmationContainer')[0].getElementsByTagName("div")[0].innerHTML = "Sortie du " + (new Date(booking.startDate)).getNiceDate();

    allDivTexts[0].innerHTML = getResponsibleNameFromBooking(booking, true, { length: 1000000, fontSize: 35 });

    allDivTexts[1].innerHTML = (new Date(booking.startDate)).getNiceTime();

    if (booking.endDate == null) {
        allDivTexts[2].innerHTML = "Pas encore rentr�(e)";
    }
    else {
        allDivTexts[2].innerHTML = (new Date(booking.endDate)).getNiceTime();
    }

    if (booking.bookables.length != 0) {
        container.getElementsByClassName('divTabCahierConfirmationEmbarcationBox')[0].getElementsByTagName("div")[0].addEventListener("click", function () { popBookable(booking.bookables[0].id); });
        container.getElementsByClassName('divTabCahierConfirmationContainerTextsContainer')[0].getElementsByTagName('div')[0].innerHTML = booking.bookables[0].name;
        container.getElementsByClassName('divTabCahierConfirmationContainerTextsContainer')[0].getElementsByTagName('div')[1].innerHTML = booking.bookables[0].code + " cat�";
    }
    else {
        container.getElementsByClassName('divTabCahierConfirmationContainerTextsContainer')[0].getElementsByTagName('div')[0].innerHTML = "Mat�riel personel";
        container.getElementsByClassName('divTabCahierConfirmationContainerTextsContainer')[0].getElementsByTagName('div')[1].innerHTML = "";
        container.getElementsByClassName('divTabCahierConfirmationEmbarcationBox')[0].getElementsByTagName("div")[0].style.visibility =  "hidden";
    }

    allDivTexts[4].innerHTML = Cahier.getnbrParticipantsText(booking.participantCount, " Participant");
    allDivTexts[5].innerHTML = booking.destination;

    allDivTexts[6].innerHTML = getStartCommentFromBooking(booking,true);
    allDivTexts[7].innerHTML = getEndCommentFromBooking(booking,true);
}

