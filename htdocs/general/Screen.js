var stillMoving = false;
var currentTabElement; //see load for the first element = divtabcahier
var changeTime = 0.3;

// changeTab
function changeTab(newElement, sign) {

    stillMoving = true;

    document.documentElement.scrollTop = 0;

    currentTabElement.style.zIndex = "10";
    currentTabElement.style.transition = "transform " + changeTime + "s linear 0s,padding-right 0.3s linear 0s";

    newElement.style.zIndex = "5";

    currentTabElement.style.transform = "translate(" + (-sign) + "00%)";  //element.style.transform = "translate(" + (-sign * widthToDisplay) + "px)"; //meme chose

    newElement.style.top = "0px";

    setTimeout(function () {

        currentTabElement.style.zIndex = "2";
        currentTabElement.style.transition = "none";

        currentTabElement.style.transform = "translate(0px)";

        setTimeout(function () { currentTabElement.style.transition = "transform " + changeTime + "s linear 0s, padding-right 0.3s linear 0s"; }, 30);
        setTimeout(function () {
            stillMoving = false;
            currentTabElement.style.top = "-30000px";
            currentTabElement = newElement;
        }, 50);

    }, changeTime * 1000);
}

// newTab
function newTab(id) {
    if (stillMoving == false) {
        window.location = "#" + id;
    }
}
// historyBackTab
function historyBackTab(elem) {
    window.history.back();
}


// tabs
var tabs = [];
tabs.push({ id: "divTabCahier", order: 0, progress: 0, position: 0, TopBar: false, ListBar: false, Enter: function () { Cahier.cancel(); }, Remove: function () { } });
tabs.push({
    id: "divTabCahierMember", order: 6, progress: 1, position: 0, TopBar: true, ListBar: false, title: "Veuillez écrire votre nom et prénom", Enter: function () {
        $('divTabCahierMember').getElementsByTagName("input")[0].focus();
    }, Remove: function () { }
});
tabs.push({
    id: "divTabCahierInfos", order: 7, progress: 2, position: 0, TopBar: true, ListBar: false, title: "Complétez les champs", Enter: function () {
        if (currentTabElement.id == "divTabCahierMember") {
            document.getElementsByClassName("divTabCahierInfosNbrInvites")[0].getElementsByTagName("input")[0].focus();
            writeNbrInvites(document.getElementsByClassName("divTabCahierInfosNbrInvites")[0].getElementsByTagName("input")[0]);
            writeDestination(document.getElementsByClassName("divTabCahierInfosDestination")[0].getElementsByTagName("input")[0]);
        }
    }, Remove: function () { }
});
tabs.push({
    id: "divTabCahierEquipmentChoice", order: 9, progress: 3, position: 0, TopBar: true, ListBar: true, title: "Tapez les codes de vos embarcations",
    Enter: function () {
        document.getElementsByClassName('divTabCahierEquipmentChoiceInputCodeContainer')[0].getElementsByTagName("input")[0].focus();
        document.getElementsByClassName('divTabCahierEquipmentChoiceInputCodeContainer')[0].getElementsByTagName("input")[0].value = "";
    }, Remove: function () {}});
tabs.push({ id: "divTabCahierEquipmentBookable", order: 10, progress: 3, position: 0, TopBar: true, ListBar: true, title: "Validez cette embarcation", Enter: function () {}, Remove: function () { } });
tabs.push({ id: "divTabCahierEquipmentCategories", order: 12, progress: 3, position: 0, TopBar: true, ListBar: true,title: "Veuillez choisir votre type d'activité", Enter: function () { }, Remove: function () { } });
tabs.push({
    id: "divTabCahierEquipmentElements", order: 13, progress: 3, position: 0, TopBar: true, ListBar: true, title: "Sélectionnez votre embarcation",
    Enter: function () {
        MaterielElementsFirstLoad = true; Requests.getBookablesList(); $('inputTabCahierEquipmentElementsInputSearch').focus();
        $('divTabCahierTopList').children[1].style.opacity = 1;
    },
    Remove: function () {
        $('divTabCahierTopList').children[1].style.opacity = 0;
    }
});
tabs.push({ id: "divTabCahierConfirmation", order: 15, progress: 4, position: 0, TopBar: true, ListBar: false, title: "Confirmez et créez votre sortie", Enter: function () { loadConfirmation();}, Remove: function () { } });

//WINDOW LOCATION CHANGE
var OldElement = tabs[0];
var NewElement = tabs[0];
window.onhashchange = function () {

    var newLocation = window.location.toString();
    var res = newLocation.substr(newLocation.indexOf("#") + 1);

    if (res != currentTabElement.id) { //onload refresh

        var i0;
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].id == res) {
                i0 = i;
                NewElement = tabs[i];
                break;
            }
        }

        var sign = 1;
        if (NewElement.progress == 0 && OldElement.progress != 0 && NewElement.id != "divTabCahier") {
            sign = NewElement.order;
        }
        else if (NewElement.order < OldElement.order) {
            sign = -1;
        }

        changeTab($(NewElement.id), sign);

        // TopBar Enter/Remove
        if (NewElement.TopBar == true && OldElement.TopBar == false) {
            enterProgressBar(sign);
        }
        else if (NewElement.TopBar == false && OldElement.TopBar == true) {
            removeProgressBar(sign);
        }

        // ListBar Enter/Remove
        if (NewElement.ListBar == true && OldElement.ListBar == false) {
            enterListBar(sign);
            actualizeBookableList();
        }
        else if (NewElement.ListBar == false && OldElement.ListBar == true) {
            removeListBar(sign);
        }

        // Enter & Remove Functions
        NewElement.Enter();
        OldElement.Remove();

        // Change Title
        if (NewElement.title != undefined) {
            $('divTopBarText').innerHTML = NewElement.title;
        }
        else {
            $('divTopBarText').innerHTML = "Cahier de sortie";
        }

        // change ProgressBar
        changeProgress(NewElement.progress);

        // actualize Progress Bar // AFTER CHANGING PROGRESS
        Cahier.actualizeProgressBar();

        // save OldElement
        OldElement = NewElement;
    }
};




//ENTER PROGRESS BAR
function enterProgressBar() {
    $("divTabCahierTop").style.zIndex = 6;
    setTimeout(function () { $("divTabCahierTop").style.zIndex = 11; }, changeTime * 1000);
}
//REMOVE PROGRESS BAR
function removeProgressBar(sign) {
    $("divTabCahierTop").style.zIndex = "11"; //11
    $("divTabCahierTop").style.transition = "transform " + changeTime + "s linear 0s";
    $("divTabCahierTop").style.transform = "translate(" + (-sign) + "00%)";

    setTimeout(function () {

        $("divTabCahierTop").style.zIndex = "2";
        $("divTabCahierTop").style.transition = "none";

        $("divTabCahierTop").style.transform = "translate(0px)";

        setTimeout(function () { $("divTabCahierTop").style.transition = "transform " + changeTime + "s linear 0s"; }, 20);

    }, changeTime * 1000);
}


//ENTER LIST BAR
function enterListBar() {
    $("divTabCahierTopList").style.zIndex = 6;
    setTimeout(function () { $("divTabCahierTopList").style.zIndex = 11; }, changeTime * 1000);
}
//REMOVE LIST BAR
function removeListBar(sign) {
    $("divTabCahierTopList").style.zIndex = "11"; //11
    $("divTabCahierTopList").style.transition = "transform " + changeTime + "s linear 0s";
    $("divTabCahierTopList").style.transform = "translate(" + (-sign) + "00%)";

    setTimeout(function () {

        $("divTabCahierTopList").style.zIndex = "2";
        $("divTabCahierTopList").style.transition = "none";

        $("divTabCahierTopList").style.transform = "translate(0px)";

        setTimeout(function () { $("divTabCahierTopList").style.transition = "transform " + changeTime + "s linear 0s"; }, 20);

    }, changeTime * 1000);
}







//window.onresize = function (event) {
 //   var scrollBarLength = window.innerWidth - document.documentElement.clientWidth;
 //   AdjustScreen(window.innerWidth - scrollBarLength, window.innerHeight);    //2*window.innerWidth  - document.documentElement.clientWidth
//};


//var widthScreen;
//var heightScreen;
//var widthToDisplay;
//var SmallerThan1500px = false;
//var SpaceLeft = 300;
//function AdjustScreen(w, h) {

   // var MaxWidth = 1500;

   // widthScreen = w;
   // heightScreen = h;

   //// var _divLeftBar = $('divLeftBar').style;
   //// var _divRightBar = $('divRightBar').style;

   // if (w > MaxWidth) { //Plus grand que le max -> Barres sur les côtés
   //     widthCache = (w - 1500) / 2;
   //     widthToDisplay = 1500;
   //     SmallerThan1500px = false;
   // }
   // else { //Plus petit donc pas de barres et compression ?
   //     widthCache = 0;
   //     widthToDisplay = widthScreen;
   //     SmallerThan1500px = true;
   // }
//}