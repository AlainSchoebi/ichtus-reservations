var Server;
function ServerInitialize() {
    // Get the API
    Server = window.ichtusApi;
    //console.log('Server(API) = ', Server);
}


var Requests = {

    // login
    login: function (pwd) {
        Server.userService.login({
            login: 'bookingonly',
            password: pwd
        }).subscribe(result => {
            //console.log(result);
            closePopUp("last");
            location.reload();
            });
    },

    // actualizeLoginButton
    checkLogin: function () {
        Server.userService.getCurrentUser().subscribe(function (user) {
            if (!user) {
                // pas connecté
                console.error("Pas connecté");
                popLogin();
            } else {
                // connecté
                console.warn("Connecté");
                Requests.getActualBookingList();
            }
        });
    },


    // getUsersList FOR user.js
    getUsersList: function (text = "") {
        var filter = {
            filter: {
                groups: [
                    { conditions: [{ custom: { search: { value: '%' + text + '%' } } }] }
                ]
            },
            pagination: {
                pageSize: 5,
                pageIndex: 0
            },
            sorting: [{
                field: 'lastName',
                order: 'ASC'
            },
            {   //if same family name sort by firstName
                field: 'firstName',
                order: 'ASC'
            }]
        };

        var variables = new Server.QueryVariablesManager();
        variables.set('variables', filter);

        Server.userService.getAll(variables).subscribe(result => {
            //console.log("getUsersList(): ", result);
            createSearchEntries(result.items);
        });
    },

    // getBookablesList
    getBookablesList: function (elem = $('inputTabCahierEquipmentElementsInputSearch')) { //

        var order;
        if ($('divTabCahierEquipmentElementsSelectIconSort').style.backgroundImage == 'url("img/icons/sort-desc.png")') {
            order = "DESC";
        }
        else {
            order = "ASC";
        }

        var lastUse = false;
        var nbrBookings = false;
        var whichField = $('divTabCahierEquipmentElementsSelectSort').getElementsByTagName("select")[0].value;
        if (whichField == "lastUse") { whichField = "id"; lastUse = true; }
        if (whichField == "nbrBookings") { whichField = "id"; nbrBookings = true; }

        var txt = elem.value;

        var categorie = $('divTabCahierEquipmentElementsSelectCategorie').getElementsByTagName("select")[0].value;
        if (categorie == "all") { categorie = ""; }
        if (categorie == "Canoe_Kayak") { categorie = "Kayak"; }
        if (categorie == "Voile") { categorie = "Voile lestée"; }

        var f = {
            filter: {
                groups: [
                    {
                        groupLogic: 'AND',
                        conditionsLogic: 'AND',
                        conditions: [
                            {
                                custom: { // marche pour description
                                    search: {
                                        value: "%" + txt + "%"
                                    }
                                },
                                bookingType: {
                                    like: {
                                        value: "self_approved"
                                    }
                                }
                            }
                        ]
                    },
                    {   //CATEGORIES...
                        groupLogic: 'AND',
                        conditionsLogic:'OR',
                        joins: {
                            bookableTags: {
                                conditions: [
                                    {
                                        name: {
                                            like: {
                                                value: "%" + categorie + "%"
                                            }
                                        }
                                    }
                                ]
                            }
                        }

                    }
                ]
            },
            sorting: [
                { field: whichField, order: order }
            ],
            pagination: {
                pageSize: parseInt($('divTabCahierEquipmentElementsSelectPageSize').getElementsByTagName('select')[0].value),
                pageIndex: 0
            }
        };

        if (categorie == "Kayak") {
            f.filter.groups[1].joins.bookableTags.conditions.push({
                name: {
                    like: {
                        value: "%" + "Canoë" + "%"
                    }
                }
            });
        }
        else if (categorie == "Voile lestée") {
            f.filter.groups[1].joins.bookableTags.conditions.push({
                name: {
                    like: {
                        value: "%" + "voile légère" + "%"
                    }
                }
            });
        }

        var variables = new Server.QueryVariablesManager();
        variables.set('variables', f);

        Server.bookableService.getAll(variables).subscribe(result => {
            //console.log("getBookablesList(): ", result);

            if (!lastUse && !nbrBookings || result.items.length == 0) {
                loadElements(result.items);
            }
            else if (lastUse) {

                //console.log("lastUse ! ");

                var bookings = [];
                bookings.fillArray(result.items.length,"1111-01-02T13:32:51+01:00");

                for (var i = 0; i < result.items.length; i++) {

                    var filter = {
                        filter: {
                            groups: [
                                { conditions: [{ bookables: { have: { values: [result.items[i].id] } } }] }
                            ]
                        },
                        pagination: {
                            pageSize: 1,
                            pageIndex: 0
                        },
                        sorting: [
                            {
                                field: "startDate",
                                order: "DESC" //get the latest booking !
                            }
                        ]
                    };

                    var counter = 0;

                    var variables = new Server.QueryVariablesManager();
                    variables.set('variables', filter);

                    Server.bookingService.getAll(variables).subscribe(r => {

                        //console.log(r);

                        if (r.items.length != 0) {         // else : already a zero ? maybe change to start of the universe lol hhaa
                            var bookableId = r.items[0].bookables[0].id;
                            //console.log(bookableId);

                            var c = -1;
                            var firstArray = result.items;
                            for (var i = 0; i < firstArray.length; i++) {
                                if (firstArray[i].id == bookableId) {
                                    c = i;
                                    break;
                                }
                            }

                            bookings[c] = r.items[0].startDate;
                        }

                        counter++;

                        if (counter == result.items.length) {
                            result.items.sortBy(bookings, order);
                            loadElements(result.items);
                        }
                    });
                }
            }
            else if (nbrBookings) {
                //console.log("nbrBookings ! ");

                var bookings = [];
                bookings.fillArray(result.items.length,0);

                for (var i = 0; i < result.items.length; i++) {

                    var filter = {
                        filter: {
                            groups: [
                                { conditions: [{ bookables: { have: { values: [result.items[i].id] } } }] }
                            ]
                        },
                        pagination: {
                            pageSize: 1,
                            pageIndex:0 // just for identifying the id
                        }
                    };

                    var counter = 0;

                    var variables = new Server.QueryVariablesManager();
                    variables.set('variables', filter);

                    Server.bookingService.getAll(variables).subscribe(r => {

                        if (r.items.length == 0) {
                            //console.log("no booking");
                        }
                        else {
                             // r.length != r.items.length           !! not the same
                            var bookableId = r.items[0].bookables[0].id;
                            //console.log(bookableId);

                            var c = -1;
                            var firstArray = result.items;
                            for (var i = 0; i < firstArray.length; i++) {
                                if (firstArray[i].id == bookableId) {
                                    c = i;
                                    break;
                                }
                            }

                            bookings[c] = r.length; // not items.length !
                        }

                        counter++;

                        if (counter == result.items.length) {
                            result.items.sortBy(bookings, order);
                            loadElements(result.items);
                        }
                    });
                }
            }
            else {
                alert("mmmhh.");
            }

        });
    },


    // getBookableNbrForBookableTag()
    getBookableNbrForBookableTag: function (bookableTag, elem, before = "", after = "") {

        if (bookableTag == "Canoe_Kayak") { bookableTag = "Kayak"; }
        if (bookableTag == "Voile") { bookableTag = "Voile lestée"; }

        var filter = {
            filter: {
                groups: [{
                    conditionsLogic:'OR',
                    joins: {
                        bookableTags: {
                            conditions: [
                                {
                                    name: {
                                        like: {
                                            value: "%" + bookableTag + "%"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
                ]
            },
            pagination: {
                pageSize: 0,
                pageIndex: 0
            }
        };

         if (bookableTag == "Kayak") {
            filter.filter.groups[0].joins.bookableTags.conditions.push({
                name: {
                    like: {
                        value: "%" + "Canoë" + "%"
                    }
                }
            });
        }
        else if (bookableTag == "Voile lestée") {
             filter.filter.groups[0].joins.bookableTags.conditions.push({
                 name: {
                     like: {
                         value: "%" + "voile légère" + "%"
                     }
                 }
             });
         }

        var variables = new Server.QueryVariablesManager();
        variables.set('variables', filter);

        Server.bookableService.getAll(variables).subscribe(result => {
            var txt = before + result.length + after;
            elem.innerHTML = txt;
        });
    },


    // getBookableByCode
    getBookableByCode: function (elem,nbr = 0) {

        t = true;
        for (var i = 0; i < Cahier.bookings[0].bookables.length; i++) {
            //console.log(Cahier.bookings[0].bookables[i].code, elem.value);
            if (Cahier.bookings[0].bookables[i].code.toUpperCase() == elem.value.toUpperCase()) {
                t = false;
            }
        }
        if (!t) {
            popAlert("Vous avez déjà choisi cette embarcation");
        }
        else {
            var filter = {
                filter: {
                    groups: [
                        {
                            conditions: [
                                { code: { like: { value: elem.value } } },
                                {
                                    bookingType: {
                                        like: {
                                            value: "self_approved"
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                },
                pagination: {
                    pageSize: 1,
                    pageIndex: 0
                }
            };

            var variables = new Server.QueryVariablesManager();
            variables.set('variables', filter);

            Server.bookableService.getAll(variables).subscribe(result => {
                //console.log("getBookableByCode(): ", result);
                if (result.items.length == 1) {
                    popBookable(result.items[0].id, false, nbr, $('divTabCahierEquipmentBookableContainer'));

                    elem.classList.remove("animationShake");
                    elem.nextElementSibling.classList.remove("animationShake");
                }
                else {
                    // retrigger animation
                    elem.classList.remove("animationShake");
                    elem.nextElementSibling.classList.remove("animationShake");

                    elem.classList.add("resetAnimation");
                    elem.nextElementSibling.classList.add("resetAnimation");

                    setTimeout(function () {
                        elem.classList.remove("resetAnimation");
                        elem.nextElementSibling.classList.remove("resetAnimation");

                        elem.classList.add("animationShake");
                        elem.nextElementSibling.classList.add("animationShake");

                        //elem.style.borderColor = "red";
                        //elem.nextElementSibling.style.backgroundColor = "red";
                    }, 5);

                }
            });
        }
    },

    // getBookableInfos
    getBookableInfos: function (nbr, bookableId,elem) {

        var filter = {
            filter: {
                groups: [
                    { conditions: [{ id: { like: { value: bookableId } } }] }
                ]
            },
            pagination: {
                pageSize: 1,
                pageIndex: 0
            },
            sorting: [{
                field: "id", //USELESS
                order: "ASC" //USELESS
            }]
        };

        var variables = new Server.QueryVariablesManager();
        variables.set('variables', filter);

        Server.bookableService.getAll(variables).subscribe(result => {
            //console.log("getBookableInfos(): ", result);

            var filter = {
                filter: {
                    groups: [
                        {
                            joins: {
                                bookables: {
                                    conditions: [{
                                        id: {
                                            like: {
                                                value: bookableId
                                            }
                                        }
                                    }]
                                }
                            }
                        }
                    ]
                },
                pagination: {
                    pageSize: 1,
                    pageIndex: 0
                },
                sorting: [{
                    field: "startDate", //USELESS
                    order: "DESC" //USELESS
                }]
            };

            var variables = new Server.QueryVariablesManager();
            variables.set('variables', filter);

            Server.bookingService.getAll(variables).subscribe(bookings => {
                //console.log("getBookableInfos()_getLastBooking: ", bookings);


                var filter = {
                    filter: {
                        groups: [{
                            conditions: [{
                                bookable: {
                                    have:
                                        { values: [bookableId] }

                                }
                            }
                            ]
                        }]
                    }
                };

                var variables = new Server.QueryVariablesManager();
                variables.set('variables', filter);

                Server.bookableMetaDataService.getAll(variables).subscribe(metadatas => {
                   //console.log("getBookableInfos()_getMetadatas: ", metadatas);
                    actualizePopBookable(nbr, result.items[0], bookings, elem, metadatas.items); //metadatas.items);
                });
            });
        });
    },


    // Add an item NO MORE USED
    addBookable: function (_name, _description) {

        const item = { name: "1", description: "kj", bookingType: "self_approved", type: 6004 };

        Server.bookableService.create(item).subscribe(result => {
            //console.log('Bookable created', result);
        });

    },

    // getActualBookingList()
    getActualBookingList: function () {

        var filter = {
            filter: {
                groups: [
                    {
                        groupLogic:"AND",

                        conditions: [{
                                status: {
                                    equal: {
                                        value: "booked"
                                    }
                                },
                                endDate: {
                                    null: {
                                        not: false
                                    }
                                },
                                bookables: {
                                    empty: {
                                        not: true
                                    }
                                }

                            }
                        ],
                        joins: {
                            bookables: {
                                type:"leftJoin",
                                conditions: [{
                                    bookingType: {
                                        equal: {
                                            value: "self_approved"
                                        }
                                    }
                                }]
                            }
                        }

                    },
                    {
                        groupLogic: "OR",

                        conditions: [{
                            status: {
                                equal: {
                                    value: "booked"
                                }
                            },
                            endDate: {
                                null: {
                                    not: false
                                }
                            },
                            bookables: {
                                empty: {
                                    not:false
                                }
                            }
                        }
                        ]
                    }


                ]
            },
            pagination: {
                pageSize: 100,
                pageIndex: 0
            },
            sorting: [
                {
                    field: "id",
                    order: "ASC"
                }
            ]
        };

        var variables = new Server.QueryVariablesManager();
        variables.set('variables', filter);

        Server.bookingService.getAll(variables, true).subscribe(result => { // force = true
            var send = transformBookings(result.items);
            loadActualBookings(send);
        });

    },

    // getFinishedBookingListForDay()
    getFinishedBookingListForDay: function (d = new Date(),table = "?", title) {

        var start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
        var end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0, 0);

        var filter = {
            filter: {
                groups: [
                    {

                        groupLogic: "AND",

                        conditions: [{
                            status: {
                                equal: {
                                    value: "booked"
                                }
                            },
                            endDate: {
                                null: {
                                    not: true
                                }
                            },
                            startDate: {
                                between: {
                                    from: start.toISOString(),
                                    to: end.toISOString()
                                }
                            },
                            bookables: {
                                empty: {
                                    not: true
                                }
                            }

                        }
                        ],
                        joins: {
                            bookables: {
                                type: "leftJoin",
                                conditions: [{
                                    bookingType: {
                                        equal: {
                                            value: "self_approved"
                                        }
                                    }
                                }]
                            }
                        }

                    },
                    {
                        groupLogic: "OR",

                        conditions: [{
                            status: {
                                equal: {
                                    value: "booked"
                                }
                            },
                            endDate: {
                                null: {
                                    not: true
                                }
                            },
                            startDate: {
                                between: {
                                    from: start.toISOString(),
                                    to: end.toISOString()
                                }
                            },
                            bookables: {
                                empty: {
                                    not: false
                                }
                            }
                        }]
                    }
                    ]
            }
        };

        var variables = new Server.QueryVariablesManager();
        variables.set('variables', filter);

        Server.bookingService.getAll(variables, true).subscribe(result => {// force = true);
            //console.log("getFinishedBookingListForDay(): ", result);
            var transformedBoookings = transformBookings(result.items);
            if (result.length == 0) {
                createNoBookingMessage(d);
            }
            else {
                table = createBookingsTable(d, title + " (" + transformedBoookings.length + ")");
                Cahier.finishedBookings.push(transformedBoookings); //important
                actualizeFinishedBookingListForDay(transformedBoookings, table);
            }
        });
    },



    // getBookableHistory()
    getBookableHistory: function (bookableId, elem, lastDate, Size = 10) {

        //console.log("getbookableHistory", bookableId, "lastDate:", lastDate, "Size",Size);

        var filter = {
            filter: {
                groups: [
                    {
                        joins: {
                            bookables: {
                                conditions: [{
                                    id: {
                                        like: {
                                            value: bookableId
                                        }
                                    }
                                }]
                            }
                        }
                    },
                    {
                        conditions: [{
                            startDate: {
                                less: {
                                    value: lastDate.toISOString()
                                }
                            }
                        }]
                    }
                ]
            },
            pagination: {
                pageSize: Size,
                pageIndex: 0
            },
            sorting: [{
                field: "startDate",
                order: "DESC"
            }]
        };

        var variables = new Server.QueryVariablesManager();
        variables.set('variables', filter);

        Server.bookingService.getAll(variables).subscribe(first => {
            //console.log("getBookableHistory(): ", first);

            var bookings = first.items;

            if (first.items.length == 0) {
                if (elem.getElementsByClassName("Buttons").length == 1) {
                    elem.getElementsByClassName("Buttons")[0].parentElement.removeChild(elem.getElementsByClassName("Buttons")[0]);
                    elem.getElementsByTagName("br")[0].parentElement.removeChild(elem.getElementsByTagName("br")[0]);
                    var t = div(elem.getElementsByClassName("PopUpBookableHistoryContainerScroll")[0]);
                    t.innerHTML = 'Toutes les sorties ont été chargées ! <br/>';
                    t.style.textAlign = 'center';
                 }
            }
            else {
                var end = new Date(bookings[bookings.length - 1].startDate);
                var start = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 0, 0, 0, 1);
                end = new Date(end.getFullYear(), end.getMonth(), end.getDate(), end.getHours(), end.getMinutes(), end.getSeconds() - 1, 0);

                var filter = {
                    filter: {
                        groups: [
                            {
                                joins: {
                                    bookables: {
                                        conditions: [{
                                            id: {
                                                equal: {
                                                    value: bookableId
                                                }
                                            }
                                        }]
                                    }
                                }
                            },
                            {
                                conditions: [{
                                    startDate: {
                                        between: {
                                            from: start.toISOString(),
                                            to: end.toISOString()
                                        }
                                    }
                                }]
                            }
                        ]
                    },
                    pagination: {
                        pageSize: 100,
                        pageIndex: 0
                    },
                    sorting: [{
                        field: "startDate",
                        order: "DESC"
                    }]
                };

                var variables = new Server.QueryVariablesManager();
                variables.set('variables', filter);

                Server.bookingService.getAll(variables).subscribe(addition => {
                    //console.log("getBookableHistory()_Addition: ", addition);

                    var total = bookings.concat(addition.items);

                    actualizePopBookableHistory(total, elem);
                });

            }
        });
    },

    // getBookingsNbrBetween
    getBookingsNbrBetween: function (start,end,bookableId = "%",elem=document.body,writeIfOne = true) {
        var filter = {
            filter: {
                groups: [
                    {
                        joins: {
                            bookables: {
                                conditions: [{
                                    id: {
                                        equal: {
                                            value: bookableId
                                        }
                                    }
                                }]
                            }
                        }
                    },
                    {
                    conditions: [{
                        startDate: {
                            between: {
                                from: start,
                                to:end
                            }
                        }
                    }]
                    }
                ]
            },
            pagination: {
                pageSize: 0,
                pageIndex: 0
            }
        };

        var variables = new Server.QueryVariablesManager();
        variables.set('variables', filter);

        Server.bookingService.getAll(variables).subscribe(result => {
            //console.log("getBookingsNbrBetween(): ", result.length + " sorties", result);
            if (result.length != 1 || writeIfOne == true) {
                elem.innerHTML += result.length;
                elem.parentElement.style.opacity = 1;
            }
            else {
                //elem.parentElement.style.display = "none";
            }
        });
    },

    // getMonthlyBookingsNbr for divBottoms
    getMonthlyBookingsNbr: function (start, end) { // wrong numbers haha due to bookables...

        //console.log(start.toISOString(), end.toISOString());

        var filter = {
            filter: {
                groups: [
                    {
                        conditions: [
                            {
                                startDate: {
                                    between: {
                                        from: start,
                                        to: end
                                    }
                                }
                            },
                            {
                                startDate: {
                                    group: {
                                        value: true
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            pagination: {
                pageSize: 0,
                pageIndex: 0
            }
        };

        var variables = new Server.QueryVariablesManager();
        variables.set('variables', filter);

        Server.bookingService.getAll(variables).subscribe(result => {
            //console.log("getMonthlyBookingsNbr(): ", result.length + " sorties", result);

            var all = document.getElementsByClassName("divBottoms");
            for (var i = 0; i < all.length; i++) {
                if (result.length == 0) {
                    all[i].children[0].innerHTML = "Aucune sortie ce mois";
                }
                else {
                    all[i].children[0].innerHTML = Cahier.getSingularOrPlural(result.length, " sortie") + " ce mois";
                }
            }

        });
    },


    // getStats
    getStats: function (start,end,elem) {

        var f = {
            filter: {
                groups: [
                    {
                        conditions: [{
                            startDate: {
                                between: {
                                    from: start,
                                    to: end
                                }
                            }
                        }]
                    }
                ]
            },
            pagination: {
                pageSize: 10000,
                pageIndex: 0
            },
            sorting: [{
                field: "startDate",
                order:"ASC"
            }]
        };

        var variables = new Server.QueryVariablesManager();
        variables.set('variables', f);

        Server.bookingService.getAll(variables).subscribe(result => {
            //console.log("getStats(): ", result);

            var send = transformBookings(result.items);

            //console.log("send", send);

            actualizeStats(start, end, elem, send);
        });
    },

    // getBookingInfos
    //getBookingInfos: function (bookingId, which, elem) {

    //    var filter = {
    //        filter: {
    //            groups: [
    //                { conditions: [{ id: { like: { value: bookingId } } }] }
    //            ]
    //        },
    //        pagination: {
    //            pageSize: 1,
    //            pageIndex: 0
    //        },
    //        sorting: [{
    //            field: "id", //USELESS
    //            order: "ASC" //USELESS
    //        }]
    //    };

    //    var variables = new Server.QueryVariablesManager();
    //    variables.set('variables', filter);

    //    Server.bookingService.getAll(variables).subscribe(result => {
    //        //console.log("getBookingInfos(): ", result);
    //        actualizePopBooking(result.items[0],which, elem);
    //    });
    //},

    // getBookingWithBookablesInfos
    getBookingWithBookablesInfos: function (_booking,which,elem) {

        //console.log(_booking.startDate);

        var filter = {
            filter: {
                groups: [
                    {
                        conditions: [
                            { owner: { equal: { value: _booking.owner.id } } },
                            { startDate: { equal: { value: _booking.startDate } } }
                        ]
                    }
                ]
            },
            pagination: {
                pageSize: 100,
                pageIndex: 0
            }
        };

        var variables = new Server.QueryVariablesManager();
        variables.set('variables', filter);

        Server.bookingService.getAll(variables).subscribe(result => {
            var send = transformBookings(result.items);
            actualizePopBooking(send[0], which, elem); // should only give one booking
        });

    },


    // finishBooking
    terminateBooking: function (bookingIds = [], comments = []) {
        var c = 0;
        for (var i = 0; i < bookingIds.length; i++) {
            //console.log("terminateBooking", bookingIds[i], comments[i]);
            Server.bookingService.terminateBooking(bookingIds[i], comments[i]).subscribe(result => {
                c++;
                if (c == bookingIds.length) {
                    //console.log("this.terminateBooking done !");
                    Requests.getActualBookingList();
                }
            });
        }
    },

    // createBooking
    counter: 0,
    createBooking: function () {

        Requests.counter = 0;

        for (let i = 0; i < Cahier.bookings[0].bookables.length; i++) {
            var input = {
                owner: Cahier.bookings[0].owner.id,
                participantCount: Cahier.bookings[0].participantCount,
                destination: Cahier.bookings[0].destination,
                startComment: Cahier.bookings[0].startComment
            };

            Server.bookingService.create(input).subscribe(booking => {

                //console.log('Created booking : ', booking);

                // LINK BOOKABLE
                if (Cahier.bookings[0].bookables[i] != Cahier.personalBookable) { // MP
                    Server.linkMutation.link(booking, {
                        id: Cahier.bookings[0].bookables[i].id,
                        __typename: 'Bookable'
                    }).subscribe(() => {
                        //console.log('Linked Bookable : ', booking);

                        Requests.counter++;
                        if (Requests.counter == Cahier.bookings[0].bookables.length) { newTab("divTabCahier"); ableToSkipAnimaiton();}
                    });
                }
                else {
                    //console.log("+1Matériel Personel");
                    Requests.counter++;
                    if (Requests.counter == Cahier.bookings[0].bookables.length) { newTab("divTabCahier"); ableToSkipAnimaiton(); }

                }
            });

        }


    }

    //// personalQuery
    //personalQuery: function () {
    //    var TheQuery = Server.gql`
    //    {
    //          bookables(
    //            filter:{
    //              groups:[{
    //                conditionsLogic:OR
    //                conditions:[
    //                  {
    //                    id:{
    //                      like:{
    //                        value:"%3001%"
    //                      }
    //                    }
    //                    name:{
    //                      like:{
    //                        value:"%R15%"
    //                      }
    //                    }
    //                  }
    //                ]}
    //              ]
    //            },
    //            sorting: [{
    //	            field:id
    //              order:DESC
    //            }]
    //          )
    //          {
    //              items {
    //                id
    //                name
    //                description
    //                tags {
    //                  id
    //                }
    //              }
    //            }
    //        }
    //        `;
    //    Server.apollo.query({ query: TheQuery }).subscribe(result => {
    //        //console.log("Result of Requests.createQuery(): ", result);
    //    });
    //}


};
