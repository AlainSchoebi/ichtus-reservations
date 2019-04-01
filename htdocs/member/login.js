function popLogin() {
    var elem = openPopUp();

    var container;
    container = div(elem);
    container.classList.add("PopUpLoginContainer");
    container.classList.add("Boxes");

    var close = div(container);
    close.className = "divPopUpClose";
    close.onclick = function () {
        closePopUp({ target: elem }, elem);
    };

    var d = div(container);
    d.style.textAlign = "center";
    d.style.fontSize = "25px";
    d.innerHTML = "Connexion";

    grayBar(container, 5);

    div(container);

    var i = input(container);
    i.type = "password";
    i.placeholder = "Mot de passe";
    i.addEventListener("keyup", function (event) {if (event.keyCode == 13) { Requests.login(this.value); } });

    var b = div(container);
    b.classList.add("Buttons");
    b.classList.add("ValidateButtons");
    b.innerHTML = "Connexion";
    b.addEventListener("click", function () { Requests.login(this.parentElement.getElementsByTagName("input")[0].value); });
}