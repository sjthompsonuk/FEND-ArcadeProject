// Variable declarations

let scoreboardWins = document.querySelector('.wins');
let scoreboardGems = document.querySelector('.gems');
let scoreboardLives = document.querySelector('.lives');
let scoreboardScore = document.querySelector('.score');
let scoreboardTopScore = document.querySelector('.top-score');
let gameOverScore = document.querySelector('.game-over-score');
let gameOverModal = document.querySelector('.game-over');
let topScore = 0;
let speedMultiple = 1;
let gameOverStatus = false;

//Item counts
let counts = {
    gem: 0,
    heart: 0,
    rock: 0
};

// Enemies our player must avoid
function Enemy() {
    // Variables applied to each of our instances go here.
    // Random speed setting 1, 2, or 3.
    // Initial number in the calculation is the multiple of the speed differential
    // Ie '5' gives 5, 10, 15 times the speed set later.
    this.speed = 5 * (Math.floor(Math.random() * 3) + 1);
    // position initailly to left of game,
    // then apply random math for which row it starts on
    // Beware lanes work decreasing up!!!
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
    // Speed multiplier comes into effect after a certain number of 'wins'.
    if (this.x > 550) {
        this.speed = speedMultiple * 5 * (Math.floor(Math.random() * 3) + 1);
        this.x = -100;
        this.lane = (Math.floor(Math.random() * 3)) + 1;
        this.y = this.lane * 83 - 20;
    }

    // Implement collisions check here

    if ((this.lane == player.lane) && (this.x > (player.x) - 70) && (this.x < (player.x + 50))) {

        // Logic regarding lives left
        if (player.lives == 0) {
            gameOver();
        } else {
            player.lives -= 1;
            scoreboardLives.textContent = player.lives;
            player.x = 202;
            player.y = 400;
            player.lane = 5;
        }
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
// Should be initiated after player selection from BeginPlayer objects.
// Position central bottom of board
function Player() {
    this.x = 202;
    this.y = 400;
    this.lane = 5;
    this.wins = 0;
    this.score = 0;
    this.gems = 0;
    this.lives = 0;
}
//Introduce property to allow normal keyboard functionality to pause during startMenu
Player.prototype.pause = false;

// Draw the character
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// What to do for each valid key...
//Beware lanes work decreasing up!!!
//include check for not moving off the board
Player.prototype.handleInput = function(direction) {
    if (this.pause == false) {
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
        };
    };
};

// Update character

Player.prototype.update = function() {
    // win update adjust scores, pause, and add new items
    if (this.lane == 0) {
        this.lane = 5;
        this.wins += 1;
        this.score += 100;
        this.pause = true;
        setTimeout(function() {
            player.x = 202;
            player.y = 400;
            player.pause = false;
        }, 500)
        if (this.wins % 2 == 0) {
            if (counts.gem < 2) {
                addItem(Gem);
                counts.gem += 1;
            }
        };
        if (this.wins % 3 == 0) {
            if (counts.rock < 4) {
                addItem(Rock);
                counts.rock += 1;
            }
        };
        if (this.wins % 10 == 0) {
            if (counts.heart < 1) {
                addItem(Heart);
                counts.heart = 1;
            }
        };
        if (this.wins % 10 == 0) {
            speedMultiple = speedMultiple * 1.3;
        };

        // update scoreboard
        scoreboardWins.textContent = this.wins;
        scoreboardScore.textContent = this.score;
        if (this.score > topScore) {
            topScore = this.score;
            scoreboardTopScore.textContent = topScore;
        }
    };

    // Detect and process collisions with Items
    allItems.forEach(function(item) {
        if ((item.x == player.x) && (item.y == player.y)) {
            item.collision();
        };
    });
};

// Begin state player rendering to select character.

function BeginPlayer() {
    this.sprite1 = {image: 'images/char-boy.png', x: 202, y: 400};
    this.sprite2 = {image: 'images/char-cat-girl.png', x: 101, y: 400};
    this.sprite3 = {image: 'images/char-horn-girl.png', x: 0, y: 400};
    this.sprite4 = {image: 'images/char-princess-girl.png', x: 303, y: 400};
    this.sprite5 = {image: 'images/char-pink-girl.png', x: 404, y: 400};
    this.sprite6 = {image: 'images/selector.png', x: 202, y: 400};
};

// Effectively a start menu of characters
BeginPlayer.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite6.image), this.sprite6.x, this.sprite6.y);
    ctx.drawImage(Resources.get(this.sprite1.image), this.sprite1.x, this.sprite1.y);
    ctx.drawImage(Resources.get(this.sprite2.image), this.sprite2.x, this.sprite2.y);
    ctx.drawImage(Resources.get(this.sprite3.image), this.sprite3.x, this.sprite3.y);
    ctx.drawImage(Resources.get(this.sprite4.image), this.sprite4.x, this.sprite4.y);
    ctx.drawImage(Resources.get(this.sprite5.image), this.sprite5.x, this.sprite5.y);
};
// Blank function to avoid errors when update is trying to call player.update()
// Alternative was an instanceof check in the update file, but this is more economical.
BeginPlayer.prototype.update = function() {};

// Function for dealing with possible keystrokes prior to character selection
BeginPlayer.prototype.handleInput = function(direction) {
    // If we're sitting on the GameOver modal, only pressing enter to clear modala is valid.
    if (gameOverStatus == true) {
        if (direction == 'enter') {
            gameOverStatus = false;
            gameOverModal.style.display = 'none';
        };
    } else {
        // Only allow direction keys to change and select character.
        if ((direction == 'left') && (this.sprite6.x != 0)) {
            this.sprite6.x -= 101;
        } else if ((direction == 'right') && (this.sprite6.x != 404)) {
            this.sprite6.x += 101;
        } else if (direction == 'up') {
            // Find which character the selctor is sitting on
            // set the nextSprite sprite value to appropriate character
            let nextSprite = {sprite: '', x: 0};
            if (this.sprite6.x == 0) {
                nextSprite.sprite = this.sprite3.image;
            } else if (this.sprite6.x == 101) {
                nextSprite.sprite = this.sprite2.image;
            } else if (this.sprite6.x == 202) {
                nextSprite.sprite = this.sprite1.image;
            } else if (this.sprite6.x == 303) {
                nextSprite.sprite = this.sprite4.image;
            } else if (this.sprite6.x == 404) {
                nextSprite.sprite = this.sprite5.image;
            };
            nextSprite.x = this.sprite6.x;
            // create new player with correct sprite character
            player = new Player();
            player.sprite = nextSprite.sprite;
            player.x = nextSprite.x;
            // populate Enemies
            // also ensures after a restart, the enemies start from left of screen
            let enemyA = new Enemy();
            let enemyB = new Enemy();
            let enemyC = new Enemy();
            allEnemies = [enemyA, enemyB, enemyC];
        };
    }
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
// Has been modified to add 'Enter' key.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// This will be called at initialisation then every reset.
// Clears all enemies and items
const startMenu = function() {
    allEnemies = [];
    speedMultiple = 1;
    allItems = [];
    // adjust counts
    counts = {
        gem: 0,
        heart: 0,
        rock: 0
    };
    // Clear scores other than topscore
    scoreboardGems.textContent = 0;
    scoreboardWins.textContent = 0;
    scoreboardLives.textContent = 0;
    scoreboardScore.textContent = 0;
    // Go back to the player selection menu
    player = new BeginPlayer();

}

// GameOver alert/modal
const gameOver = function() {
    gameOverScore.textContent = player.score;
    gameOverModal.style.display = 'block';
    gameOverStatus = true;
    // The BeginPlayer handler will listen for 'Enter' and not allow
    // character selection until tht key is pressed.
    startMenu();
}

// Programme addition of items  - key, rock, gem, heart

let allItems = [];

function addItem(itemType) {
    // Player will be back at start, so just need to check for existing gems
    // If too many of a type, don't add. max 2 gems etc
    // Attempt to create and place item. If one already there, reattempt till successful.
    let newItem = new itemType();

    // Run a loop on allItems array to see if newItems co-ordinates clash with any there.
    let itemClash = false;
    allItems.forEach(function(element) {

        // If no clash add the newItems to array.
        if ((element.x == newItem.x) && (element.y == newItem.y)) {
            itemClash = true;
        }
    })
    if (itemClash == false) {
        allItems.push(newItem);

    //Else restart the function.
    } else {
        addItem(itemType);
    }
};

class Item {
    constructor() {
      // Allocate an object to a random place on the road.
        this.y = 400 - ((Math.floor(Math.random() * 3) + 2) * 83);
        this.x = (Math.floor(Math.random() * 5)) * 101;
        this.render = function() {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }
    }
};

// Specifics for Gems
class Gem extends Item {
    constructor() {
        super();
        // Random colour choice
        let randomOfThree = Math.floor(Math.random() * 3)
        switch (randomOfThree) {
            case 0:
                this.sprite = 'images/Gem Orange.png'
                break
            case 1:
                this.sprite = 'images/Gem Blue.png'
                break;
            case 2:
                this.sprite = 'images/Gem Green.png';
        }

        //If gems collected
        this.collision = function() {
            //update counts and scoreboards
            player.score += 40;
            player.gems += 1;
            counts.gem -= 1;
            scoreboardScore.textContent = player.score;
            scoreboardGems.textContent = player.gems;
            if (player.score > topScore) {
                topScore = player.score;
                scoreboardTopScore.textContent = topScore;
            };

            //remove gem
            allItems.splice(allItems.indexOf(this),1);
        };
    }
};

//Rock specifics
class Rock extends Item {
    constructor() {
        super();
        this.sprite = 'images/Rock.png';

        //handle collisions, either gameover or lose life and remove rock
        this.collision = function() {
            if (player.lives == 0) {
                gameOver();
            } else {
                player.lives -= 1;
                scoreboardLives.textContent = player.lives;
                allItems.splice(allItems.indexOf(this),1);
                counts.rock -= 1;
            }
        };
    }
};

//Heart specifics
class Heart extends Item {
    constructor() {
        super();
        this.sprite = 'images/Heart.png';

        // handle collisions - gain life and remove heart
        this.collision = function() {
            player.lives += 1;
            counts.heart -= 1;
            scoreboardLives.textContent = player.lives;
            allItems.splice(allItems.indexOf(this),1);
        };
    }
};
