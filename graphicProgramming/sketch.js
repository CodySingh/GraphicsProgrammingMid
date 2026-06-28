

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
    player = new car(40, 350, 50, 30, 'red');
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

    let speed = 5;

    if (keyIsDown(UP_ARROW)) {
        player.move(0, -speed);
    }
    if (keyIsDown(DOWN_ARROW)) {
        player.move(0, speed);
    }
    if (keyIsDown(LEFT_ARROW)) {
        player.move(-speed, 0);
    }
    if (keyIsDown(RIGHT_ARROW)) {
        player.move(speed, 0);
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
    constructor(x, y, w, h, color){

        this.body = Bodies.rectangle(x, y, w, h, color);

        this.width = w;
        this.height = h;
        this.color = color;

        this.body = Bodies.rectangle(x, y, w, h, {restitution: 0.5, friction:0.5});

        World.add(world, this.body);

    }
    
    draw() {

        push();
        fill('red');
        rectMode(CENTER);
        rect(this.body.position.x, this.body.position.y, this.width, this.height);
        rotate(this.body.angle);
        pop();

    }

    move(dx, dy) {

        Body.setPosition(this.body, {
            x: this.body.position.x + dx,
            y: this.body.position.y + dy
        });

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