var Cahier = {

    actualBookings: [],

    finishedBookings:[],

    bookings: [{
        owner: {id:0,name:"Michel pas défini",sex:"male"},
        bookables: [],
        participantCount: 1,
        destination: "Non défini",
        startComment: ""
    }],

    personalBookable: {
        id: 0,
        code: "Perso",
        name:"Matériel personnel"
    },

    getImageUrl: function (_bookable, size = 220) {
        if (_bookable == Cahier.personalBookable) {
            return 'url(img/icons/own-sail.png)';
        }
        return 'url(https://dev.ichtus.club/image/' + _bookable.image.id + '/' + size + ')';
    },

    getFullName: function (booking = Cahier.bookings[0]) {
        if (booking.guest) { return booking.guestName; } else { return booking.owner.surName + " " + booking.owner.firstName; }
    },


    getSingularOrPlural: function (nbr = Cahier.nbrParticipants, txt = " Participant") {
        if (nbr == 0) {
            return "Aucun";
        }
        else if (nbr == 1) {
            return "1" + txt;
        }
        else {
            return nbr + txt + "s";
        }
    },

    getBookableName: function (booking) {
        if (booking.bookables.length == 0) {
            return "??";
        }
        else {
            return booking.bookables[0].name;
        }
    },

    getBookableCode: function (booking) {
        if (booking.bookables.length == 0) {
            return "";
        }
        else {
            return booking.bookables[0].code;
        }
    },

    // new with guest:
    getOwner: function (booking, wantImg = false, shortenOptions = { length: 10000, fontSize: 20 }) {

        if (wantImg) {
            var img = "img/icons/woman.png";
            if (booking.owner.sex == "male") { img = "img/icons/man.png"; }

            return "<div id='" + booking.owner.name + "' class='TableEntriesImg' style='background-image:url(" + img + ");  display: inline-block;vertical-align: middle;'>" + "</div>" + "<div style=' display: inline-block;vertical-align: middle;'>" + booking.owner.name.shorten(shortenOptions.length - 40, shortenOptions.fontSize) + "</div>";
        }
        else {
            return booking.owner.name;
        }
    },


    //new Booking
    newUserBooking: function () {
        popUser(Cahier.bookings.length);
    },

    //new Booking
    newGuestBooking: function () {
        popGuest(Cahier.bookings.length);
    },

    ProgressBarTexts: ["Nom", "Informations", "Embarcations", "Confirmation"],

    // cancel - clearData
    cancel: function () {

        // #divCahier
        //$("inputTabCahierSearch").value = "";
        //$("divTabCahierSearchResult").innerHTML = "";

        // #divCahierInfos
        var allTabCahierFields = document.getElementsByClassName("TabCahierFields");

        for (var i = 0; i < allTabCahierFields.length - 1; i++) { // -1 POUR EVITER LA TEXTAREA
            allTabCahierFields[i].getElementsByTagName("input")[0].value = "";
            allTabCahierFields[i].getElementsByTagName("input")[0].style.backgroundImage = "none";
            allTabCahierFields[i].getElementsByTagName("input")[0].style.borderColor = "black";
            allTabCahierFields[i].getElementsByTagName("div")[0].style.backgroundColor = "black";
        }

        document.getElementsByClassName("divTabCahierInfosStartComment")[0].getElementsByTagName("textarea")[0].value = "";
        document.getElementsByClassName("divTabCahierInfosNbrInvites")[0].getElementsByTagName("input")[0].value = "1";
        document.getElementsByClassName("divTabCahierInfosDestination")[0].getElementsByTagName("input")[0].value = "Baie";

        $('inputTabCahierEquipmentElementsInputSearch').value = "";

        $('divTabCahierEquipmentElementsSelectSort').getElementsByTagName("select")[0].getElementsByTagName("option")[0].selected = "selected";
        $('divTabCahierEquipmentElementsSelectSort').getElementsByTagName("div")[0].style.backgroundImage = 'url("img/icons/sort-asc.png")';

        document.getElementsByClassName('divTabCahierEquipmentChoiceInputCodeContainer')[0].getElementsByTagName('input')[0].value = "";

        $('divTabCahierMember').getElementsByTagName("input")[0].value = "";
        $("divTabCahierSearchResult").innerHTML = "";

        changeProgress(1);

        document.getElementsByClassName("divTabCahierEquipmentChoiceContainer")[0].children[3].children[0].classList.remove("buttonNonActive");


        Cahier.bookings = [{
            owner: {},
            bookables: [],
            participantCount: 1,
            destination: "Non défini",
            startComment: ""
        }];

        //console.log("--> Cahier.cancel()");
    },

    deleteBooking: function (nbr) {
        Cahier.bookings.splice(nbr, 1);
        Cahier.actualizeConfirmation();
    },

    confirm: function () {

        Requests.createBooking();

        animate();
        //console.log("--> Cahier.confirm()");
    },

    actualizeProgressBar: function () {
        var allDivTabCahierProgressTexts = document.getElementsByClassName("divTabCahierProgressText");
        for (var i = 0; i < allDivTabCahierProgressTexts.length; i++) {
            if (i < currentProgress-1) {
                switch (i) {
                    case 0:
                        allDivTabCahierProgressTexts[i].innerHTML = Cahier.bookings[0].owner.name;
                        break;
                    case 1:
                        allDivTabCahierProgressTexts[i].innerHTML = Cahier.bookings[0].destination + " & " + Cahier.bookings[0].participantCount + " P.";
                        break;
                    case 2:
                        var txt = "";
                        for (let k = 0; k < Cahier.bookings[0].bookables.length; k++) {
                            txt += Cahier.bookings[0].bookables[k].code + ", ";
                        }
                        txt = txt.substring(0,txt.length - 2);
                        allDivTabCahierProgressTexts[i].innerHTML = txt;
                        break;
                    default:
                        break;
                }
            }
            else {
                allDivTabCahierProgressTexts[i].innerHTML = Cahier.ProgressBarTexts[i];
            }
        }


        if (currentProgress == 1) {
            $('divTabCahierProgressReturn').style.visibility = "hidden";
        }
        else {
            $('divTabCahierProgressReturn').style.visibility = "visible";
            $('divTabCahierProgressReturn').onclick = function () {
                newTab(progessionTabNames[currentProgress - 1]);
            };
        }
    },

    actualizeConfirmation: function () {

        if (currentTabElement.id == "divTabCahierConfirmation") {
            loadConfirmation();
        }
    },


    setOwner: function (nbr = 0, _owner = { id: "", firstName: "", surName: "", sex: "female" }, force = false) {

        var t = true;
        if (!force) {
            for (var i = 0; i < Cahier.actualBookings.length; i++) {
                if (Cahier.actualBookings[i].owner.id == _owner.id) {
                    t = false;
                    break;
                }
            }
        }

        if (t) {
            Cahier.bookings[nbr].owner.id = _owner.id;
            Cahier.bookings[nbr].owner.firstName = _owner.firstName;
            Cahier.bookings[nbr].owner.surName = _owner.surName;
            Cahier.bookings[nbr].owner.name = _owner.surName + " " + _owner.firstName;
            Cahier.bookings[nbr].owner.sex = _owner.sex;

            //console.log("setOwner(): ", nbr, Cahier.bookings[nbr].owner);
            Cahier.actualizeConfirmation();

            newTab("divTabCahierInfos");
        }
        else {
            popAlertAlreadyHavingABooking(_owner);
        }


    },

    addBookable: function (nbr = 0, _bookable = Cahier.personalBookable) {

        Cahier.bookings[nbr].bookables.push(_bookable);
        actualizeBookableList();

        //console.log(_bookable);

        if (_bookable == Cahier.personalBookable) {
            document.getElementsByClassName("divTabCahierEquipmentChoiceContainer")[0].children[3].children[0].classList.add("buttonNonActive");
        }

        //console.log("setBookable(): ", nbr, Cahier.bookings[nbr].bookables);
        Cahier.actualizeConfirmation();
    },

    removeBookable: function (nbr = 0, _bookable = 0) {

        for (var i = 0; i < Cahier.bookings[nbr].bookables.length; i++) {
            if (Cahier.bookings[nbr].bookables[i].code == _bookable.code) {
                break;
            }
        }

        if (_bookable == Cahier.personalBookable) {
            document.getElementsByClassName("divTabCahierEquipmentChoiceContainer")[0].children[3].children[0].classList.remove("buttonNonActive");
        }

        Cahier.bookings[nbr].bookables.splice(i, 1);

        //console.log("removeBookable(): ", nbr, Cahier.bookings[nbr].bookables);
        Cahier.actualizeConfirmation();
        actualizeBookableList();
        if (currentTabElement.id == "divTabCahierEquipmentElements") {
            actualizeElements();
        }
    },

    setInfos: function (nbr = 0, _participantCount = 1, _destination = "Non choisi", _startComment = "mmh.") {
        Cahier.bookings[nbr].participantCount = _participantCount;
        Cahier.bookings[nbr].destination = _destination;
        Cahier.bookings[nbr].startComment = _startComment;

        //console.log("setInfos(): ", nbr, Cahier.bookings[nbr].participantCount, Cahier.bookings[nbr].destination, Cahier.bookings[nbr].startComment);
        Cahier.actualizeConfirmation();
    }

};


