var x;
var y;
var start = 0;
var c = 0;

var mouseX;
var mouseY;
var collideCoinArr = [];
var collideSpecialsArr = [];

var timerInterval;
var timerCountdown;
var score = 0;
var showCountdown = 60;
var objectsSpeed = 500;
var specialsSpeed = 10000;
var objectsFallSpeed = 5;
var specialsFallSpeed = 3;
var stage = 1;
var minPass = 200;

var store = window.localStorage;
if (store.getItem("highscore") == null) {store.setItem("highscore", 0);};

// function checkCollide(event) {
//     if(event.clientX < 25 || event.clientX > document.body.clientWidth - 25 || event.clientY < 25 || event.clientY > document.body.clientHeight - 25) {
//         start = 2;
//     } else{}
// }

function addScore() {
    score++;
    this.style.opacity = "0";
    var audio = document.querySelector("#ding");
    audio.currentTime = 0;
    audio.play();
    this.style.animation = "fall 1s linear forwards";
    document.getElementById("score").innerHTML = "Current total score: $" + score;
    var stageGoal = document.querySelector("#stageGoal");
    stageGoal.innerHTML = `Stage ${stage}: $${score}/$${minPass}`
    cHighscore();
}

function addScoreSpecials() {
    score+= 10;
    this.style.opacity = "0";
    var audio = document.querySelector("#chaChing");
    audio.currentTime = 0;
    audio.play();
    this.style.animation = "fall 1s linear forwards";
    var b = document.createElement("h1");
    b.innerHTML = "Coin Shower!"
    b.style.animation = "titleFadeInOut 2s forwards";
    document.body.appendChild(b);
    setTimeout(function(){ b.parentNode.removeChild(b)}, 4000);
    var showerTime = setInterval(function() { create(); }, 50);
    setTimeout(function(){ clearInterval(showerTime) }, 3000);
    document.getElementById("score").innerHTML = "Current total score: $" + score;
    var stageGoal = document.querySelector("#stageGoal");
    stageGoal.innerHTML = `Stage ${stage}: $${score}/$${minPass}`
    cHighscore();
}

function create() {
    if(c === 1) {
        var tempLeft = Math.round(Math.random() * document.body.clientWidth);
        var hitbox = document.createElement("div");
        hitbox.style = `width: 110px; height: 50px; left:${tempLeft}px; animation: fall ${parseInt(objectsFallSpeed)}s linear forwards;`;
        hitbox.classList = "hitbox";
        // hitbox.style.animation = `fall ${parseInt(objectsFallSpeed)}s linear forwards;`
        var a = document.createElement("div");
        a.setAttribute("class", "objects");
        a.setAttribute("style", `left: ${tempLeft}px;`);
        a.innerHTML = "$";
        hitbox.addEventListener("mouseover", addScore);
        collideCoinArr.push(tempLeft);
        hitbox.appendChild(a);
        document.body.appendChild(hitbox);
    }
}

function specials() {
    if(c === 1) {
        var tempLeft = Math.round(Math.random() * document.body.clientWidth);
        var a = document.createElement("div");
        var hitbox = document.createElement("div");
        hitbox.style = `width: 110px; height: 50px; left:${tempLeft}px; animation: fall ${parseInt(specialsFallSpeed)}s linear forwards, blinking 1s infinite;`
        // hitbox.style.animation = `fall ${parseInt(specialsFallSpeed)}s linear forwards, blinking 1s infinite;`;
        hitbox.classList = "hitbox";
        a.setAttribute("class", "specials");
        a.setAttribute("style", "left: " + tempLeft + "px;");
        a.innerHTML = "?";
        hitbox.addEventListener("mouseover", addScoreSpecials);
        collideSpecialsArr.push(tempLeft);
        hitbox.appendChild(a);
        document.body.appendChild(hitbox);
    }
}

function deleteObject() {
    var objects = document.getElementsByClassName("objects");
    var specials = document.getElementsByClassName("specials");
    var hitbox = document.getElementsByClassName("hitbox");
    for(var i = 0; i < hitbox.length; i++) {
        if(hitbox[i].offsetTop > document.body.clientHeight) {
            hitbox[i].parentNode.removeChild(hitbox[i]);
        }
        if (hitbox[i].style.opacity == "0") {
            hitbox[i].parentNode.removeChild(hitbox[i]);
        }
    }
    for(var i = 0; i < specials.length; i++) {
        if(specials[i].offsetTop > document.body.clientHeight) {
            specials[i].parentNode.removeChild(specials[i]);
        }
        if (specials[i].style.opacity == "0") {
            specials[i].parentNode.removeChild(specials[i]);
        }
    }
    for(var i = 0; i < objects.length; i++) {
        if(objects[i].offsetTop > document.body.clientHeight) {
            objects[i].parentNode.removeChild(objects[i]);
        }
        if (objects[i].style.opacity == "0") {
            objects[i].parentNode.removeChild(objects[i]);
        }
    }

}
function cHighscore() {
    if(store.getItem("highscore") < score) {
        store.setItem("highscore", score);
    }
}
window.onload = function() {
    if(store.getItem("highscore")){}
    else {
        store.setItem("highscore", 0);
    }
}
setInterval(function() {
    deleteObject();
    if(start === 1) {
        document.getElementById("start").style.opacity = "0";
        document.querySelector("#score").style.opacity = "1";
        c = 1;
    }
    else if(start === 2) {
        document.getElementById("start").style.opacity = "1";
        document.querySelector("#score").style.opacity = "0";
        c = 0;
    }
}, 1);
setInterval(function() { create(); }, parseInt(objectsSpeed));
setInterval(function() { specials(); }, parseInt(specialsSpeed));

function countdown() {
    var cdinfo = document.querySelector("#countdown")
    cdinfo.innerHTML = "Time left: " + showCountdown + " secs";
    showCountdown--;
}

function endGame() {

    if (score >= minPass) {
        var audio = document.querySelector("#clearStage");
        audio.currentTime = 0;
        audio.play();
        var endGameText = document.createElement("div");
        endGameText.style.fontSize = "30px";
        endGameText.innerHTML = `Congratulations!<br>You passed stage ${stage}!<br>Proceeding to next stage..`;
        endGameText.classList = "endText";
        document.querySelector("body").appendChild(endGameText);
        setTimeout(function() {
            endGameText.parentNode.removeChild(endGameText);
        }, 5000);
        minPass += 300;
        objectsSpeed -= 10;
        specialsSpeed += 200;
        objectsFallSpeed -= 0.2;
        specialsFallSpeed -= 0.1;
        stage += 1;
        stages();
        showCountdown = 60;
        clearTimeout(timerCountdown);
        timerCountdown = setTimeout(endGame, 60000);
        timerInterval = setInterval(countdown, 1000);
        setTimeout(function() {
            clearInterval(timerInterval)
        }, 60000);
    } else {
    document.getElementById("score").innerHTML = "Current total score: $" + score;
    document.getElementById("highscore").innerHTML = "Highscore: $" + store.getItem("highscore");
    start = 2;
    score = 0;
    showCountdown = 60;
    objectsSpeed = 500;
    specialsSpeed = 10000;
    objectsFallSpeed = 5;
    specialsFallSpeed = 3;
    stage = 1;
    minPass = 200;
    var audio = document.querySelector("#endGame");
    audio.currentTime = 0;
    audio.play();
    var endGameText = document.createElement("div");
    endGameText.innerHTML = "Game Over~ :("
    endGameText.classList = "endText";
    document.querySelector("body").appendChild(endGameText);
    setTimeout(function() {
        endGameText.parentNode.removeChild(endGameText);
    }, 4000);
    document.querySelector("#countdown").style.opacity = "0";
    document.querySelector("#score").style.opacity = "0";
    document.querySelector("#stageGoal").style.opacity = "0";
    document.querySelector("*").style = "overflow: hidden;";
    document.querySelector("h1").style.opacity = "0";
    document.querySelector("h1").style.animation = "titleFadeIn 2s forwards";
    document.querySelector("h1").style.animationDelay = "4s";
    }
}

function startGame() {
    start = 1;
    document.getElementById("score").innerHTML = "Current total score: $" + score;
    document.querySelector("#countdown").style.opacity = "1";
    document.querySelector("#score").style.opacity = "1";
    document.querySelector("*").style = "overflow: hidden; cursor: url(basket.png), auto;";
    document.querySelector("h1").style.opacity = "1";
    document.querySelector("h1").style.animation = "titleFadeOut 1s forwards";
    document.querySelector("h1").style.animationDelay = "";
    timerCountdown = setTimeout(endGame, 60000);
    timerInterval = setInterval(countdown, 1000);
    setTimeout(function() {
        clearInterval(timerInterval)
    }, 60000);
    stages();
}

document.querySelector("#start").onmousedown = startGame;
document.addEventListener("mousemove", getMousePos);

function getMousePos(e) {
    var coin = document.querySelectorAll(".objects");
    mouseX = e.clientX;
    mouseY = e.clientY;
    //
    // for (i=0; i<coin.length; i++) {
    //     if (`(mouseY + 50)`<coin[i]. )
    // }
    //
};

 function stages() {
    var stageGoal = document.querySelector("#stageGoal");
    stageGoal.innerHTML = `Stage ${stage}: $${score}/$${minPass}`
 }

 document.getElementById("highscore").innerHTML = "Highscore: $" + store.getItem("highscore");
