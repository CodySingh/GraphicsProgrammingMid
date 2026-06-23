
let Engine = Matter.Engine;
let world = Matter.World;
let Bodies = Matter.Bodies;

let engine;
let world;



class car{
    constructor(x, y, width, height, speed, color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.color = color;

        this.body = Bodies.rectangle(this.x, this.y, this.width, this.height);

        world.add(world, this.body);
    }
}


function setup(){
    createCanvas(1400,700);
    stroke(0);
    strokeWeight(3);    

    engine = Engine.create();
    world = engine.world;
}


function draw(){
    background(220);
    playingArea();
    startingArea();
    drawCar();

}

function playingArea(){

    fill('white');
    rect(0,0,1400,700);

}

function startingArea(){

    fill('blue');
    rect(0,0,100,700);

    
}

function drawCar(){
    
    let car1 = new car(40, 350, 50, 30, 5, 'red');
    let car2 = new car(40, 400, 50, 30, 5, 'green');
    let car3 = new car(40, 450, 50, 30, 5, 'yellow');
    let car4 = new car(40, 500, 50, 30, 5, 'orange');

    // Draw the cars
    fill(car1.color);
    rect(car1.x, car1.y, car1.width, car1.height);

    fill(car2.color);
    rect(car2.x, car2.y, car2.width, car2.height);

    fill(car3.color);
    rect(car3.x, car3.y, car3.width, car3.height);

    fill(car4.color);
    rect(car4.x, car4.y, car4.width, car4.height);

}

