let spacing;
let cols, rows;
let points = [];
let ripples = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  spacing = 25; // Set the spacing between points
  cols = width / spacing; // Calculate the number of columns
  rows = height / spacing; // Calculate the number of rows
  initializePoints();

  // Set an interval for creating new ripples randomly
  setInterval(createRandomRipple, 200); // Adjust the 1000ms (1 second) interval as needed
}

function createRandomRipple() {
  // Create a ripple at a random position
  let randomX = random(width);
  let randomY = random(height);
  ripples.push({ center: { x: randomX, y: randomY }, startTime: millis() });
}


function draw() {
  background(255); // Set background color to black

  noStroke(); // Remove the outline of the points
  fill(0); // Set the fill color for the points to white

  for (let point of points) {
    let totalDisplacementX = 0;
    let totalDisplacementY = 0;
    let influencedByRipple = false;

    for (let ripple of ripples) {
      let rippleAge = millis() - ripple.startTime;
      let rippleRadius = rippleAge * 0.2;
      let distance = dist(ripple.center.x, ripple.center.y, point.originalX, point.originalY);

      if (distance < rippleRadius && distance > rippleRadius - 50) {
        let angle = atan2(point.originalY - ripple.center.y, point.originalX - ripple.center.x);
        // Gradually reduce ripple strength as it moves outwards
        let rippleStrength = map(distance, rippleRadius - 30, rippleRadius, 10, 0);
        totalDisplacementX += cos(angle) * rippleStrength;
        totalDisplacementY += sin(angle) * rippleStrength;
        influencedByRipple = true;
      }
    }

    if (influencedByRipple) {
      point.x = lerp(point.x, point.originalX + totalDisplacementX, 0.2);
      point.y = lerp(point.y, point.originalY + totalDisplacementY, 0.2);
    } else {
      // Smooth return without ripple effect
      point.x = lerp(point.x, point.originalX, 0.2);
      point.y = lerp(point.y, point.originalY, 0.2);
    }

    ellipse(point.x, point.y, 3, 3); // Draw each point
  }

  // Optional: Remove old ripples
  ripples = ripples.filter(ripple => millis() - ripple.startTime < 1500);
}


function mouseClicked() {
  ripples.push({ center: { x: mouseX, y: mouseY }, startTime: millis() });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = width / spacing;
  rows = height / spacing;
  initializePoints();
}

function initializePoints() {
  points = [];
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let posX = x * spacing;
      let posY = y * spacing;
      points.push({ x: posX, y: posY, originalX: posX, originalY: posY });
    }
  }
}
