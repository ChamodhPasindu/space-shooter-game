const space = $("#space").get(0);/*body*/

/*Start btn*/
$("#btn-start").click(function () {
    startGame();
});

/*Try again btn */
$("#btn-try-again").click(function () {
    window.location.reload();
});

function startGame() {
    /*hide same start menu*/
    $("#game-start-menu").css("display", "none");
    $("#score").css("display", "block");

    createEnemy();
    $(window).on("keydown", function (e) {
        var left = parseInt($("#rocket-back").css("left"));

        /*rocket move left*/
        if (e.key == "ArrowLeft" && left > -1200) {
            $("#rocket-back").css("left", left - 50 + "px")
        }
        /*rocket move right*/
        else if (e.key == "ArrowRight" && left < 1200) {
            $("#rocket-back").css("left", left + 50 + "px")
        }

        /*shoot laser*/
        if (e.keyCode == 32) {
            let laser = createLaser();
            shootLaser(laser, left);
        }
    });
}

function createEnemy() {
    var dir = '../assets/img/'
    var img = ['asteroid.png', 'enemy.png', 'spaceship.png'];
    var createEnemy = setInterval(() => {

        /*get random number between 0-3 for selecting img for apply enemy*/
        var randomImg = Math.floor(Math.random() * 3);

        /*create div element dynamically and add ".enemy-back" css while interval*/
        var enemy = $('<div>', {class: "enemy-back"}).get(0);
        enemy.setAttribute("style", "background-image: url(" + dir + img[randomImg])
        enemy.style.left = Math.floor(Math.random() * (85 - 15) + 15) + "%";
        space.append(enemy)
    }, 2500);

    moveEnemy(createEnemy);
}

function moveEnemy(createEnemy) {
    var moveEnemies = setInterval(() => {
        /*select all div element that applied ".enemy-back" css class for moving down from top of the viewport*/
        var enemies = $(".enemy-back").get();

        if (enemies !== undefined) {
            for (var i = 0; i < enemies.length; i++) {
                var enemy = enemies[i];
                var enemyTop = parseInt(window.getComputedStyle(enemy).getPropertyValue("top"));

                enemy.style.top = enemyTop + 5 + "px";
                isGameOver(enemy, moveEnemies, createEnemy);
            }
        }
    }, 50);
}

function createLaser() {
    /*create div dynamically for shooing laser*/
    const laser = $('<div>', {class: "lasers"}).get(0);
    space.append(laser);
    laser.style.display = "none";
    return laser;
}

function shootLaser(laser, left) {
    var moveLaser = setInterval(() => {

        checkExplosion(laser);

        /*move laser div element top of the rocket div element's position*/
        var laserBottom = parseInt(window.getComputedStyle(laser).getPropertyValue("bottom"));
        laser.style.left = left + -2 + "px";
        laser.style.bottom = laserBottom + 10 + "px";
        laser.style.display = "block";

        if (parseInt(laser.style.bottom) >= 900) {
            laser.remove();
        }
    }, 50);
}

function checkExplosion(laser) {
    var enemies = $(".enemy-back").get();

    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];

        var laserPosition = laser.getBoundingClientRect();
        var enemyPosition = enemy.getBoundingClientRect();

        /*check laser's div position and each enemy's div position*/
        if (laserPosition.left >= enemyPosition.left && laserPosition.right <= enemyPosition.right &&
            laserPosition.top - 50 <= enemyPosition.top && laserPosition.bottom <= enemyPosition.bottom) {

            makeExplosion(enemy);
            generateScore();
            enemy.remove();
            laser.remove();
        }
    }
}

function makeExplosion(enemy) {
    /*get enemy's div element position and append new div for showing explosion*/
    const explosion = $('<div>', {class: "explosion"}).get(0);
    explosion.style.left = enemy.style.left;
    explosion.style.right = enemy.style.right;
    explosion.style.top = enemy.style.top;
    explosion.style.bottom = enemy.style.bottom - 10 + "px";
    space.append(explosion);

    /*after 1s,remove that div*/
    setTimeout(function () {
        explosion.remove();
    }, 1000);
}

function generateScore() {
    /*add extra 10 for current score*/
    var score = $("#score-point").text();
    var newScore = (+score) + (+10);
    $("#score-point").text(newScore);
}

function isGameOver(enemy, moveEnemies, createEnemy) {
    var rocketPosition = $("#rocket-back").get(0).getBoundingClientRect();
    var enemyPosition = enemy.getBoundingClientRect();

    /*check div element that creates for enemy is in same position of rocket */
    if (rocketPosition.top <= enemyPosition.top && rocketPosition.bottom <= enemyPosition.bottom) {
        clearInterval(moveEnemies);
        clearInterval(createEnemy);
        gameOver();
    }
}

function gameOver() {
    /*visible game over menu and show score*/
    $("#game-over-menu").css("display", "block");
    $("#final-score").text($("#score-point").text());
}
