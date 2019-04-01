function popUser(nbr = 0, elem = openPopUp()) {

    //if (elem == $("divTabCahierMemberContainer")) {
    //    elem.innerHTML = "";
    //}

    var container;
    container = div(elem);
    container.id = nbr;
    container.classList.add("PopUpUserContainer");

    if (elem != $("divTabCahierMemberContainer")) {
        container.classList.add("Boxes");
        var close = div(container);
        close.className = "divPopUpClose";
        close.onclick = function () {
            closePopUp({ target: elem }, elem);
        };
        var d = div(container);
        d.style.textAlign = "center";
        d.style.fontSize = "25px";
        d.innerHTML = "Nom et prénom du membre";

        grayBar(container, 5);
    }



    var i1 = document.createElement("input");
    i1.autocomplete = "off";
    i1.id = "inputTabCahierSearch";
    i1.title = "Veuillez écrire votre nom et prénom";
    i1.spellcheck = "false";
    i1.type = "text";
    i1.placeholder = "Entrez votre nom, prénom...";
    i1.onkeyup = function (event) {
        if (this.value.length > 2) {
            Search(event);
        }
        else {
            $("divTabCahierSearchResult").innerHTML = "<div style='margin-top:10px; color:var(--fontBlack);'>Veuillez taper au moins trois caractères</div>";
        }
    };
    i1.onkeydown = function (event) {SearchDown(event);};
    container.appendChild(i1);

    if (elem != $("divTabCahierMemberContainer")) {
        i1.focus();
    }

    var d = div(container);
    d.id = "divTabCahierSearchResult";

}




var enterSearchPosition = 0;
function Search(e) {

    var text = $("inputTabCahierSearch").value.toUpperCase();

    if (e.keyCode == 13) {
        var all = document.getElementsByClassName("divTabCahierResultEntry");
        for (var i = 0; i < all.length; i++) {

            if (typeof all[i].getElementsByTagName("img")[0] != "undefined") {
                var _firstName = all[i].getElementsByClassName("spanTabCahierFirstName")[0].innerHTML;
                var _surName = all[i].getElementsByClassName("spanTabCahierSurName")[0].innerHTML;
                var _id = lastPeople[all[i].id].id;
                var _sex = lastPeople[all[i].id].sex; // modifier

                var nbr = parseInt(document.getElementsByClassName('PopUpUserContainer')[0].id); // modifier problem si plusieurs popUp ouverts...

                var owner = { id: _id, firstName: _firstName, surName: _surName, sex: _sex };

                Cahier.setOwner(nbr, owner);
            }
        }
    }
    else if (e.keyCode == 40 || e.keyCode == 38) {
            //do nothing
    }
    else { //text != ""
        Requests.getUsersList(text, 5);
        enterSearchPosition = 0;
    }
}


function SearchDown(e) {
    if (e.keyCode == 40 || e.keyCode == 38) {
        if (e.keyCode == 40) {
            enterSearchPosition++;
        }
        else {
            enterSearchPosition--;
        }
        if (lastPeople.length != 0) {

            for (var i = 0; i < lastPeople.length; i++) {

                var elem = document.getElementsByClassName("divTabCahierResultEntry")[i];

                elem.style.backgroundColor = "";
                if (typeof elem.getElementsByTagName("img")[0] != "undefined") {
                    elem.removeChild(elem.getElementsByTagName("img")[0]);
                }
                if (i == (enterSearchPosition % lastPeople.length + lastPeople.length) % lastPeople.length) {
                    var img = document.createElement("img");
                    img.id = "imgTabCahierSearchEnter";
                    img.src = "img/icons/enter.png";
                    elem.appendChild(img);

                    elem.style.backgroundColor = "darkgray";
                }
            }
        }
        e.preventDefault();
    }
}


var lastPeople = [];
function createSearchEntries(PeopleCorresponding) {

    lastPeople = PeopleCorresponding;

    $("divTabCahierSearchResult").innerHTML = "";

    if (PeopleCorresponding.length == 0) {
        var divResult = document.createElement("div");
        divResult.classList.add("divTabCahierResultEntry");
        $("divTabCahierSearchResult").appendChild(divResult);

        var span1 = document.createElement("span");
        span1.classList.add("spanTabCahierSurName");
        span1.innerHTML = "Aucun résultat - Cliquez pour vous rendre sur <c style='color:blue; text-decoration:underline;'> ichtus.ch </c>";
        span1.onclick = function () {
            var win = window.open("https://ichtus.ch", '_blank');
            win.focus();
        };
        divResult.appendChild(span1);

        divResult.style.backgroundImage = "url(img/icons/no-result.png)";

        lastPeople = [];
    }
    else {

        for (var i = 0; i < PeopleCorresponding.length; i++) {
            var divResult = document.createElement("div");
            //  divResult.id = PeopleCorresponding[i].id;
            divResult.classList.add("divTabCahierResultEntry");
            $("divTabCahierSearchResult").appendChild(divResult);

            var nbr = parseInt(document.getElementsByClassName('PopUpUserContainer')[0].id); // modifier problem si plusieurs popUp ouverts...

            divResult.id = i;

            divResult.addEventListener("mousedown", function () { Cahier.setOwner(nbr, { id: PeopleCorresponding[this.id].id, firstName: PeopleCorresponding[this.id].name.split(" ")[0], surName: PeopleCorresponding[this.id].name.split(" ")[1], sex: PeopleCorresponding[this.id].sex });  });

            var span1 = document.createElement("span");
            span1.classList.add("spanTabCahierSurName");
            span1.innerHTML = PeopleCorresponding[i].name.split(" ")[1]; //.firstN/name
            divResult.appendChild(span1);

            var span2 = document.createElement("span");
            span2.classList.add("spanTabCahierFirstName");
            span2.innerHTML = PeopleCorresponding[i].name.split(" ")[0]; //.surname //lastName ???
            divResult.appendChild(span2);

            if (i == 0) {
                var img = document.createElement("img");
                img.id = "imgTabCahierSearchEnter";
                img.src = "img/icons/enter.png";
                divResult.appendChild(img);

                divResult.style.backgroundColor = "darkgray";
            }

            if (PeopleCorresponding[i].sex == "male") {
                divResult.style.backgroundImage = "url(img/icons/man.png)";
            }
            else {
                divResult.style.backgroundImage = "url(img/icons/woman.png)";
            }
        }
    }
}


