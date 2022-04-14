const space = $("#space").get(0);

$("#btn-start").click(function () {
    startGame();
});

$("#btn-try-again").click(function () {
    window.location.reload();
});

function startGame() {
    $("#game-start-menu").css("display", "none");
    $("#score").css("display", "block");

    createEnemy();
    $(window).on("keydown", function (e) {
        var left = parseInt($("#rocket-back").css("left"));

        if (e.key == "ArrowLeft" && left > -1200) {
            $("#rocket-back").css("left", left - 50 + "px")
        } else if (e.key == "ArrowRight" && left < 1200) {
            $("#rocket-back").css("left", left + 50 + "px")
        }

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
        var randomImg = Math.floor(Math.random() * 3);
        var enemy = $('<div>', {class: "enemy-back"}).get(0);
        enemy.setAttribute("style", "background-image: url(" + dir + img[randomImg])
        enemy.style.left = Math.floor(Math.random() * (85 - 15) + 15) + "%";
        space.append(enemy)
    }, 2500);

    moveEnemy(createEnemy);
}

function moveEnemy(createEnemy) {
    var moveEnemies = setInterval(() => {
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
    const laser = $('<div>', {class: "lasers"}).get(0);
    space.append(laser);
    laser.style.display = "none";
    return laser;
}

function shootLaser(laser, left) {
    var moveLaser = setInterval(() => {

        checkExplosion(laser);

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
    const explosion = $('<div>', {class: "explosion"}).get(0);
    explosion.style.left = enemy.style.left;
    explosion.style.right = enemy.style.right;
    explosion.style.top = enemy.style.top;
    explosion.style.bottom = enemy.style.bottom - 10 + "px";
    space.append(explosion);

    setTimeout(function () {
        explosion.remove();
    }, 1000);
}

function generateScore() {
    var score = $("#score-point").text();
    var newScore = (+score) + (+10);
    $("#score-point").text(newScore);
}

function isGameOver(enemy, moveEnemies, createEnemy) {
    var rocketPosition = $("#rocket-back").get(0).getBoundingClientRect();
    var enemyPosition = enemy.getBoundingClientRect();

    if (rocketPosition.top <= enemyPosition.top && rocketPosition.bottom <= enemyPosition.bottom) {
        clearInterval(moveEnemies);
        clearInterval(createEnemy);
        gameOver();
    }
}

function gameOver() {
    $("#game-over-menu").css("display", "block");
    $("#final-score").text($("#score-point").text());
}
