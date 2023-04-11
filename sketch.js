let circles = []; //array of nodes
let edges = []; // array of edges
let tempEdges = [];
let nodesButton = false;
let nodesEdge = false;
let centralized = false; 
let decentralized = false;
let labelChar = '@';
let weightInput;
let inputDelay = 1000;


(function() {
  let oldLog = console.log;
  console.log = function(message) {
    oldLog.apply(console, arguments);
    let consoleContents = document.getElementById('console-contents');
    consoleContents.innerHTML += message + '<br>';
  };
})();

//Djikstra's Initializations
let Nprime = [];
let destinationNode = new Node;
let halt = false;
//setup function only runs once at the start
function setup() {
  //create the area we will be working in 
  // createCanvas(windowWidth, windowHeight);
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  //Buttons
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
  start_dec.mousePressed(startDec);


  //Input Box
  weightInput = createInput('');
  weightInput.position(120, 0);
  weightInput.size(50, 20);
  weightInput.attribute('placeholder', 'Weight');
  weightInput.hide();
}

//continuously loops and draws to canvas
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

//Handling Button Event Booleans
function startCent(){
  nodesButton = false; 
  nodesEdge = false;
  centralized = true; // disables all other buttons
}

function startDec() {
  nodesButton = false;
  nodesEdge = false;
  decentralized = true; // disables all other buttons
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

function djikstra(startNode, destNode){
  //initialization
  Nprime.push(startNode) // adding source node to Nprime
  console.log("Our start node is: " + startNode.label);
  //check all edges adjacent to source node
  console.log("Initialize the D(a) and p(a) for adjacent nodes: ");
  for (var i = 0; i < edges.length; i++){
    if(edges[i].contains(Nprime[0])){ 
      // print(edges[i]); //debug
      //color these edges red
      edges[i].rgb = [255,0,0];
      //initialize the D(a) and p(a) for adjacent nodes
      edges[i].otherNode(Nprime[0]).dOfA = edges[i].weight;
      edges[i].otherNode(Nprime[0]).pOfA = Nprime[0].label;
      console.log(edges[i].otherNode(Nprime[0]).label +  ": D(a): " +   edges[i].otherNode(Nprime[0]).dOfA +  " p(a):" +  edges[i].otherNode(Nprime[0]).pOfA);
    }
  }

  while(Nprime.length != circles.length){
    // find a not in N' st D(a) is minimum
    let min = circles[0]
    for (var i = 0; i < circles.length; i++){
      if(Nprime.includes(circles[i]) == false && circles[i].dOfA < min.dOfA){
        min = circles[i];
      }
    }
    console.log("Find edge with lowest D(a): " + min.label);
    Nprime.push(min);
    // print("min", min) //debug

    //change color for selected node
    for (var i = 0; i < edges.length; i++){
      if(edges[i].contains(min) && edges[i].containsLabel(min.pOfA)){
        //create a 5 second delay and change color of minimum edge to green
        let x = i; 
        setTimeout(function() {
          //  print(x, edges)
          edges[x].rgb = [0,255,0];
        }, inputDelay);
        inputDelay = inputDelay + 1000;
      }
    }

    //check all edges adjacent to B node that are not in N'
    for (var i = 0; i < edges.length; i++){
      if(edges[i].contains(min) && Nprime.includes(edges[i].otherNode(min)) == false){
        // print("adjacent", edges[i]);
        console.log();
        //color these edges red
        edges[i].rgb = [255,0,0];

        //update the D(a) and p(a) for adjacent nodes
        adjNode = edges[i].otherNode(min);

        if(edges[i].weight < adjNode.dOfA){ //updates D(a) if new edge has lower cost
          adjNode.dOfA = edges[i].weight;
          adjNode.pOfA = min.label;
        }
      }
    }
  }
}


function distanceVector(startNode, destNode) {
  let distanceVectors = new Map();
  let updated = true;

  for (let node of circles) {
    let nodeDistances = new Map();
    for (let otherNode of circles) {
      if (node === otherNode) {
        nodeDistances.set(otherNode.label, { distance: 0, nextHop: null });
      } else {
        nodeDistances.set(otherNode.label, { distance: Infinity, nextHop: null });
      }
    }
    distanceVectors.set(node.label, nodeDistances);
  }

  for (let edge of edges) {
    distanceVectors.get(edge.node1.label).set(edge.node2.label, { distance: edge.weight, nextHop: edge.node2.label });
    distanceVectors.get(edge.node2.label).set(edge.node1.label, { distance: edge.weight, nextHop: edge.node1.label });
  }

  while (updated) {
    updated = false;
    for (let node of circles) {
      for (let otherNode of circles) {
        if (node === otherNode) continue;
        let oldDist = distanceVectors.get(node.label).get(otherNode.label).distance;
        let newDist = Infinity;
        // print(distanceVectors.get(node.label).get(otherNode.label))
        let newNextHop = null;
        
        for (let middleNode of circles) {
          if (middleNode === node || middleNode === otherNode) continue;
          let distThroughMiddle = distanceVectors.get(node.label).get(middleNode.label).distance +
            distanceVectors.get(middleNode.label).get(otherNode.label).distance;
          if (distThroughMiddle < newDist) {
            newDist = distThroughMiddle;
            newNextHop = distanceVectors.get(node.label).get(middleNode.label).nextHop;
          }
          
        }
        if (newDist < oldDist) {
          updated = true;
          distanceVectors.get(node.label).set(otherNode.label, { distance: newDist, nextHop: newNextHop });
          // print(distanceVectors)
        }
      }
    }
  }
  
  for (let [nodeLabel, nodeDistances] of distanceVectors) {
    console.log("Routing table for node " + nodeLabel);
    for (let [otherLabel, { distance, nextHop }] of nodeDistances) {
      console.log("\t" + otherLabel + ": distance=" + distance + ", nextHop=" + nextHop);
    }
  }

  console.log("Distance from " + startNode.label + " to " + destNode.label + " is " +
    distanceVectors.get(startNode.label).get(destNode.label).distance);
  console.log("Next hop from " + startNode.label + " to " + destNode.label + " is " +
    distanceVectors.get(startNode.label).get(destNode.label).nextHop);
}
// this function runs everytime a mouse is pressed on canvas
function mousePressed() {
  //creating objects nodes
  if (nodesButton == true && mouseX > 50 && mouseY > 50){
      circles.push(new Node(mouseX, mouseY));
  }
  
  //creating edges
  if (nodesEdge == true && mouseX > 50 && mouseY > 50){
    for (var i = 0; i < circles.length; i++) {
      if (dist(mouseX, mouseY, circles[i].x, circles[i].y) <= 25){ //checks if click is within area of node
        tempEdges.push(circles[i]);
      }
      if(tempEdges.length == 2){ //once 2 nodes are found then creates edge object
          // print(tempEdges[0], tempEdges[1])
          weightInput.show();
          weightInput.input(function() {
            let weight = int(weightInput.value());
            weightInput.hide();
            edges.push(new Edge(tempEdges[0], tempEdges[1], weight));
            tempEdges = [];
            weightInput.value('');
          });
          
      }
    }

  }
  
  //Starting Djikstra's Algorithm
  if(centralized == true){
    //Select starting and ending node
    for (var k = 0; k < circles.length; k++) {
      if (dist(mouseX, mouseY, circles[k].x, circles[k].y) <= 25){//checks if click is within area of node
        tempEdges.push(circles[k]);
      }
      if(tempEdges.length == 2){
          // print(tempEdges[0], tempEdges[1]);
          tempEdges[0].rgb = [255,0,0];
          tempEdges[1].rgb = [0,255,0];
          djikstra(tempEdges[0], tempEdges[1]); //run the djikstra algo
          tempEdges = [];
          break;
      }
    }
  }
    //Starting Distance Vector Algorithm
  if (decentralized == true) {
    for (var k = 0; k < circles.length; k++) {
      if (dist(mouseX, mouseY, circles[k].x, circles[k].y) <= 25) { //checks if click is within area of node
        tempEdges.push(circles[k]);
      }
      if (tempEdges.length == 2) {
        print(tempEdges[0], tempEdges[1]);
        tempEdges[0].rgb = [255, 0, 0];
        tempEdges[1].rgb = [0, 255, 0];
        distanceVector(tempEdges[0], tempEdges[1]); //run the distance vector algorithm
        tempEdges = [];
        break;
      }
    }
  }
}

// Node Object
function Node(x, y) {
  this.x = x;
  this.y = y;
  this.size = 50;
  this.rgb = [255,255,255];
  this.label = labelChar;
  labelChar = String.fromCharCode(labelChar.charCodeAt(0) + 1); //incrementing char
  //Add distance vector for bellman ford

  //for Djikstra's algo
  this.dOfA = 9999;
  this.pOfA = '';

  this.ellipse = function() { //changes the default ellipse function
    noStroke();
    fill(this.rgb[0], this.rgb[1], this.rgb[2]);
    ellipse(this.x, this.y, this.size, this.size);
    fill(0);
    textSize(32);
    text(this.label, this.x-10, this.y+10);
  }
}


//Edge Object
function Edge(c1, c2, w){
  this.x1 = c1.x;
  this.y1 = c1.y;
  this.x2 = c2.x;
  this.y2 = c2.y;
  this.node1 = c1;
  this.node2 = c2;
  this.weight = w
  this.rgb = [255,255,255]

  this.line = function() { // changes the default line function
    stroke(this.rgb[0], this.rgb[1], this.rgb[2]);
    line(this.x1,this.y1,this.x2,this.y2);
    textSize(15);
    text(nf(this.weight), (this.x1 + this.x2)/2, (this.y1 + this.y2)/2)
  }

  this.contains = function(circ){
    if(circ == this.node1 || circ == this.node2){
      return true;
    }
    else{
      return false;
    }
  }

  this.containsLabel = function(str){
    if(str == this.node1.label || str == this.node2.label){
      return true;
    }
    else{
      return false;
    }
  }

  this.otherNode = function(circ){
    if(circ == this.node1){
      return this.node2;
    }
    else if(circ == this.node2){
      return this.node1;
    }
    else{return null}
  }
}
