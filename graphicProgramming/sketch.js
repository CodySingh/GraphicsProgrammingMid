

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
let gameMode = null;


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
    Matter.Events.on(engine, "collisionStart", collisionSystem);
    world = engine.world;

    world.gravity.y = 0;
    world.gravity.x = 0;

    
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
    

    
    spawnFunction();
    drawUI();

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

function drawUI() {

    push();

    fill(0);
    noStroke();

    textSize(18);
    textStyle(BOLD);
    text("Arena Selection", 1120, 40);

    textStyle(NORMAL);
    textSize(16);

    text("1 - Practice Mode", 1120, 70);
    text("2 - Random Opponents", 1120, 95);
    text("3 - Advanced Opponents", 1120, 120);

    text("", 1120, 140);

    text("I - Arm Vehicle Spawn", 1120, 170);
    text("Click inside the blue Start Zone", 1120, 195);

    text("", 1120, 220);

    fill("red");
    textSize(18);

    if (gameMode == null) {
        text("Current Mode: None", 1120, 250);
    }

    else if (gameMode == "practice") {
        text("Current Mode: Practice", 1120, 250);
    }

    else if (gameMode == "random") {
        text("Current Mode: Random", 1120, 250);
    }

    else if (gameMode == "advanced") {
        text("Current Mode: Advanced", 1120, 250);
    }

    pop();

}

function keyPressed() {

    if (key === "i" || key === "I") {

        resetGame();

    }

    if (key === "1") {

        resetGame();

        gameMode = "practice";

        
    }

    if (key === "2") {

        resetGame();
        gameMode = "random";
        
    }

    if (key === "3") {

        resetGame();
        gameMode = "advanced";
        
    }
}

function mousePressed() {


    if (!spawnMode)
        return;

    if (mouseX >= 0 && mouseX <= startingAreaW && mouseY >= 0 && mouseY <= height) {
        
        spawnPlayer(50, 350);

    }

    if (gameMode === "practice") {

        startPracticeMode();

    }

    else if (gameMode === "random") {

        startRandomMode();

    }

    else if (gameMode === "advanced") {

        startAdvancedMode();

    }

    spawnMode = false;

}

function resetGame() {

    for (let car of cars) {
        World.remove(world, car.body);
    }

    cars = [];
    player = null;

    spawnMode = true;

}


function spawnFunction() {

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

function startPracticeMode() {

    resetGame();
    spawnPlayer(50, 350);

    gameMode = "practice";

    spawnOpponent(50, 150, "yellow");
    spawnOpponent(50, 250, "green");
    spawnOpponent(50, 450, "white");
    spawnOpponent(50, 550, "pink");

}

function startRandomMode() {

    resetGame();
    spawnPlayer(50, 350);

    gameMode = "random";
    
    let colours = ["yellow", "green", "white", "pink"];
    for (let i = 0; i < 4; i++) {

        let validPosition = false;

        while (!validPosition) {

            let x = random(180, width - 80);
            let y = random(60, height - 60);

            validPosition = true;

            // Check distance from every existing car
            for (let car of cars) {

                let dx = x - car.body.position.x;
                let dy = y - car.body.position.y;

                let distance = sqrt(dx * dx + dy * dy);

                if (distance < 80) {
                    validPosition = false;
                    break;
                }

            }

            if (validPosition) {

                let opponent = new car( x,y,50,30, colours[i],0.0025,8,3,0.04,"opponent" );

                // Random heading
                Body.setAngle(opponent.body, random(TWO_PI));

                cars.push(opponent);

            }
        }
    }
}


function startAdvancedMode() {

    resetGame();
    spawnPlayer(50, 350);

    gameMode = "advanced";

    let colours = ["yellow", "green", "white", "pink"];
    for (let i = 0; i < 4; i++) {

        let validPosition = false;

        while (!validPosition) {

            let x = random(180, width - 80);
            let y = random(60, height - 60);

            validPosition = true;

            // Check distance from every existing car
            for (let car of cars) {

                let dx = x - car.body.position.x;
                let dy = y - car.body.position.y;

                let distance = sqrt(dx * dx + dy * dy);

                if (distance < 80) {
                    validPosition = false;
                    break;
                }

            }

            if (validPosition) {

                let opponent = new car( x,y,50,30, colours[i],0.0025,8,3,0.04,"opponent" );

                // Random heading
                Body.setAngle(opponent.body, random(TWO_PI));

                cars.push(opponent);

            }
        }
    }

}




function spawnPlayer(x, y) {

    player = new car(x, y, 50, 30, 'red', 0.0025, 8, 3, 0.04, "player");
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

    if (gameMode === "practice") {

        return;

    }

    for (let car of cars) {

        if (car.type != "opponent") {
            continue;

        }

        if (gameMode === "random") {

            car.moveRight();

        }

        else if (gameMode === "advanced") {

            car.advancedMovement();

        }
    }
}

function collisionSystem(event) {

    for (let pair of event.pairs) {

        let objectA = pair.bodyA.gameObject;
        let objectB = pair.bodyB.gameObject;

        if (!objectA || !objectB) {
            continue;
        }

        //if opponent hits wall 
        if (objectA.type === "opponent" && objectB.type === "wall") {
            objectA.turnAround();

        }
        else if (objectA.type === "wall" && objectB.type === "opponent") {
            objectB.turnAround();
        }

        //if opponent hits another car
        else if  (objectA.type === "opponent" && (objectB.type === "player" || objectB.type === "opponent")) {
            objectA.turnRandom90();
            objectB.turnRandom90();
        }

        else if (objectA.type === "opponent" && objectB.type === "opponent") {
            objectA.turnRandom90();
            objectB.turnRandom90();
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
        this.body.gameObject = this;

        this.waveOFFset = random(TWO_PI);
        this.waveSpeed = random(0.03, 0.06);
        this.waveAmount = 0.2;

        
        

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
    
    advancedMovement() {

        this.moveRight();

        let turn = sin(frameCount * this.waveSpeed + this.waveOFFset);

        Body.setAngle(this.body, this.body.angle + turn * this.waveAmount);

    }

    
}

class wall {
    constructor(x, y, w, h, color) {
  
        this.width = w;
        this.height = h;
        this.color = color;
        this.type = "wall";

        this.body = Bodies.rectangle(x, y, w, h, {isStatic: true, restitution:1});

        this.body.gameObject = this;
        
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

