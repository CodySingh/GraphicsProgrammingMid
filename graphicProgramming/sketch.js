

function setup(){
    createCanvas(1400,700);
    stroke(0);
    strokeWeight(3);    
}


function draw(){
    background(220);
    playingArea();
    startingArea();
    

}

function playingArea(){

    fill('red');
    rect(0,0,1400,700);

}

function startingArea(){

    fill('blue');
    rect(0,0,100,1400);

    
}