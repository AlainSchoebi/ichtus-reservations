function loadBottoms() {

    var allDivTabs = document.getElementsByClassName("divTab");
    for (var i = 0; i < allDivTabs.length; i++) {
        var s = div(allDivTabs[i]);
        s.className = "divSpacers";

        var b = div(allDivTabs[i]);
        b.className = "divBottoms";

        var divMonth = div(b);
        divMonth.onclick = function () { popStats(); };
    }

    var end = new Date(Date.now());
    var start = new Date(end.getFullYear(), end.getMonth(), 0, 0, 0, 0, 1);
    Requests.getMonthlyBookingsNbr(start, end);
}