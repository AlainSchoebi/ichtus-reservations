function popAlert(txt = "haha ahah ahah ") {

    var elem = openPopUp();

    var container;
    container = div(elem);
    container.classList.add("PopUpAlertContainer");
    container.classList.add("Boxes");

    var close = div(container);
    close.className = "divPopUpClose";
    close.onclick = function () {
        closePopUp({ target: elem }, elem);
    };

    var d = div(container);
    d.style.textAlign = "center";
    d.style.fontSize = "25px";
    d.innerHTML = "!";

    grayBar(container, 5);

    var t = div(container);
    t.innerHTML = txt;
}

function popAlertAlreadyHavingABooking(_owner) {
    var elem = openPopUp();

    var container;
    container = div(elem);
    container.classList.add("PopUpAlertContainer","booking");
    container.classList.add("Boxes");

    var close = div(container);
    close.className = "divPopUpClose";
    close.onclick = function () {
        closePopUp({ target: elem }, elem);
    };

    var d = div(container);
    d.style.textAlign = "center";
    d.style.fontSize = "25px";
    d.innerHTML = "!";

    grayBar(container, 5);

    var t = div(container);
    t.innerHTML = "Il semblerait que vous ayiez déjà une sortie en cours";

    var btnContainer = div(container);
    btnContainer.style.position = "relative";
    btnContainer.style.textAlign = "center";

    var btn = div(btnContainer);
    btn.classList.add("Buttons");
    btn.style.display = "inline-block";
    btn.innerHTML = "Voir les sorties";
    btn.addEventListener("click", function () { newTab("divTabCahier"); closePopUp("last"); });

    btn = div(btnContainer);
    btn.classList.add("Buttons", "ValidateButtons");
    btn.style.display = "inline-block";
    btn.innerHTML = "Continuer";
    btn.addEventListener("click", function () { Cahier.setOwner(0, _owner,true); closePopUp("last"); });
}