function popBookableHistory(bookableId) {

    currentYear = -1;
    currentMonth = -1;
    currentDay = -1;

    var modal = openPopUp();

    Requests.getBookableHistory(bookableId, modal, new Date());

    var container;
    container = div(modal);
    container.classList.add("Boxes");
    container.style.position = "absolute";
    container.style.width = "700px";
    container.style.top = "50%";
    container.style.marginLeft = "0px";
    container.style.left = "50%";
    container.style.transform = "translate(-50%,-50%)";
    container.style.padding = "10px";
    container.classList.add("PopUpBookableHistoryContainer");



    container.innerHTML += '<div style=" font-size:25px; text-align:center; color:black;">Historique</div>';
    grayBar(container, 5);

    var close = div(container);
    close.className = "divPopUpClose";
    close.onclick = function () {
        closePopUp({ target: modal }, modal);
    };

    var scroll = div(container);
    scroll.className = "PopUpBookableHistoryContainerScroll";
}


var currentYear = -1;
var currentMonth = -1;
var currentDay = -1;
function actualizePopBookableHistory(bookings, elem) {

    var lastDate = new Date(bookings[bookings.length - 1].startDate); // avant changeDaySorting !

    bookings = changeDaySorting(bookings);

    var bookableId = bookings[0].bookables[0].id;

    var container = elem.getElementsByTagName("div")[0];
    container.getElementsByTagName("div")[0].innerHTML = ("Historique de " + bookings[0].bookables[0].name).shorten(600,25);

    var scroll = container.getElementsByClassName("PopUpBookableHistoryContainerScroll")[0];

    if (scroll.getElementsByClassName("Buttons").length ==1 ) {
        scroll.removeChild(scroll.getElementsByClassName("Buttons")[0]);
        scroll.removeChild(scroll.getElementsByTagName("br")[0]);
    }

    for (var i = 0; i < bookings.length; i++) {

        var d = new Date(bookings[i].startDate);

        var newYear = d.getFullYear();
        if (newYear != currentYear) {
            var year = popUpYear(scroll, newYear);

            var start = new Date(d.getFullYear(), 0, 1, 0, 0, 1);
            var end = new Date(d.getFullYear() + 1, 0, 1, 0, 0, 0, 1);
            Requests.getBookingsNbrBetween(start.toISOString(), end.toISOString(), bookableId, year);
        }

        var newMonth = d.getMonth();
        if (newMonth != currentMonth || newYear != currentYear) {
            var month = popUpMonth(scroll, Mois[newMonth]);

            var start = new Date(d.getFullYear(), newMonth, 1, 0, 0, 0, 1);
            var end = new Date(d.getFullYear(), newMonth + 1, 1, 0, 0, 0, 1);
            Requests.getBookingsNbrBetween(start.toISOString(), end.toISOString(), bookableId, month);
        }

        var newDay = d.getDate();
        if (newDay != currentDay || newMonth != currentMonth || newYear != currentYear) {

            var all = scroll.getElementsByClassName("PopUpMonth");

            var day = popUpDay(all[all.length-1], d.getNiceDate(true));

            var start = new Date(d.getFullYear(), newMonth, newDay, 0, 0, 0, 1);
            var end = new Date(d.getFullYear(), newMonth , newDay+1, 0, 0, 0, 1);
            Requests.getBookingsNbrBetween(start.toISOString(), end.toISOString(), bookableId, day,false);
        }

        currentYear = newYear;
        currentMonth = newMonth;
        currentDay = newDay;


        var all = scroll.getElementsByClassName("PopUpDay");

        var sortie = div(all[all.length-1]);
        sortie.id = i;
        sortie.classList.add("PopUpSortie");
        sortie.onclick = function () {
            popBooking(bookings[this.id]);
        };
        div(sortie).innerHTML = d.getNiceTime();
        var c = div(sortie);

        div(c).innerHTML = Cahier.getOwner(bookings[i], true, { length: 240, fontSize: 20 },true);

        div(c).innerHTML = bookings[i].destination.shorten(150, 20);
        div(c).innerHTML = getStartCommentFromBooking(bookings[i]).shorten(150, 15);
    }

    var space = document.createElement("br");
    scroll.appendChild(space);

    var plus = div(scroll);
    plus.classList.add("Buttons");
    plus.classList.add("NormalButtons");
    plus.innerHTML = "Afficher plus";
    plus.onclick = function () {
        Requests.getBookableHistory(bookableId, elem, lastDate);
    };

    if (currentMonth != -1) {
     //   scroll.scrollTo(0, scroll.scrollHeight);
    }

}


function changeDaySorting(bookings) {

    var oldDate = (new Date(bookings[0].startDate)).getDate();
    var oldMonth = (new Date(bookings[0].startDate)).getMonth();

    var result = bookings;

    var c = 0;
    for (var i = 1; i < result.length; i++) {
        var newDate = (new Date(result[i].startDate)).getDate();
        var newMonth = (new Date(result[i].startDate)).getMonth();
        if (oldDate == newDate && oldMonth == newMonth) {
            c++;
            //console.log("i:" + i, "c++");
        }
        else if (c!= 0) { //c!=0
            var i1 = i - 1 - c;
            var i2 = i - 1;
            c = 0;
            //console.log("i:" + i,"switch - " + i1 + "to" + i2);
            result.inverse(i1, i2);
        }
        //console.log("i:" + i, "old:" + oldDate + "/" + oldMonth + "<br/>" + "new:" + newDate + "/" + newMonth + "<br/> c:" + c);
        oldDate = newDate;
        oldMonth = newMonth;

    }
    if (c != 0) {
        var i1 = i - 1 - c;
        var i2 = i - 1;
        result.inverse(i1, i2);
        //console.log("switch",i1, i2);
    }
    return result;
}

function popUpYear (container,txt) {
    var c = div(container);
    c.className = "PopUpYear";
    div(c);
    var inner = div(c);
    inner.innerHTML = txt;
    var nbr = div(div(c));

    return nbr;
}


function popUpMonth(container, txt) {
    var c = div(container);
    c.className = "PopUpMonth";
    div(c);
    var inner = div(c);
    inner.innerHTML = txt;
    var nbr = div(div(c));

    return nbr;
}


function popUpDay(container, txt) {
    var c = div(container);
    c.className = "PopUpDay";

    var infos = div(c);

    div(infos);
    var inner = div(infos);
    inner.innerHTML = txt;
    var nbr = div(div(infos));

    return nbr;
}