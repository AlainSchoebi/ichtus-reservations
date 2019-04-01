//ProgressBar

var progessionTabNames = ["divTabCahier","divTabCahierMember", "divTabCahierInfos", "divTabCahierEquipmentChoice", "divTabCahierConfirmation"];

function createProgressBar() {

    for (var i = 0; i < 4; i++) {

        var divStep = document.createElement("div");
        divStep.classList.add("divTabCahierProgressStep");
        divStep.style.left = (6 + 26 * i) + "%";
        divStep.addEventListener("click", function () {
            var c = (parseInt(this.style.left) - 6) / 26 +1;
            if (c < currentProgress) {

                newTab(progessionTabNames[c]);

            }

        });
        $("divTabCahierProgress").appendChild(divStep);

        divStep.classList.add("divTabCahierProgressStepCompleted");

        var divNumber = document.createElement("div");
        divNumber.classList.add("divTabCahierProgressNumber");
        divNumber.innerHTML = (i + 1);
        divStep.appendChild(divNumber);


        var divCircle = document.createElement("div");
        divCircle.classList.add("divTabCahierProgressCircle");
        divStep.appendChild(divCircle);


        var divText = document.createElement("div");
        divText.classList.add("divTabCahierProgressText");
        divText.innerHTML = Cahier.ProgressBarTexts[i];
        divStep.appendChild(divText);
    }

    var divBar = document.createElement("div");
    divBar.id = "divTabCahierProgressBar";
    divBar.style.left = (11 + 26 * 0) + "%";
    $("divTabCahierProgress").appendChild(divBar);

    var divBarBlue = document.createElement("div");
    divBarBlue.id = "divTabCahierProgressBarBlue";
    divBarBlue.style.left = (11 + 26 * 0) + "%";
    $("divTabCahierProgress").appendChild(divBarBlue);

}

var currentProgress = 0;
function changeProgress(c) {

    var sign;
    if (c != currentProgress) {
        sign = Math.abs(c - currentProgress) / (c - currentProgress);
    }

    currentProgress = c;
    for (var i = 1; i < 5; i++) {
        document.getElementsByClassName("divTabCahierProgressStep")[i-1].className = "divTabCahierProgressStep";
        if (i < c) {
            document.getElementsByClassName("divTabCahierProgressStep")[i-1].classList.add("divTabCahierProgressStepCompleted");
        }
        else if (i == c) {
            document.getElementsByClassName("divTabCahierProgressStep")[i-1].classList.add("divTabCahierProgressStepCurrent");
        }
        else {
            document.getElementsByClassName("divTabCahierProgressStep")[i-1].classList.add("divTabCahierProgressStepIncompleted");
        }
    }

    $("divTabCahierProgressBarBlue").style.width = (c-1) * 26 + "%";
}