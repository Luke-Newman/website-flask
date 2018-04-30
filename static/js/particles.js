/**
 * Created by Luke on 14/11/2016.
 */

// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

var canvas = document.getElementById("canvas");

// Initialize the context of the canvas
var ctx = canvas.getContext("2d");

// Set the canvas width and height to occupy full window
var W = $(window).width(), H = $(window).height(); // W = window.innerWidth, H = window.innerHeight;
canvas.width = W;
canvas.height = H;

// Some variables for later use
var particleCount = Math.floor((W+H)/9), /** TODO Adjust to suite mobile was 10**/
particles = [],
minDist = 75,
dist;

// Initialise canvas and add event listener to resize
function initialise() {
    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();
}

// particles have boundaries of new canvas size, should use RAF to smooth frames
function resizeCanvas() {
    W = $(window).width(); // window.innerWidth
    H = $(window).height(); // window.innerHeight
    canvas.width = W;
    canvas.height = H;
    draw();
}

initialise();

// Function to paint the canvas black
function paintCanvas() {
    ctx.fillStyle = "rgba(0,0,0,1)";

    ctx.fillRect(0,0,W,H);
}

function Particle() {
    // Position them randomly on the canvas
    this.x = Math.random() * W;
    this.y = Math.random() * H;


    // We would also need some velocity for the particles
    // so that they can move freely across the space
    this.vx = -1 + Math.random() * 2;
    this.vy = -1 + Math.random() * 2;

    this.radius = 4;

    this.draw = function() {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

        // Fill the color to the arc that we just created
        ctx.fill();
    }
}

// Time to push the particles into an array
for(var i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Function to draw everything on the canvas that we'll use when
// animating the whole scene.
function draw() {

    paintCanvas();

    // Call the function that will draw the balls using a loop
    for (var i = 0; i < particles.length; i++) {
        p = particles[i];
        p.draw();
    }

    update();
}

function update() {

    // In this function, we are first going to update every
    // particle's position according to their velocities
    var p, p2;
    for (var i = 0; i < particles.length; i++) {
        p = particles[i];

        // Change the velocities
        p.x += p.vx;
        p.y += p.vy;

        // We don't want to make the particles leave the
        // area, so just change their position when they
        // touch the walls of the window
        if (p.x + p.radius > W)
            p.x = p.radius;

        else if (p.x - p.radius < 0) {
            p.x = W - p.radius;
        }

        if (p.y + p.radius > H)
            p.y = p.radius;

        else if (p.y - p.radius < 0) {
            p.y = H - p.radius;
        }

        // Now we need to make them attract each other
        // so first, we'll check the distance between
        // them and compare it to the minDist we have
        // already set

        // We will need another loop so that each
        // particle can be compared to every other particle
        // except itself
        for (var j = i + 1; j < particles.length; j++) {
            p2 = particles[j];
            distance(p, p2);
        }

    }
}

// Distance calculator between two particles
function distance(p1, p2) {
    var dist,
        dx = p1.x - p2.x,
        dy = p1.y - p2.y;

    dist = Math.sqrt(dx*dx + dy*dy);

    // Draw the line when distance is smaller
    // then the minimum distance
    if(dist <= minDist) {

        // Draw the line
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255,255,255,"+ (1.2-dist/minDist) +")";
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.closePath();

        // Some acceleration for the particles
        // depending upon their distance
        var ax = dx/10000,
            ay = dy/10000;

        // Apply the acceleration on the particles
        p1.vx -= ax;
        p1.vy -= ay;

        p2.vx += ax;
        p2.vy += ay;
    }
}

// Start the main animation loop using requestAnimFrame
function animloop() {
    draw();
    requestAnimFrame(animloop);
}

animloop();