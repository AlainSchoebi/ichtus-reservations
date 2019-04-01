function actualizeBookableList() {

    var bookables = Cahier.bookings[0].bookables;

    $('divTabCahierTopList').children[0].innerHTML = "";
    $('divTabCahierTopList').children[0].style.opacity = "1";
    $('divTabCahierTopList').style.visibility = "visible";

    for (let i = 0; i < bookables.length; i++) {
        var d = div($('divTabCahierTopList').children[0]);
        d.id = i;

        if (Cahier.bookings[0].bookables[i] != Cahier.personalBookable) {
            d.onclick = function (event) {
                if (event.target == this.children[0] || event.target == this.children[2]) {
                    popBookable(Cahier.bookings[0].bookables[this.id].id);
                }
            };
        }
        else {
            d.classList.add("PersonalSail");
        }

        var img = div(d);
        img.style.backgroundImage = Cahier.getImageUrl(Cahier.bookings[0].bookables[i]);

        var close = div(d);
        close.id = i;
        close.onclick = function () {
            Cahier.removeBookable(0, Cahier.bookings[0].bookables[this.id]);
        };

        var code = div(d);
        code.innerHTML = bookables[i].code;
    }



    if (bookables.length == 0) {

        $('divTabCahierTopList').children[0].style.opacity = "0";
        $('divTabCahierTopList').style.visibility = "hidden";

        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i].ListBar == true) {
                $(tabs[i].id).classList.remove("listBarActive");
            }
        }
        $("btnNext").classList.remove("activated");
    }
    else {
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i].ListBar == true) {
                $(tabs[i].id).classList.add("listBarActive");
            }
        }
        $("btnNext").classList.add("activated");
    }

}