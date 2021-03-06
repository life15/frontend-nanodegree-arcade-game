/**
 * Generate random int in range[min, max].
 * @param {int} min - the smallest of the random number to generate.
 * @param {int} max - the biggest of the random number to genertate.
 * @return {int} an int within min ~ max.
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Enemies our player must avoid. */
var Enemy = function() {
    this.init();
};

/**
 * Update the enemy's position.
 * @method
 * @param {float} dt - a time delta between ticks.
 */
Enemy.prototype.update = function(dt) {
    // Multiply move speed by the dt parameter.
    // to ensure the game runs at the same speed for all computers.
    // Reset when enmey across the screen.
    if (this.x <= this.boundaryX) {
        this.x += this.moveSpeed * dt;
    }
    else {
        this.init();
    }
};

/** Draw the enemy on the screen.
 * @method
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.collisionHandle();
};

/** Initialize enemy.
 * @method
 */
Enemy.prototype.init = function() {
    this.sprite = 'images/enemy-bug.png';
    this.boundaryX = 505;
    this.moveSpeed = randomSpeed();
    this.initLocation = {'x': -101, 'y': randomInitLocation()};
    this.x = this.initLocation.x;
    this.y = this.initLocation.y;

    /** Generate random move speed.
     * @function
     * @ruturns {int} random move speed of (300, 600, 900).
     */
    function randomSpeed() {
        var speedRange = [300, 300, 300, 600, 600, 900];
        return speedRange[getRandomInt(0, speedRange.length - 1)];
    }

    /** Generate random Y location.
     * @function
     * @ruturns {int} random Y locaiton of (60, 143, 226, 309).
     */
    function randomInitLocation() {
        var locationRange = [60, 143, 226, 309];
        return locationRange[getRandomInt(0, locationRange.length - 1)];
    }
};

/** Detect collision between enemy and player.
 * @method
 */
Enemy.prototype.collisionHandle = function() {
    var collisionDist = 30;
    if (Math.abs(this.y - player.y) <= collisionDist && Math.abs(this.x - player.x) <= collisionDist ) {
        score.lose();
        player.reset();
    }
};

/** Player of the game. */
var Player = function() {
    this.init();
};

/** Update the player position, move controled by keyboard.
 * @method
 * @param {int} x - x position of player.
 * @param {int} y - y position of player.
 */
Player.prototype.update = function(x, y) {
    if (x !== undefined && y !== undefined) {
        if ((this.x + x) >= 0 && (this.x + x) <= this.boundaryX) {this.x += x;}
        if ((this.y + y) <= this.boundaryY) {
            if (this.y + y < this.scoreLocation) {
                score.win();
                this.reset();
            }
            else {this.y += y;}
        }
    }
};

/** Draw player on the screen.
 * @method
 */
Player.prototype.render = function() {
    this.select();
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/** Handle keyboard control of the player.
 * @method
 * @param {string} key - keyboard input.
 */
Player.prototype.handleInput = function(key) {
    switch (key) {
        case "up": this.update(0, -this.moveY); break;
        case "down": this.update(0, this.moveY); break;
        case "right": this.update(this.moveX, 0); break;
        case "left": this.update(-this.moveX, 0); break;
    }
};

/** Initialize player.
 * @method
 */
Player.prototype.init = function() {
    this.sprite = 'images/char-boy.png';
    this.moveX = 101;
    this.moveY = 83;
    this.scoreLocation = 60;
    this.boundaryX = 404;
    this.boundaryY = 500;
    this.reset();
};

/** Reset player to start place.
 * @method
 */
Player.prototype.reset = function() {
    var initLocation = {'x': 202, 'y': 400};
    this.x = initLocation.x;
    this.y = initLocation.y;
};

/** Select different characters of player.
 * @method
 */
Player.prototype.select = function() {
    var characters = ['images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ];
    for (var i = 0; i < characters.length; i++) {
        ctx.drawImage(Resources.get(characters[i]), i * 101, 500);
    }

    if (this.y > 400) {
        switch(this.x) {
            case 0: this.sprite = characters[0]; break;
            case 101: this.sprite = characters[1]; break;
            case 202: this.sprite = characters[2]; break;
            case 303: this.sprite = characters[3]; break;
            case 404: this.sprite = characters[4]; break;
        }
    }
};

/** Score of the game. */
var Score = function() {
    this.init();
};

/** Initialize score.
 * @method
 */
Score.prototype.init = function() {
    this.score = 0;
    this.scoreBoardHeader = document.createElement('h1');
    this.scoreBoardHeader.id = "scoreboard";
    this.scoreBoardHeader.innerHTML = "Score:";
    this.scoreBoard = document.createElement("p");
    document.body.appendChild(this.scoreBoardHeader).appendChild(this.scoreBoard);
    this.render();
};

/** Add 100 to score when player wins.
 * @method
 */
Score.prototype.win = function() {
    this.score += 100;
    this.render();
};

/** Minus 10 to score when player lose.
 * @method
 */
Score.prototype.lose = function() {
    this.score -= 10;
    this.render();
};

/** Draw score on the screen.
 * @method
 */
Score.prototype.render = function() {
    this.scoreBoard.innerHTML = this.score;
};

/** Add bonus point to score when player lose.
 * @method
 * @param {int} bonus - extra point to add.
 */
Score.prototype.bonus = function(bonus) {
    this.score += bonus;
    this.render();
};

/** Collectables player can get bonus. */
var Collectable = function() {
    this.reset();
};

/** Reset collectable type and location.
 * @method
 */
Collectable.prototype.reset = function() {
    var location = randomLocation();
    this.x = location.x;
    this.y = location.y;

    this.gem = randomGem();
    this.sprite = this.gem.gemColor;

    /** Generate random gem.
     * @function
     * @returns {object} - a gem with specific color and score.
     */
    function randomGem() {
        var gemColorList = ["images/Gem-Blue.png","images/Gem-Green.png", "images/Gem-Orange.png"];
        var gemScore = [500, 2000, 5000];
        var gemColor = gemColorList[getRandomInt(0, gemColorList.length - 1)];
        var score = gemScore[getRandomInt(0, gemScore.length - 1)];
        return {"gemColor": gemColor, "score": score};
    }

    /** Generate random location.
     * @function
     * @returns {object} - random x and y location.
     */
    function randomLocation() {
        var locationRangeX = [0, 101, 202, 303, 404];
        var locationRangeY = [60, 143, 226, 309];
        var x = locationRangeX[getRandomInt(0, locationRangeX.length - 1)];
        var y = locationRangeY[getRandomInt(0, locationRangeY.length - 1)];
        return {"x": x, "y": y};
    }
};

/** Draw collectable on the screen.
 * @method
 */
Collectable.prototype.render = function() {
    this.collisionHandle();
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Collectable.prototype.collisionHandle = function() {
    var collisionDist = 30;
    if (Math.abs(this.y - player.y) <= collisionDist && Math.abs(this.x - player.x) <= collisionDist ) {
        score.bonus(this.gem.score);
        this.reset();
    }
};

// Instantiate objects.
var allEnemies = [];
var enemyNum = 5;
for (var i = 0; i < enemyNum; i++) {
    allEnemies[i] = new Enemy();
}
var player = new Player();
var score = new Score();
var collectable = new Collectable();

// This listens for key presses and sends the keys to Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
