function writeDestination(elem) {

    if (elem.value.length > 2) {
        AcceptInfos(elem);
    }
    else {
        DenyInfos(elem);
    }
}
function writeCommment(elem) {
    if (elem.value.length > -1) {
        AcceptInfos(elem);
    }
    else {
        DenyInfos(elem);
    }
}
function writeNbrInvites(elem) {
    if (parseInt(elem.value) < 21 && elem.value != "" && parseInt(elem.value)!= 0 && parseInt(elem.value) > 0) {
        AcceptInfos(elem);
    }
    else {
        DenyInfos(elem);
    }
}


function createAllPropositions(location = $('divTabCahierInfos')) {

    var allDestinationPropositions = location.getElementsByClassName("divTabCahierInfosDestinationPropositions")[0].getElementsByTagName("div");
    for (var i = 0; i < allDestinationPropositions.length; i++) {
        allDestinationPropositions[i].addEventListener("mousedown", function () {
            location.getElementsByClassName("divTabCahierInfosDestination")[0].getElementsByTagName("input")[0].value = this.innerHTML;
            writeDestination(location.getElementsByClassName("divTabCahierInfosDestination")[0].getElementsByTagName("input")[0]);
        });
    }

    var allNbrInvitesPropositions = location.getElementsByClassName("divTabCahierInfosNbrInvitesPropositions")[0].getElementsByTagName("div");
    for (var i = 0; i < allNbrInvitesPropositions.length; i++) {
        allNbrInvitesPropositions[i].addEventListener("mousedown", function () {
            if (this.innerHTML == "Aucun") {
                location.getElementsByClassName("divTabCahierInfosNbrInvites")[0].getElementsByTagName("input")[0].value = 0;
            }
            else {
                location.getElementsByClassName("divTabCahierInfosNbrInvites")[0].getElementsByTagName("input")[0].value = parseInt(this.innerHTML);
            }
            writeNbrInvites(location.getElementsByClassName("divTabCahierInfosNbrInvites")[0].getElementsByTagName("input")[0]);
        });
    }
}



function focusInOrOut(elem, focus) {
    var allPropositions = elem.parentElement.getElementsByClassName("PropositionsContainer")[0].getElementsByTagName("div");
    for (var i = 0; i < allPropositions.length; i++) {
        if (focus == true) {
            setTimeout(enterProposition, i * 60, allPropositions[i]);
        }
        else {
            setTimeout(exitProposition, i * 60, allPropositions[allPropositions.length - i - 1]);
        }
    }
}

function enterProposition(elem) {
    elem.style.marginLeft = "0px";
    elem.style.marginRight = "10px";
    elem.style.opacity = 1;
}

function exitProposition(elem) {
    elem.style.marginLeft = "200px";
    elem.style.marginRight = "-190px";
    elem.style.opacity = 0;
}



function AcceptInfos(elem) {
    elem.style.backgroundImage = "url(img/icons/check-black.png)";
    elem.style.borderColor = "black";
    elem.parentElement.getElementsByTagName("div")[0].style.backgroundColor = "black";
}
function DenyInfos(elem) {
    elem.style.backgroundImage = "none";
}

function checkInfos(location = $('divTabCahierInfos'), nbr = 0) {
    var allTabCahierFields = location.getElementsByClassName("TabCahierFields");
    var allInfosOkay = true;
    for (var i = 0; i < allTabCahierFields.length-1; i++) { //POUR EVITER LE TEXTAREA...
        if (allTabCahierFields[i].getElementsByTagName("input")[0].style.backgroundImage == "" || allTabCahierFields[i].getElementsByTagName("input")[0].style.backgroundImage =="none") {
            allTabCahierFields[i].getElementsByTagName("input")[0].style.borderColor = "red";
            allTabCahierFields[i].getElementsByTagName("div")[0].style.backgroundColor = "red";
            allInfosOkay = false;
        }
    }
    if (allInfosOkay == true) {

        var _participantCount = parseInt(location.getElementsByClassName("divTabCahierInfosNbrInvites")[0].getElementsByTagName('input')[0].value);
        var _destination = location.getElementsByClassName("divTabCahierInfosDestination")[0].getElementsByTagName('input')[0].value;
        var _startComment = location.getElementsByClassName("divTabCahierInfosStartComment")[0].getElementsByTagName('textarea')[0].value;

        Cahier.setInfos(nbr, _participantCount, _destination, _startComment);

        if (location == $('divTabCahierInfos')) {
            newTab("divTabCahierEquipmentChoice");
        }
        else {
            closePopUp("last");
        }
    }
}