// Enemies our player must avoid
function Enemy() {
    // Variables applied to each of our instances go here.
    // Random speed setting 1, 2, or 3.
    // Initial number in the calculation is the multiple of the speed differential
    // Ie '5' gives 5, 10, 15 times the speed set later.
    this.speed = 5 * (Math.floor(Math.random() * 3) + 1);
    // position initailly try default for visual start point,
    // then apply random math for which row it starts on
    //Beware lanes work decreasing up!!!
    this.x = -100;
    this.lane = (Math.floor(Math.random() * 3)) + 1;
    this.y = this.lane * 83 - 20;
};

// The image/sprite for our enemies, this uses
// a helper we've provided to easily load images
// Now a prototype property

Enemy.prototype.sprite = 'images/enemy-bug.png';
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    //Involve the speed component to update location
    this.x = this.x + this.speed * dt * 20;

    // If the Enemy runs off the page, replace with a new random Enemy
    //Beware lanes work decreasing up!!!
    if (this.x > 550) {
        this.speed = 5 * (Math.floor(Math.random() * 3) + 1);
        this.x = -100;
        this.lane = (Math.floor(Math.random() * 3)) + 1;
        this.y = this.lane * 83 - 20;
    }

    // Implement collisions check there

    if ((this.lane == player.lane) && (this.x > (player.x) - 70) && (this.x < (player.x + 50))) {
        // change player property for collission
        player.collision = true;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method - keystrokes...if 'left' etc etc

//Beware lanes work decreasing up!!!
function Player() {
    this.x = 202;
    this.y = 400;
    this.lane = 5;
    this.collision = false;
}

Player.prototype.sprite = 'images/char-boy.png';

// Draw the character
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Update character

Player.prototype.update = function() {
};

// What to do for each valid key...
//Beware lanes work decreasing up!!!
Player.prototype.handleInput = function(direction) {
    if ((direction == 'left') && (this.x != 0)) {
        this.x -= 101;
    } else if ((direction == 'right') && (this.x != 404)) {
        this.x += 101;
    } else if ((direction == 'up') && (this.y != -15)) {
        this.y -= 83;
        this.lane -= 1;
    } else if ((direction == 'down') && (this.y != 400)) {
        this.y += 83;
        this.lane += 1;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player - this is done by startMenu below
let enemyA = new Enemy();
let enemyB = new Enemy();
let enemyC = new Enemy();
let allEnemies = [enemyA, enemyB, enemyC];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// This will be called at initialisation then every reset.

const startMenu = function() {
  alert('start menu')
  player = new Player();
}
