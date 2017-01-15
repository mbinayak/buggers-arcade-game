Math.getRandomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};

var Element = function(img, x, y) {
    this.x = x;
    this.y = y;
    this.startPointX = x;
    this.startPointY = y;
    this.endPointX = 500;
    this.endPointY = 500;
    
    this.sprite = img;
};

// Draw the element on the screen, required method for game
Element.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Element.prototype.reset = function() {
    this.x = this.startPointX;
    this.y = this.startPointY;
};
Element.prototype.checkBoundry = function() {
    return this.x >= this.endPointX || this.y >= this.endPointY;
};

// Enemies our player must avoid
var Enemy = function(y) {
    this.setYPoint();
    Element.apply(this, ['images/enemy-bug.png', -100, this.y]);
    
    this.baseSpeed = 200;
    this.setLevel();
};

Enemy.prototype = Object.create(Element.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.checkBoundry()) {
        this.reset();
    }
    else {
        this.x += dt * this.speed;
        
        if ((this.x > player.getPosX() - 70 && this.x < player.getPosX() + 40)
            && (this.y > player.getPosY() - 20 && this.y < player.getPosY() + 20)) {
            console.log('player position (' + player.getPosX() + ', ' + player.getPosY() + ')');
            console.log('bug position (' + this.x + ', ' + this.y + ')');
            console.log(' -----  Player been HIT  ------');
            player.die();
        }
    }
};
Enemy.prototype.setLevel = function() {
    this.level = Math.getRandomInt(0, 3);
    this.speed = this.baseSpeed + (40 * this.level);
};
Enemy.prototype.setYPoint = function() {
    this.y = [60, 140, 230][Math.getRandomInt(0, 3)];
};
Enemy.prototype.reset = function() {
    this.x = this.startPointX;
    this.setYPoint();
    this.setLevel();
}

Enemy.speeds = [0, 1, 2];

// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    Element.apply(this, ['images/char-boy.png', 200, 400]);
    this.lifeLine = 5;
    this.score = 0;
    this.lastTime = 0;
};

Player.prototype = Object.create(Element.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
    this.updateScore();
};

Player.prototype.updateScore = function() {
    if (this.lifeLineFinished()) return;
    
    boxes.lifeLine.innerHTML = 'Life: <b>' + this.lifeLine + '</b>';
    boxes.scoreBoard.innerHTML = 'Score: <b>' + this.score + '</b>';
    
    if (this.y <= 235 && this.y > 0) {
        if (!this.lastTime) this.lastTime = Date.now();
        var nw = Math.floor((Date.now() - this.lastTime) / 1000.0);
        if (nw > 0) {
            console.log('Score :: '+ nw + '\n ');
            this.score += nw;
            this.lastTime = Date.now();
        }
    }
}

Player.prototype.getPosY = function() { return this.y };

Player.prototype.getPosX = function() { return this.x };

Player.prototype.die = function() {
    console.log('Hit by BUG! :(');
    this.lifeLine--;
    boxes.lifeLine.innerHTML = 'Life: <b>' + this.lifeLine + '</b>';
    if (this.lifeLineFinished()) {
        boxes.messageBoard.textContent = "Game Over";
        console.log('Life line finished');
    }
    this.reset();
}
Player.prototype.reset = function() {
    this.x = this.endPoints.x / 2;
    this.y = this.endPoints.y;
}
Player.prototype.endPoints = { x: 400, y: 400 };

Player.prototype.oneStep = { x: 100, y: 83 };

Player.prototype.lifeLineFinished = function () { return this.lifeLine <= 0 }

Player.prototype.handleInput = function(keyCode) {
    if (!keyCode || this.lifeLineFinished()) return;
    console.log('move ' + keyCode);
    var x, y;
    switch (keyCode) {
        case 'left':
            x = this.x - this.oneStep.x, y = this.y;
            break;
        case 'right':
            x = this.x + this.oneStep.x, y = this.y;
            break;
        case 'up':
            x = this.x, y = this.y - this.oneStep.y;
            break;
        case 'down':
            x = this.x, y = this.y + this.oneStep.y;
            break;
    }
    if (this.y <= 235 && this.y > 0) {
        if (!this.lastTime) this.lastTime = Date.now();
    }
    else this.lastTime = 0;
    
    if (x < 0 || x > this.endPoints.x || y < -25 || y > this.endPoints.y) { // TODO make starting points dynamic
        console.log('Movement to ' + keyCode + ', not possible. Hitting Boundry');
    }
    else {
        this.x = x;
        this.y = y;
    }
    console.log('Movement to ' + keyCode + ', position : (' + this.x + ', ' + this.y + ')');
};

var allEnemies = [];
for (var i = 0; i < 4; i++) {
    allEnemies.push(new Enemy());
}
var player = new Player();


var boxes = {};
document.addEventListener("DOMContentLoaded", function() {
    boxes.scoreBoard = document.getElementById('score-board');
    boxes.lifeLine = document.getElementById('life-line');
    boxes.messageBoard = document.querySelector('.message-board h1');
});

// This listens for key presses and sends the keys to your
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
