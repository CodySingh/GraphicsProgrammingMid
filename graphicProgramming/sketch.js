

//import Matter.js Library
let Engine = Matter.Engine;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Body = Matter.Body;

//Global variables 
let engine;
let world;

let player;
let wallThickness = 5;

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

    createWalls();
    


    //draw the player car 
    //standard car specs: engineForce: 0.0025, maxForwardSpeed: 8, maxReverseSpeed: 3, turningSpeed: 0.04
    //slow car specs: engineForce: 0.0015, maxForwardSpeed: 4, maxReverseSpeed: 2, turningSpeed:0.03
    player = new car(40, 350, 50, 30, 'red', 0.025, 8, 3, 0.04);
    cars.push(player);
}


function draw(){

    background(220);

    handleInput();

    Engine.update(engine);

    playingArea();
    startingArea();

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



function handleInput() {

    let player = cars[0];

    if (keyIsDown(RIGHT_ARROW)) {
        player.moveRight();
    }
    if (keyIsDown(LEFT_ARROW)) {
        player.moveLeft();
    }
    if (keyIsDown(UP_ARROW)) {
        player.turnLeft();
    }
    if (keyIsDown(DOWN_ARROW)) {
        player.turnRight();
    }

}

function createWalls() {

    walls.push(new wall(width/2, wallThickness/2, width, wallThickness, 'black')); //top wall
    walls.push(new wall(width/2, height - wallThickness/2, width, wallThickness, 'black')); //bottom wall
    walls.push(new wall(wallThickness/2, height/2, wallThickness, height, 'black'));//left wall
    walls.push(new wall(width - wallThickness/2, height/2, wallThickness, height, 'black'));//right wall
}

// CLASSES 
class car{
    constructor(x, y, w, h, color, engineForce, maxForwardSpeed, maxReverseSpeed, turnSpeed){

        
        //car properties
        this.width = w;
        this.height = h;
        this.color = color;

        
        //car movement properties 
        this.maxForwardSpeed = 8;
        this.maxReverseSpeed = 3;

        this.engineForce = 0.0025;
        this.turnSpeed = 0.04;

        this.body = Bodies.rectangle(x, y, w, h, {restitution: 0.5, friction:0.5});

        World.add(world, this.body);

    }
    
    draw() {

        push();

        translate( this.body.position.x, this.body.position.y);
        rotate(this.body.angle);

        rectMode(CENTER);
        fill(this.color);
        rect(0, 0, this.width, this.height);
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

    
}

class wall {
    constructor(x, y, w, h, color) {
  
        this.width = w;
        this.height = h;
        this.color = color;
        this.body = Bodies.rectangle(x, y, w, h, {isStatic: true, restitution:1});
        
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