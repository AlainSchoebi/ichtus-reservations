function popCahierInfos(nbr) {

    var elem = openPopUp();

    var container;
    container = div(elem);
    container.id = nbr;
    container.classList.add("PopUpCahierInfosContainer");
    container.classList.add("Boxes");

    var close = div(container);
    close.className = "divPopUpClose";
    close.onclick = function () {
        closePopUp({ target: elem }, elem);
    };

    var d = div(container);
    d.style.textAlign = "center";
    d.style.fontSize = "25px";
    d.innerHTML = "Informations";

    grayBar(container, 5);

    var c = div(container);
    c.classList.add("divTabCahierFieldsContainer");

        var divParticipantCount = div(c);
        divParticipantCount.classList.add("TabCahierFields");
        divParticipantCount.classList.add("divTabCahierInfosNbrInvites");
        divParticipantCount.innerHTML += "Nbr de participants";

            var i = input(divParticipantCount);
            i.type = "number";
            i.min = "1";
            i.max = "20";
            i.value = Cahier.bookings[nbr].participantCount;
            i.placeholder = "1";
            i.addEventListener("keyup",  function () {
                writeNbrInvites(this);
            });
            i.addEventListener("focusin", function () {
                this.value = "";
                writeNbrInvites(this);
                focusInOrOut(this, true);
            });
            i.addEventListener("focusout",  function () {
                if (this.value == '') { this.value = '1'; writeNbrInvites(this); }
                focusInOrOut(this, false);
            });

            div(divParticipantCount);

            var p = div(divParticipantCount);
            p.classList.add("PropositionsContainer");
            p.classList.add("divTabCahierInfosNbrInvitesPropositions");
            div(p).innerHTML = "1";
            div(p).innerHTML = "2";
            div(p).innerHTML = "3";
            div(p).innerHTML = "4";
            div(p).innerHTML = "5";
            div(p).innerHTML = "8";
            div(p).innerHTML = "10";

            var info = div(divParticipantCount);
            info.innerHTML = "(Vous inclu / minimum 1)";
            info.style.position = "absolute";
            info.style.marginTop = "110px";
            info.style.textAlign = "center";
            info.style.width = "100%";
            info.style.fontSize = "15px";

            writeNbrInvites(i);



    var divDestination = div(c);
    divDestination.classList.add("TabCahierFields");
    divDestination.classList.add("divTabCahierInfosDestination");
    divDestination.innerHTML += "Destination";

        var i = input(divDestination);
        i.value = Cahier.bookings[nbr].destination;
        i.placeholder = "Destination";
        i.addEventListener("keyup", function () {
            writeDestination(this);
        });
        i.addEventListener("focusin", function () {
            writeDestination(this);
            focusInOrOut(this, true);
        });
        i.addEventListener("focusout", function () {
            writeDestination(this);
            focusInOrOut(this, false);
        });

        div(divDestination);

        var p = div(divDestination);
        p.classList.add("PropositionsContainer");
        p.classList.add("divTabCahierInfosDestinationPropositions");
        div(p).innerHTML = "Baie";
        div(p).innerHTML = "La Ramée";
        div(p).innerHTML = "La Tène";
        div(p).innerHTML = "Neuchâtel";
        div(p).innerHTML = "Cudrefin";

        writeDestination(i);



    var divStartComment = div(c);
    divStartComment.classList.add("TabCahierFields");
    divStartComment.classList.add("divTabCahierInfosStartComment");
    divStartComment.innerHTML += "Commentaire";

        var area = document.createElement("textarea");
        divStartComment.appendChild(area);
        area.value = Cahier.bookings[nbr].startComment;
        area.spellcheck = "false";
        area.placeholder = "Informations, numéro de téléphone, heure estimée de retour...";

        div(divStartComment).style.height = "100px";


    createAllPropositions(c);

    //var t = div(container);
    //t.style.textAlign = "center";
    //t.innerHTML = "Les champs avec un * sont obligatoires !";
    //br(container);

    var btnContainer = div(container);
    btnContainer.style.position = "relative";
    btnContainer.style.textAlign = "center";

        var btn = div(btnContainer);
        btn.classList.add("Buttons");
        btn.classList.add("ValidateButtons");
        btn.style.display = "inline-block";
        btn.innerHTML = "Valider";
        btn.addEventListener("click", function () { checkInfos(elem, nbr); });
}







//    <div style="text-align:center; margin-left:2.5%">Les champs avec un * sont obligatoires !</div>

//    <br />

//    <div style="text-align:center;">
//        <div class="Buttons ValidateButtons" onclick="checkInfos();">Suivant</div>
//    </div>