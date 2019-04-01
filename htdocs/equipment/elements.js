var currentBookables;
function loadElements(bookables ,nbr = 0) {

    currentBookables = bookables;

    document.getElementsByClassName("divTabCahierEquipmentElementsContainer")[0].innerHTML = "";

    var codes = [];
    for (var i = 0; i < Cahier.bookings[nbr].bookables.length; i++) {
        codes.push(Cahier.bookings[nbr].bookables[i].code);
    }

    for (var i = 0; i < bookables.length; i++) {

        container = document.createElement("div");
        container.id = i;

        if (codes.findIndex(bookables[i].code) != -1) {
            container.classList.add("selected");
            container.onclick = function (event) {
                if (!(event.target.classList.contains("infoJS"))) {
                    Cahier.removeBookable(nbr, bookables[this.id]);
                    actualizeElements();
                }
            };
        }
        else {
            container.onclick = function (event) {
                if (!(event.target.classList.contains("infoJS"))) {
                    Cahier.addBookable(nbr, bookables[this.id]);
                    actualizeElements();
                }
            };
        }

        document.getElementsByClassName("divTabCahierEquipmentElementsContainer")[0].appendChild(container);

        var secondContainer = document.createElement("div");
        container.appendChild(secondContainer);

        var size = document.createElement("div");
        size.innerHTML = bookables[i].code;
        secondContainer.appendChild(size);

        var bottom = document.createElement("div");
        secondContainer.appendChild(bottom);

        var brand = div(bottom);
        brand.innerHTML = bookables[i].name.shorten(160*2,20);

      //  model = div(bottom);
      //  model.innerHTML = bookables[i].id;

        var background = div(secondContainer);
        background.style.backgroundImage = Cahier.getImageUrl(bookables[i]);

        var selection = div(secondContainer);

        var info = div(secondContainer);
        info.id = bookables[i].id;
        info.classList.add("infoJS");
        info.onclick = function () {
            popBookable(this.id);
        };

    }
    if (bookables.length == 0) {
        var d = div(document.getElementsByClassName("divTabCahierEquipmentElementsContainer")[0]);
        d.innerHTML = "Aucun résultat";
        //console.log('Aucun résultat');
    }
}



function actualizeElements() {

    var bookables = currentBookables;

    var codes = [];
    for (var i = 0; i < Cahier.bookings[0].bookables.length; i++) {
        codes.push(Cahier.bookings[0].bookables[i].code);
    }

    var containers = document.getElementsByClassName("divTabCahierEquipmentElementsContainer")[0].children;

    for (var i = 0; i < containers.length; i++) {

        var container = containers[i];

        if (codes.findIndex(bookables[i].code) != -1) {
            container.classList.add("selected");
            container.onclick = function (event) {
                if (!(event.target.classList.contains("infoJS"))) {
                    Cahier.removeBookable(0, bookables[this.id]);
                    actualizeElements();
                }
            };
        }
        else {
            container.classList.remove("selected");
            container.onclick = function (event) {
                if (!(event.target.classList.contains("infoJS"))) {
                    Cahier.addBookable(0, bookables[this.id]);
                    actualizeElements();
                }
            };
        }


    }
}

function clickSortIcon(elem) {
    if (elem.style.backgroundImage == 'url("img/icons/sort-desc.png")') {
        elem.style.backgroundImage = 'url("img/icons/sort-asc.png")';
    }
    else {
        elem.style.backgroundImage = 'url("img/icons/sort-desc.png")';
    }
}


function changeSelectCategorie(elem) {
    //console.log(elem.value);
    $('divTabCahierEquipmentElementsSelectCategorie').getElementsByTagName("div")[0].style.backgroundImage = "url(img/categorie/" + elem.value + ".png)";
}
