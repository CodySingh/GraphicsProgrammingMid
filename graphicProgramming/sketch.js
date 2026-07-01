

//import Matter.js Library
let Engine = Matter.Engine;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Body = Matter.Body;

//Global variables 
let engine;
let world;
let wudth = 1400;
let height = 700;

let spawnMode = false;
let player = null;


let wallThickness = 5;

let startingAreaW = 100;

//arrays for objects
let cars = [];
let walls = [];

//INITIALISATION FUNCTIONS 
function setup(){

    createCanvas(1400,700);
    stroke(0);
    strokeWeight(3);

    engine = Engine.create();
    world = engine.world;

    world.gravity.y = 0;
    world.gravity.x = 0;

    Matter.Events.on(engine, "collisionStart", collisionSystem);

    createWalls();

}


function draw(){

    background(220);

    //player and computer Inputs
    playerControl();
    opponentControls();

    //updating engine 
    Engine.update(engine);

    //drawing of playing area 
    playingArea();
    startingArea();

    //spawning player and computer cars
    if (spawnMode) {

        push();

        noStroke();
        fill('black');
        textSize(24);
        textStyle(NORMAL);

        text("Click in the blue area to spawn", 250, 400);

        pop();

    }
    
    //drawing of cars and walls 
    for (let car of cars) { 
        car.draw();
    }

    for (let wall of walls) {
        wall.draw();
    }

}



//HELER FUNCTIONS 
function playingArea(){

    fill('white');
    rect(2, 2, width - 4, height - 4);

}

function startingArea(){

    fill('blue');
    rect(0,0,100,700);

    
}

function keyPressed() {

    if (key === "i" || key === "I") {

        resetGame();

    }
}

function mousePressed() {

    if (!spawnMode)
        return;

    if (mouseX >= 0 && mouseX <= startingAreaW && mouseY >= 0 && mouseY <= height) {
        spawnPlayer(50, 350);
        //spawnOpponent(50,150, 'yellow', 0.025, 8, 3, 0.04);
        //spawnOpponent(50,100, 'green', 0.025, 8, 3, 0.04);
        //spawnOpponent(50,300, 'white', 0.025, 8, 3, 0.04);
        //spawnOpponent(50,400, 'pink', 0.025, 8, 3, 0.04);
        spawnMode = false;
    }

}

function resetGame() {

    for (let car of cars) {
        World.remove(world, car.body);
    }

    cars = [];
    player = null;

    spawnMode = true;

}

function spawnPlayer(x, y) {

    player = new car(x, y, 50, 30, 'red', 0.025, 8, 3, 0.04, "player");
    cars.push(player);

}

function playerControl() {

    if(player == null) {
        return;
    }
    if (keyIsDown(UP_ARROW)) {
        player.moveRight();
    }
    if (keyIsDown(DOWN_ARROW)) {
        player.moveLeft();
    }
    if (keyIsDown(LEFT_ARROW)) {
        player.turnLeft();
    }
    if (keyIsDown(RIGHT_ARROW)) {
        player.turnRight();
    }

}

function spawnOpponent(x, y, color, engineForce, maxForwardSpeed, maxReverseSpeed, turnSpeed) {

    let opponent = new car(x, y, 50, 30, color, engineForce, maxForwardSpeed, maxReverseSpeed, turnSpeed, "opponent");
    cars.push(opponent);

}

function opponentControls() {

    for (let car of cars) {

        if (car.type != "opponent")
            continue;

        car.moveRight();

    }
}

function collisionSystem(event) { 

    for (let pair of event.pairs) {

        let bodyA = pair.bodyA;
        let bodyB = pair.bodyB;

        //if opponent hit wall
        if (bodyA.type == "opponent" && bodyB.type == "wall") {

            bodyA.gameObject.turnAround();

        }

        else if (bodyB.type == "wall" && bodyA.type == "opponent") {

            bodyA.gameObject.turnAround();

        }

        //if opponent hit car
        else if (bodyA.type == "opponent" && (bodyB.type == "opponent" || bodyB.type == "player")) {
            
            bodyA.gameObject.turnRandom90();

        }

        else if (bodyB.type == "opponent" && bodyA.type == "opponent" || bodyA.type == "player") {

            bodyB.gameObject.turnRandom90();

        }
    }
}

function createWalls() {

    walls.push(new wall(width/2, wallThickness/2, width, wallThickness, 'black')); //top wall
    walls.push(new wall(width/2, height - wallThickness/2, width, wallThickness, 'black')); //bottom wall
    walls.push(new wall(wallThickness/2, height/2, wallThickness, height, 'black'));//left wall
    walls.push(new wall(width - wallThickness/2, height/2, wallThickness, height, 'black'));//right wall
}

// CLASSES 
class car {

     //standard car specs: engineForce: 0.0025, maxForwardSpeed: 8, maxReverseSpeed: 3, turningSpeed: 0.04
    //slow car specs: engineForce: 0.0015, maxForwardSpeed: 4, maxReverseSpeed: 2, turningSpeed:0.03
    constructor(x, y, w, h, color, engineForce, maxForwardSpeed, maxReverseSpeed, turnSpeed, type){

        
        //car properties
        this.width = w;
        this.height = h;
        this.color = color;

        
        //car movement properties 
        this.maxForwardSpeed = maxForwardSpeed;
        this.maxReverseSpeed = maxReverseSpeed;

        this.engineForce = engineForce;
        this.turnSpeed = turnSpeed;

        //car type
        this.type = type;

        this.body = Bodies.rectangle(x, y, w, h, {restitution: 0.5, friction:0.5});

        //Information for the Collision System
        this.body.type = type;
        this.body.gameObject = this;

        World.add(world, this.body);

    }
    
    draw() {

        push();

        translate( this.body.position.x, this.body.position.y);
        rotate(this.body.angle);

        rectMode(CENTER);
        fill(this.color);
        rect(0, 0, this.width, this.height);

        //windscreen
        fill('black');
        rect(this.width * 0.2, 0, this.width * 0.3, this.height * 0.77);

        //headlights
        fill('yellow');
        circle(this.width / 2, -this.height / 4, 6);
        circle(this.width / 2, this.height /4, 6);

        //taillights
        fill('red');
        circle(-this.width / 2, -this.height / 4, 6);
        circle(-this.width / 2, this.height / 4, 6);

        pop();

    }

    //Right is relative to the player's view (forward)
    moveRight() {

        let angle = this.body.angle;

        let forwardSpeed = this.body.velocity.x * Math.cos(angle) + this.body.velocity.y * Math.sin(angle);

        if (forwardSpeed < this.maxForwardSpeed) {

            Body.applyForce(this.body, this.body.position, {
                x: Math.cos(angle) * this.engineForce,
                y: Math.sin(angle) * this.engineForce
            });

        }

    }
    
    //Left is relative to the player's view (reverse)
    moveLeft() {

        let angle = this.body.angle;

        let reverseSpeed = this.body.velocity.x * Math.cos(angle) + this.body.velocity.y * Math.sin(angle);

        if (reverseSpeed > -this.maxReverseSpeed) {

            Body.applyForce(this.body, this.body.position, {
                x: -Math.cos(angle) * this.engineForce,
                y: -Math.sin(angle) * this.engineForce
            });
            
        }

    }
    
    turnLeft() {

        Body.setAngle(this.body, this.body.angle - this.turnSpeed);

    }

    turnRight() {

        Body.setAngle(this.body, this.body.angle + this.turnSpeed);

    }

    turnAround() {

        Body.setAngle(this.body, this.body.angle + PI);

    }

    turnRandom90() {

        let turn;

        if (random() < 0.5) {

            turn = HALF_PI;

        }

        else {

            turn = -HALF_PI;

        }

        Body.setAngle(this.body, this.body.angle + turn);

    }

    
}

class wall {
    constructor(x, y, w, h, color) {
  
        this.width = w;
        this.height = h;
        this.color = color;
        this.body = Bodies.rectangle(x, y, w, h, {isStatic: true, restitution:1});

        this.body.type = "wall";
        
        World.add(world, this.body);

    }

    draw() {

        push();
        rectMode(CENTER);
        fill(this.color);
        rect(this.body.position.x, this.body.position.y, this.width, this.height);
        pop();

    }
}