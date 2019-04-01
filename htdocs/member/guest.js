function popGuest(nbr = 0) {
    var elem = openPopUp();

    var container;
    container = div(elem);
    container.id = nbr;
    container.classList.add("PopUpGuestContainer");
    container.classList.add("Boxes");

    var close = div(container);
    close.className = "divPopUpClose";
    close.onclick = function () {
        closePopUp({ target: elem }, elem);
    };

    var d = div(container);
    d.style.textAlign = "center";
    d.style.fontSize = "25px";
    d.innerHTML = "Nom et prénom de l'invité";

    grayBar(container, 5);

    div(container);

    var i1 = document.createElement("input");
    container.appendChild(i1);
    i1.placeholder = "Nom";
    i1.spellcheck = "false";

    var i2 = document.createElement("input");
    i2.placeholder = "Prénom";
    i2.spellcheck = "false";
    i2.addEventListener("keyup", function (event) {
        if (event.keyCode == 13) {
            ValidateGuest();
        }
    });
    container.appendChild(i2);

    var b = div(container);
    b.classList.add("Buttons");
    b.classList.add("ValidateButtons");
    b.innerHTML = "Suivant";
    b.style.backgroundPositionX = "115px";
    b.addEventListener("click", function () {
        ValidateGuest();
    });
}


function ValidateGuest() {
    var c = document.getElementsByClassName('PopUpGuestContainer')[0];
    var i = c.getElementsByTagName("input");
    if (i[0].value.length < 2) {
        i[0].style.borderColor = "red";
        i[0].previousElementSibling.style.backgroundColor = "red";
    }
    else {
        i[0].style.borderColor = "black";
        i[0].previousElementSibling.style.backgroundColor = "white";
    }
    if (i[1].value.length < 2) {
        i[1].style.borderColor = "red";
    }
    else {
        i[1].style.borderColor = "black";
    }

    if (i[0].style.borderColor == "black" && i[1].style.borderColor == "black") {

        var owner = { };
        var guest = true;
        var guestName = i[0].value.capitalize() + " " + i[1].value.capitalize();
        var nbr = parseInt(document.getElementsByClassName('PopUpGuestContainer')[0].id);

        Cahier.setOwner(nbr, owner, guest, guestName);
        closePopUp({ target: c.parentElement }, c.parentElement);
    }


}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};