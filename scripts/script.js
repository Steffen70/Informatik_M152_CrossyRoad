playground = $("#playground")
    .append("<div id='traffic-box'>")
    .prepend("<div id='start'></div>")
    .append("<div id='finish'></div>")
    .append("<div id='message'><h1>Game Over</h1><p id='reload-button' onClick='reload()'>Click Here to try again</p></div>");

start = playground.find("#start");
finish = playground.find("#finish")
    .append("<span>Score:</span>")
    .append("<span id='score'>0</span>");
score = finish.find("#score");

function reload() {
    score.text(0);
    playground.removeClass("gameover");
    createFrog();
    finish.droppable({ disabled: false });
    lastOffset = (offset = undefined);
    movementChecker = setInterval(checkMovement, 75);
}

reload();

finish.droppable({
    tolerance: "fit",
    drop: (event, ui) => {
        $(ui.draggable).draggable(
            { disabled: true }
        ).remove();

        lastOffset = (offset = undefined);
        count = +score.text();
        score.text(++count);

        createFrog();
    }
});

function createFrog() {
    frog = start.append("<div class='frog'></div>")
        .find(".frog");

    frog.draggable({
        containment: "#playground",
        drag: () => offset = (frog).offset()
    });
}

traffic = $("#traffic-box");
lines = traffic.css('--traffic-lines');
minspeed = +traffic.css('--car-min-speed-s');
maxspeed = +traffic.css('--car-max-speed-s') - minspeed;

for (i = 0; i < lines; i++) {
    car = "car-" + i;
    traffic.append("<div class='car' id='" + car + "'></div>");
    duration = Math.random() * maxspeed + minspeed + "s";
    traffic.find("#" + car).css("animation-duration", duration);
}

$(".car").mouseover(runOver);
playground.mouseleave(runOver);

function runOver() {
    if (!offsetComparison(true)) {
        clearInterval(movementChecker);
        playground.addClass("gameover");
        finish.droppable({ disabled: true });
        frog.remove();
    }
}

offsetComparison = (standard) => {
    if (window['lastOffset'] && window['offset'])
        return offset.top == lastOffset.top && offset.left == lastOffset.left;
    return standard;
};

function checkMovement() {
    if (offsetComparison(false))
        frog.css("opacity", "0.75");
    else
        frog.css("opacity", "1");
    lastOffset = offset;
}