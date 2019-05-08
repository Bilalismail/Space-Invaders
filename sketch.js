var x = 300, // variable to track the player's ship's x value
  y = 510, // variable to track the player's ship's y value
  Score = 0, // variable to track the player's Score
  cmeasure = 0, // cmeasure variable, to use later for timining
  timer = 200, // timer variable, to use later for timining
  currentScreen = 0, // variable to track the current screen
  textsize = 0, // text size variable, to be used for visual feedback
  cmeasure2 = 0, // cmeasure variable, to use later for timining
  cmeasure3 = 0, // cmeasure variable, to use later for timining
  Life = 100, // variable to track the player's current Life
  textX = -250, // text x variable, to be used for slide in illusion
  measureBullet = 0, // track the amount of bullets made
  trackingenemyDeath = 0, // track the amount of enemy killed
  missingEnemy = 0, // track the amount of enemy missed
  minusScore = 0; // track the amount of Score lost

var imageofShip, 
  badimageofShip, 
  title, 
  optionPress, 
  death, 
  damage, 
  shot,
  enemyShoot, 
  backgroundMusic, 
  mainMenuMusic; 
  // variables that hold their name functions to what they are.

var moveLeft = false, 
  rightMove = false, 
  upmove = false, 
  downmove = false, 
  shoot = false, 
  hovering = false, 
  controls = false, 
  paused = true; 
  // boolean values for motions and pause 
  
var bullets = [], 
  enemies = [], 
  enemiesbullets = [], 
  titleBackground = [], 
  stars = []; 
  // variables for game play shooting

function preload() {
  title = loadImage("gamelib/start.png")
  imageofShip = loadImage("gamelib/ship.png");
  badimageofShip = loadImage("gamelib/enemyship.png");
  optionPress = loadSound("gamelib/menu_select.wav");
  death = loadSound("gamelib/enemy_death.wav");
  damage = loadSound("gamelib/damage_taken.mp3");
  shot = loadSound("gamelib/shot.wav");
  enemyShoot = loadSound("gamelib/enemy_shot.wav");
  mainMenuMusic = loadSound("gamelib/menu_music.mp3");
  backgroundMusic = loadSound("gamelib/game_background.mp3");
}


function setup() {
  createCanvas(600, 600); // creates a canvas 600,600
  rectMode(CENTER); // makes it so rects are now created by it's centre
  ellipseMode(CENTER); // makes it so ellipses are now created by it's centre
  imageMode(CENTER); // makes it so images are now created by it's centre
  textAlign(CENTER); // makes it so text are now created by it's centre
  noStroke(); //no outlines
  optionPress.setVolume(0.3); // sets volume of sound
  death.setVolume(0.3); // sets volume of sound
  shot.setVolume(0.1); // sets volume of sound
  enemyShoot.setVolume(0.5); // sets volume of sound
 
  createTitleScreenBackground(); // run the 'CreateTitleScreenBackground' function
}


function draw() {

  switch (currentScreen) { // switch statement changes what currenScreen is
    case 0:
      startScreen(); // startScreen function
      break;
    case 1:
      gameScreen(); // gameScreen function
      break;
    case 3:
      gameoverScreen(); // gameoverScreen function
  }

}

function startScreen() {
  if (!mainMenuMusic.isPlaying()) {
    mainMenuMusic.play();
  } // if the music isn't playing, play it (continuous loop)
  background(250); 
  for (var i = 0; i < titleBackground.length; i++) { // for every element in the titleBackground array
    for (var j = 0; j < titleBackground[i].length; j++) { // for every element in the individual titleBackground element array
      titleBackground[i][j].display(); // display the object
      titleBackground[i][j].move(); // moves the object
      if (titleBackground[i][j].y < -10) { // if the element's y value, in the titleBackground element's array, is off screen
        titleBackground[i][j].restart(); // restart it
      }
    }
  }
  fill(0); 

  if (controls) {
    textSize(52);
    text("Instructions:", width / 2, 70);
    textSize(30);
    text("Arrow keys are used for navigation", width / 2, 360);
    text("Spacebar to shoot", width / 2, 410);
   // text("Click anywhere on the screen to pause", width / 2, 460);
    text("If any enemy ships approach, SHOOT!", width / 2, 140);
    //text("any and all in coming attacks in the process.", width / 2, 190);
    text("Allowing enemy ships going by hits you by 20", width / 2, 240);
   // text("Score and let innocent people die.", width / 2, 290);
    textSize(textsize); // text size be the variable 'textSize'
    text("CLICK HERE TO PLAY", width / 2, 530);
    if (mouseX < 365 && mouseX > 230 && mouseY > 490 && mouseY < 545) { // if the mouse is over the button
      textsize = 52; // make it's text size bigger, giving visual feedback that it is clickable
      if (!hovering) { // when the mouse scolls over the button
        optionPress.play(); // play the sound
      }
      hovering = true; // hovering becomes true so now if the mouse stays hovering over the button, the sound won't continuously loop
    } else { // when the mouse is not over the button
      textsize = 40; // make the text size small again
      hovering = false; // hovering is false so when the mouse goes back over the button, it'll play the sound again
    }
  } else {
    textSize(52);
    image(title, width / 2, 150);
    textSize(textsize);
    text("Click Here To Begin", width / 2, 400);
    if (mouseX < 345 && mouseX > 255 && mouseY > 365 && mouseY < 405) { // if the mouse is over the button
      textsize = 52; // make it's text size bigger, giving visual feedback that it is clickable
      if (!hovering) { // when the mouse scolls over the button
        optionPress.play(); // play the sound
      }
      hovering = true; // hovering becomes true so now if the mouse stays hovering over the button, the sound won't continuously loop
    } else { // when the mouse is not over the button
      textsize = 40; // make the text size small again
      hovering = false; // hovering is false so when the mouse goes back over the button, it'll play the sound again
    }
  }
}

function gameScreen() {
  if (!backgroundMusic.isPlaying()) {
    backgroundMusic.play();
  } // if the music isn't playing, play it (continuous loop)
  if (Life <= 0) {
    backgroundMusic.stop();
    currentScreen = 3;
  } // if Life is equal or below 0 (player is dead) go to game over screen and turn off the game music
  cmeasures(); // run the cmeasure function
  checkBoundries(); // run the check boundries function
  checkMovement(); // run the check movement function
  background(10, 25, 112); // background colour night blue
  drawShip(); // run the draw ship function
  for (var i = 0; i < stars.length; i++) { // for every element in the stars array
    stars[i].display(); // display the object
    stars[i].move(); // move the object
    if (stars[i].y > 610) { // if the element's y value, in the stars array, is more than 610
      stars[i].restart(); // restart it
    }
  }
  for (var i = 0; i < enemies.length; i += 1) { // for every element in the enemies array
    enemies[i].display(); // display the object
    if (!paused) { // if not paused, do the following
      enemies[i].move(); // move the object
    }
    if (enemies[i].y > 610) { // if the element's y value, in the enemies array, is more than 610
      enemies[i].offScreen(); // do the offScreen function
    }
  }
  for (var i = 0; i < enemiesbullets.length; i += 1) { // for every element in the enemiesbullets array
    enemiesbullets[i].display(); // display the object
    if (!paused) { // if not paused, do the following
      enemiesbullets[i].move(); // move the object
    }
    if (enemiesbullets[i].hits()) { // run this particular object's 'hits' function (which returns a boolean)
      enemiesbullets[i].remove(); //if true, run that object's remove function (remove it)
    }
    if ((enemiesbullets[i].enemyBullet.x > 610) || (enemiesbullets[i].enemyBullet.x < -10) || (enemiesbullets[i].enemyBullet.y > 610) || (enemiesbullets[i].enemyBullety > -10)) { // if the enemies bullets are off screen
      enemiesbullets[i].remove(); // run that bullets remove function
    }
  }
  for (var i = 0; i < bullets.length; i += 1) { // for every element in the bullets array
    bullets[i].display(); // display the object
    if (!paused) { // if not paused, do the following
      bullets[i].move(); // move the object
    }
    for (var j = 0; j < enemies.length; j += 1) { // for every element in the enemies array
      if (bullets[i].hits(enemies[j])) { // run this particular object's 'hits' function (with a parameter of the enemy object)
        enemies[j].damage(); // if true, run that particular enemy damage function
        bullets[i].remove(); // and run that bullets remove function
      }
    }
    if (bullets[i].y < 0) { // if the bullet off screens
      bullets[i].remove(); // run that bullets remove function
    }
  }
  for (var i = bullets.length - 1; i >= 0; i -= 1) { // for every element in the bullets array
    if (bullets[i].delete) { // if that bullet's delete booleon is true
      bullets.splice(i, 1); // splice that bullet out
    }
  }
  for (var i = enemies.length - 1; i >= 0; i -= 1) { // for every element in the enemy array
    if (enemies[i].delete) { // if that enemy's delete booleon is true
      enemies.splice(i, 1); // splice that enemy out
      death.play(); // play the death sound
    }
  }
  for (var i = enemiesbullets.length - 1; i >= 0; i -= 1) { // for every element in the enemy bullet array
    if (enemiesbullets[i].delete) { // if that bullet's delete booleon is ture
      enemiesbullets.splice(i, 1); // splice that bullet out
    }
  }
  UI(); // run the UI function
}

function gameoverScreen() {
  if (!mainMenuMusic.isPlaying()) {
    mainMenuMusic.play();
  } // if the music isn't playing, play it (continuous loop)
  textX += 15; // have textX incriment so the text slides across screen
  if (textX > width / 2) {
    textX = width / 2; // once the text reaches the middle, stop it from moving
  }
  background(0, 100, 0);
  textSize(52);
  text("Game Over.", width / 2, 80);
  text("Your Score: " + Score, textX, 190);
  textSize(42);
 
  text("Stats", width / 2, 390);
  push(); // push and pop makes sure the code only runs within push and pop
  stroke(0); // black stroke (in push/pop since I don't want stroke for rest of the program)
  noFill(); // noFill (in push/pop since I want a fill for rest of the program)
  //rect(width / 2, 450, 500, 200);
  strokeWeight(2); // thicker outline
  
  pop(); // push and pop makes sure the code only runs within push and pop
  textSize(22);
  
  text("You killed " + trackingenemyDeath + " enemy ships", width / 2, 470);
  text("You missed " + missingEnemy + " enemy ships", width / 2, 500);
  text("You shot " + measureBullet + " bullets", width / 2, 440);
  text("You lost " + minusScore + " Score", width / 2, 530);
}

/***************************************************************************
 Checkmovement function is to see if the player is pressing and holing
 the arrow and/or the spacebar, if yes then the corresponding boolean 
 becomes true and thus the ship will coninue moving, once the user
 lets go the boolean becomes false so the moving code doesn't move anymore.
 This allows the user to hold the movement direction and have the code
 continue continuously.
***************************************************************************/
function checkMovement() {
  if (shoot && !paused) { // if shoot is true and it is not paused
    if (cmeasure % 5 == 0) { // if the modulus of cmeasure / 5 is 0, do the following (this slows down the creation of the bullets)
      var bullet = new Bullet(x, y - 25); //creates a new bullet at the ship's x value and a little higher than it's y value
      bullets.push(bullet); // push the newly created bullet into the bullets array
      measureBullet += 1; // a new bullet is shot so the bullet count goes up by once (for the stats page on the gameover screen)
      shot.play(); // play the bullet sound
    }
  }
  if (moveLeft && !paused) { // if moveLeft is true and it is not paused
    x -= 5; // move the ship left
  }
  if (rightMove && !paused) { // if rightMove is true and it is not paused
    x += 5; // move the ship right
  }
  if (upmove && !paused) { // if upmove is true and it is not paused
    y -= 5; // move the ship up
  }
  if (downmove && !paused) { // if downmove is true and it is not paused
    y += 5; // move the ship down
  }
}

/***************************************************************
 Checkboundries function is to see if the player leaves the 
 confindes of the screen, if so make the corresponding boolean
 false so the ship no longer moves
***************************************************************/
function checkBoundries() {
  if (x > 560) { // if ship is more than the right of the screen
    rightMove = false; // stop it moving
  } else if (x < 40) { // if ship is more than the left of the screen
    moveLeft = false; // stop it moving
  }
  if (y > 560) { // if ship is more than the bottom of the screen
    downmove = false; // stop it moving
  } else if (y < 30) { // if ship is more than the top of the screen
    upmove = false; // stop it moving
  }
}

function cmeasures() {
  cmeasure += 1; // incriment the cmeasure
  if ((cmeasure > timer) && !paused) { // if cmeasure is bigger than timer, do the following
    createEnemies(); // create an enemy
    cmeasure = 0; // reset the cmeasure
    if (timer > 100) { // as long as timer is bigger than 100,
      timer -= 10; // minus it by 10, this makes the above code run faster and faster making the enemies spawn faster as time progressess
    }
  }
  cmeasure3 += 1; // incriment the cmeasure
  if (cmeasure3 > 38) { // if bigger than 38, reset it (to be used for the ship's engine fire)
    cmeasure3 = 0;
  }
}



function drawShip() {
  image(imageofShip, x, y); // image of the ship
 
  if (cmeasure3 < 8) { //cmeasure for the first ellipse duration
    fill(0, 200, 255); //fill a blue flame colour
    ellipse(x + 28, y + 60, 20, 20); //first ellipse
    ellipse(x - 28, y + 60, 20, 20); //first ellipse
    ellipse(x + 9, y + 50, 10, 10); //first middle ellipse
    ellipse(x - 9, y + 50, 10, 10); //first middle ellipse
    fill(255); //white glow
    ellipse(x + 28, y + 60, 15, 15); //first ellipse (glow)
    ellipse(x - 28, y + 60, 15, 15); //first ellipse (glow)
  } else if (cmeasure3 < 18) { //cmeasure for the second ellipse duration
    fill(0, 200, 255); //fill a blue flame colour
    ellipse(x + 28, y + 70, 14, 14); //second elipse
    ellipse(x - 28, y + 70, 14, 14); //second elipse
    ellipse(x + 9, y + 60, 5, 5); //second middle elipse
    ellipse(x - 9, y + 60, 5, 5); //second middle elipse
    fill(255); //white glow
    ellipse(x + 28, y + 70, 9, 9); //second elipse (glow)
    ellipse(x - 28, y + 70, 9, 9); //second elipse (glow)
  } else if (cmeasure3 < 28) {
    fill(0, 200, 255); //fill a blue flame colour
    ellipse(x + 28, y + 75, 8, 8); //final ellipse
    ellipse(x - 28, y + 75, 8, 8); //final ellipse
  }
}

/***************************************************************************
 This object draws a lot of star object, with random parameters (see setup)
***************************************************************************/
function Star(starX, starY, starSpeed, starSize) { // star object, has parameters
  this.x = starX, // this objects x should be starX
    this.y = starY, // this objects y should be starY
    this.speed = starSpeed, // this objects speed should be starSpeed
    this.size = starSize; // this objects size should be starSize
  this.display = function() { //display function
    fill(0, 255, 255); // slight cyan glow for the star
    ellipse(this.x, this.y, this.size + 0.5, this.size + 0.5); // slightly bigger ellipse for glow
    fill(255); // white star
    ellipse(this.x, this.y, this.size, this.size); // star
  }
  this.move = function() { // move function
    this.y = this.y + this.speed; // move this start by this star's speed
  }
  this.restart = function() { // restart function
    this.y = -10; // restart the star off screen
    this.x = Math.floor(random(0, width)); // random x value anywhere on the screen
    this.speed = random(1, 5); // random speed
    this.size = Math.floor(random(1, 5)); // random size
  }
}

/***************************************************************************
 This object draws a lot of objects, with random parameters (see setup)
***************************************************************************/
function TitleBackground(x, y, speed) {
  this.x = x; // this objects x should be x
  this.y = y; // this objects y should be y
  this.speed = speed; // this objects speed should be speed
  this.display = function() { //display function
    fill(255); // white colour
    ellipse(this.x, this.y, 5, 5); // ellipse
  }
  this.move = function() { //display function
    this.x += random(-2, 2); // wiggle it by x value
    this.y -= speed; // make it move up the screen
  }
  this.restart = function() { //restar function
    this.y = 610; // start the ellipse back to slightly below the bottom
  }
}

/***************************************
 This object is for the players bullets
***************************************/
function Bullet(x, y) {
  this.x = x; // make the x value of this bullet the x value of the ship
  this.y = y; // make the y value of this bullet the y value of the ship (but slightly higher)
  this.delete = false; // boolen to be used to see if the bullet off screens or hits an enemy
  this.display = function() { // display function
    fill(0, 200, 255); // slight blue glow for the bullet
    rect(this.x, this.y, 6, 19); // slightly bigger rect for glow
    fill(255); // white bullet
    rect(this.x, this.y, 5, 18); // bullet
  }
  this.move = function() { // move function
    this.y -= 10; // move the bullet up
  }
  this.hits = function(enemy) {
    if ((this.x + 3 < enemy.x + 25) && (this.x - 3 > enemy.x - 25) && (this.y + 9 > enemy.y - 25) && (this.y - 9 < enemy.y + 25)) { // if the bullet is within the enemy (meaning it hits) do the following,
      trackingenemyDeath += 1; // enemy kill count goes up by one (top be used as stats for game over screen)
      return true; // return true (yes it hit)
    } else { // otherwise
      return false; // return false (no it didn't hit)
    }
  }
  this.remove = function() { // remove function
    this.delete = true; // if off screen or an enemy is hit, delete becomes true so his bullet get's spliced out
  }
}

/*******************************
 This object is for the enemies
*******************************/
function Enemy(x) {
  this.x = x; // this enemys x value be a random value between o and width (check createEnemy)
  this.y = -40; // have it's y value be off screen
  this.delete = false, // boolen to be used to see if the enemy off screens or is hit by the player
    this.enemyShot = false, // boolean to see if this ship has shot once already (otherwise it'll continuously keep shooting)
    this.Life = 2; // enemies' Life
  this.display = function() { // display function
    image(badimageofShip, this.x, this.y); // image of the enemy
    /***************************************************
     Same exact deal here as is with draw ship, creates
     the illusion that the ships are propelled with
     thrusters (see drawShip for detailed explanation)
    ***************************************************/
    if (cmeasure3 < 8) {
      fill(255, 200, 0);
      ellipse(this.x + 28, this.y - 60, 20, 20);
      ellipse(this.x - 28, this.y - 60, 20, 20);
      ellipse(this.x + 9, this.y - 50, 10, 10);
      ellipse(this.x - 9, this.y - 50, 10, 10);
      fill(255);
      ellipse(this.x + 28, this.y - 60, 15, 15);
      ellipse(this.x - 28, this.y - 60, 15, 15);
    } else if (cmeasure3 < 18) {
      fill(255, 200, 0);
      ellipse(this.x + 28, this.y - 70, 14, 14);
      ellipse(this.x - 28, this.y - 70, 14, 14);
      ellipse(this.x + 9, this.y - 60, 5, 5);
      ellipse(this.x - 9, this.y - 60, 5, 5);
      fill(255);
      ellipse(this.x + 28, this.y - 70, 9, 9);
      ellipse(this.x - 28, this.y - 70, 9, 9);
    } else if (cmeasure3 < 28) {
      fill(255, 200, 0);
      ellipse(this.x + 28, this.y - 75, 8, 8);
      ellipse(this.x - 28, this.y - 75, 8, 8);
    }
    if ((this.y > 60) && (!this.enemyShot)) { // if the ship is on screen and hasn't shot yet
      for (var i = 0; i < 10; i += 1) { // shoot 10 bullets
        var enemybullet = new EnemyBullet(this.x, this.y + 50); // in a loop so 10 enemyBulet objects get made
        enemiesbullets.push(enemybullet); // push all these objects into the enemiesbullets array
        enemyShoot.play(); // play the enemy bullet sound
        this.enemyShot = true; // now the enemy has shot, this becomes true so the enemy won't keep shooting
      }
    }
  }

  this.move = function() { // move function
    this.y += 1; // move the enemy
  }

  this.damage = function() { // damage function
    this.Life -= 1; // if enemy is hit, lower it's Life by 1
    if (this.Life < 0) { // if Life is below 0, remove the enemy
      Score += 10; // because the player killed an enemy, he get's 10 Score
      this.delete = true; // elete becomes true so this enemy get's spliced out
    }
  }

  this.offScreen = function() { // off screen function
    Score -= 20; // if the player fails to kill an enemy before it leaves the screen, they lose 20 Score
    minusScore += 20; // the cmeasure for how many Score the player loses goes up by 20 (to be used as stats for game over screen)
    missingEnemy += 1; // the cmeasure for how many enemies the player misses goes up by 1 (to be used as stats for game over screen)
    this.delete = true; // delete becomes true sso the enemy  get's spliced out the array
  }
}

/****************************************
 This object is for the enemies' bullets
****************************************/
function EnemyBullet(xPos, yPos) {
  this.movement = p5.Vector.random2D(), // create a vector to move the enemy bullet at random values
    this.enemyBullet = createVector(xPos, yPos), // create a bullet object at the enemy's x and slightly lower y value (just infront of the enemy)
    this.delete = false; // boolen to be used to see if the enemy off screens or is hit by the player
  this.display = function() { // display function
    fill(255, 200, 0); // orange glow for the bullet
    ellipse(this.enemyBullet.x, this.enemyBullet.y, 15, 15); // slightly bigger ellipse for glow
    fill(255); // white bullet
    ellipse(this.enemyBullet.x, this.enemyBullet.y, 10, 10); // bullet
  }

  this.move = function() { // move funcion
    if (this.movement.y < 0) { // if the movement vector random y value is negtive (meaning it'll move up),
      this.movement.y = -this.movement.y; // make it possitive (move down)
    }
    cmeasure2++; // incriment cmeasure by 1
    if (cmeasure2 > 50) { // if cmeasure is above 50 (so it slows down the code)
      cmeasure2 = 0; // reset the cmeasure
      this.movement.mult(3); // multiple the movement by 3 (make the bullet faster)
    }
    this.enemyBullet.add(this.movement); // move the created bullet by movement
  }

  this.hits = function() { // hits function
    if ((this.enemyBullet.x < x + 25) && (this.enemyBullet.x > x - 25) && (this.enemyBullet.y < y + 25) && (this.enemyBullet.y > y - 25)) { // if the bullet is within the player's ship (meaning it hits) do the following,
      Life -= 5; // minus Life by 5
      damage.play(); // play the damage taken sound
      return true; // return true (yes it hit)
    } else { //otherwise
      return false; // return false (no it didn't hit)
    }
  }
  this.remove = function() { // remove function
    this.delete = true; // remove the enemy bullet that hit the player or went off screen
  }
}

/**************************************************************************
 createEnemies function is to spawn an enemy to the game, because it is in
 a cmeasure, the enemies are spawn periodcally and faster as time goes on
**************************************************************************/
function createEnemies() {
  var enemy = new Enemy(Math.floor(random(45, 555))); // creates an enemy with random x value
  enemies.push(enemy); // pushes it into the enemies array
}

/****************************************************************************
 createStars function creates 150 star objects with a ramdom location, size
 and speed. It then pushes the objects created in to the stars array. This
 all happens once at the start of the program (see setup)
****************************************************************************/
function createStars() {
  for (var i = 0; i < 150; i += 1) {
    var star = new Star(Math.floor(random(0, width)), Math.floor(random(0, height)), random(1, 5), Math.floor(random(1, 5)));
    stars.push(star);
  }
}

/****************************************************************************
 createTitleScreenBackground function creates a 2D array for holing the
 background of the title screen, it creates a collum of objects that is an
 array within an array of rows, thus filling the entire screen. This
 all happens once at the start of the program (see setup)
****************************************************************************/
function createTitleScreenBackground() {
  for (var i = 0; i < 10; i++) {
    titleBackground[i] = [];
    for (var j = 0; j < 8; j++) {
      titleBackground[i][j] = new TitleBackground(Math.floor(random(0, width)), Math.floor(random(0, height)), random(1, 5));
    }
  }
}

/******************************************************************
 UI function draws and updates the player Life and Score to the
 screen as well as the pause screen
******************************************************************/
function UI() {
  fill(255);
  textSize(25);
  text("Life: " + Life, 80, 30);
  text("Score: " + Score, 520, 30);
  if (paused) { //if the game is paused
    fill(255, 0, 0); // make a red rect that says "PAUSED" on the screen as visual feed back
    rect(width / 2, height / 2, width, 200);
    textSize(80);
    fill(255);
    push(); // push and pop makes sure the code only runs within push and pop
    stroke(255); // white stroke (in push/pop since I don't want stroke for rest of the program)
    text("PAUSED", width / 2, 325);
    pop(); // push and pop makes sure the code only runs within push and pop
  }
}

/****************************************************
 keyPressed function checks to see if a key is being
 pressed, if yes check if the keys are the following
****************************************************/
function keyPressed() {
  if (key === ' ') { // if spacebar is being held
    shoot = true; // shoot becomes true so bullets will keep being made as long as it is held
  }
  if (keyCode == RIGHT_ARROW) { // if right arrow is held
    rightMove = true; // rightMove becomes true so the player's ship will keep moving as long as it is held
  }
  if (keyCode == LEFT_ARROW) { // if left arrow is held
    moveLeft = true; // moveLeft becomes true so the player's ship will keep moving as long as it is held
  }
  if (keyCode == UP_ARROW) { // if up arrow is held
    upmove = true; // upmove becomes true so the player's ship will keep moving as long as it is held
  }
  if (keyCode == DOWN_ARROW) { // if down arrow is held
    downmove = true; // downmove becomes true so the player's ship will keep moving as long as it is held
  }
}

/*******************************************************
 keyReleased function checks to see if a key is let go,
 if yes check if the keys are the following
*******************************************************/



function mousePressed() {
  if (mouseX < 345 && mouseX > 255 && mouseY > 365 && mouseY < 405 && currentScreen === 0 && !controls) { // if the mouse is in the confines of the "start" button and is on the startscreen and it isn't on the how to play screen
    optionPress.play(); // play the optionPress sound
    controls = true; // make controls true so the screen turns to the 'how to pay' screen since it makes the controls boolen true
  }
  if (mouseX < 365 && mouseX > 230 && mouseY > 490 && mouseY < 545 && currentScreen === 0 && controls) { // if the mouse is in the confines of the "begin" button and is on the startscreen and it is on the how to play screen
    optionPress.play(); // play the optionPress sound
    mainMenuMusic.stop(); // stop the main menu music
    controls = false; // make controls false
    currentScreen = 1; // move to game screen
  }
  if (mouseX < width && mouseX > 0 && mouseY > 0 && mouseY < height && currentScreen === 1) { // if the mouse is clicked in the confines of the canvas and it is the game screen
    paused = !paused; // pause and unpause
  }
}


function keyReleased() {
  if (key === ' ') { // if spacebar is let go
    shoot = false; // shoot becomes false so the bullets will no longer be created
  }
  if (keyCode == RIGHT_ARROW) { // if right arrow is let go
    rightMove = false; // rightMove becomes false so the ship stops moving
  }
  if (keyCode == LEFT_ARROW) { // if right arrow is let go
    moveLeft = false; // moveLeft becomes false so the ship stops moving
  }
  if (keyCode == UP_ARROW) { // if right arrow is let go
    upmove = false; // upmove becomes false so the ship stops moving
  }
  if (keyCode == DOWN_ARROW) { // if right arrow is let go
    downmove = false; // downmove becomes false so the ship stops moving
  }
}