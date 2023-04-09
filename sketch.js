let circles = []; //array of nodes
let edges = []; // array of edges
let tempEdges = [];
let nodesButton = false;
let nodesEdge = false;
let centralized = false; 
let labelChar = '@';

//Djikstra's Initializations
let Nprime = [];
let destinationNode = new Node;

function setup() {
  
  createCanvas(windowWidth, windowHeight);
  createCircle = createButton('Nodes');
  createCircle.position(0, 0);
  createCircle.mousePressed(createNodes);
  
  createEdge = createButton("Edge");
  createEdge.position(60,0)
  createEdge.mousePressed(createEdges);
  
  start_cent = createButton("Centralized");
  start_cent.position(0,windowHeight-30);
  start_cent.mousePressed(startCent);
  
  start_dec = createButton("De-Centralized")
  start_dec.position(100, windowHeight-30);
  // start_cent.mousePressed(startCent);
}

function draw() {
  background(0);

  for (var i = 0; i < circles.length; i++) {
      circles[i].ellipse();
  }

  for (var i = 0; i < edges.length; i++) {
    edges[i].line();
  } 

  // print(circles)
  // print(edges)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function startCent(){
  nodesButton = false; 
  nodesEdge = false;
  centralized = true;
}

function createNodes(){
  if(nodesEdge == false){
    nodesButton = true;
  }
  else{
    nodesEdge = false; 
    nodesButton = true;
  }
}
function createEdges(){
  if(nodesButton == false){
    nodesEdge = true;
  }
  else{
    nodesButton = false; 
    nodesEdge = true;
  }
}

function mousePressed() {
  //creating nodes
  if (nodesButton == true && mouseX > 50 && mouseY > 50){
      circles.push(new Node(mouseX, mouseY));
  }
  
  //creating edges
  if (nodesEdge == true && mouseX > 50 && mouseY > 50){
    for (var i = 0; i < circles.length; i++) {
      if (dist(mouseX, mouseY, circles[i].x, circles[i].y) <= 25){
        tempEdges.push(circles[i])      
      }
      if(tempEdges.length == 2){
          print(tempEdges[0], tempEdges[1])
          edges.push(new Edge(tempEdges[0], tempEdges[1]))
          tempEdges = [];
      }
    }

  }
  
  //Starting Djikstra's Algorithm
  if(centralized == true){
    //Initialization
    for (var k = 0; k < circles.length; k++) {
      if (dist(mouseX, mouseY, circles[k].x, circles[k].y) <= 25){
        tempEdges.push(circles[k])      
      }
      if(tempEdges.length == 2){
          print(tempEdges[0], tempEdges[1])
          tempEdges[0].rgb = [255,0,0];
          tempEdges[1].rgb = [0,255,0];
          Nprime.push(tempEdges[0]) // adding source node to Nprime
          destinationNode = tempEdges[1]
          tempEdges = []
      }
      for (var i = 0; i < edges.length; i++){
        if(edges[i].contains(Nprime[0])){ //check all edges adjacent to source node
          print(edges[i]);
        }
      }

    }
  }
}

function Node(x, y) {
  this.x = x;
  this.y = y;
  this.size = 50;
  this.rgb = [255,255,255];
  this.label = labelChar;
  labelChar = String.fromCharCode(labelChar.charCodeAt(0) + 1); //incrementing char
  //Add distance vector for bellman ford

  this.ellipse = function() {
    noStroke();
    fill(this.rgb[0], this.rgb[1], this.rgb[2]);
    ellipse(this.x, this.y, this.size, this.size);
    fill(0);
    textSize(32);
    text(this.label, this.x-10, this.y+10);
  }
}


function Edge(c1, c2){
  this.x1 = c1.x;
  this.y1 = c1.y;
  this.x2 = c2.x;
  this.y2 = c2.y;
  this.n1 = c1;
  this.n2 = c2;
  this.weight = int(random(20))
  this.rgb = [255,255,255]

  this.line = function() {
    stroke(255);
    fill(this.rgb[0], this.rgb[1], this.rgb[2]);
    line(this.x1,this.y1,this.x2,this.y2);
    textSize(15);
    text(nf(this.weight), (this.x1 + this.x2)/2, (this.y1 + this.y2)/2)
  }

  this.contains = function(c){
    if(c == this.n1 || c == this.n2){
      return true;
    }
    else{
      return false;
    }
  }
}