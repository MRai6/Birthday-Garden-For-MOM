let garden = [];
let particles = [];
let fallingItems = []; // New array for roses and teddys
const emojis = ["🌹", "🧸", "🌸", "💖"]; // The "Rain" sprites

const messages = [
    "You are the best mom in the whole world! 🌍",
    "I'm so lucky to have you as my mom. ❤️",
    "Your kindness inspires me every day. ✨",
    "Missing you from college, can't wait to see you! 🎓",
    "You're the glue that holds us together. 💖",
    "Happy Birthday to my favorite person! 🎂",
    "Your love is the greatest gift. 🎁",
    "Thank you for always being there for me. 🙏",
    "You deserve all the happiness in the world! 🌈",
    "I hope your day is as wonderful as you are! 🌸",
    "To the most amazing mom, happy birthday! 🎉",
    "Your strength and love are my guiding light. 🌟",
    "Wishing you a day filled with love and laughter! 😂",
    "You make the world a better place just by being in it. 🌎",
    "Thank you for being my rock and my inspiration. 🪨",
    "I love you more than words can express! 💕",
    "Happy Birthday, Ma! You are my hero! 🦸‍♀️",
    "Your love is the sunshine that brightens my life. ☀️",
    "Here's to many more years of love and happiness! 🥂",
    "You are the heart of our family, and we love you so much! ❤️",
    "Thank you for all the sacrifices you've made for me. 🙌",
    "Wishing you a birthday as wonderful as you are! 🎈",
    "You are my first friend, my best friend, and my forever friend. 👭",
    "Happy Birthday to the most amazing mom in the universe! 🌌",
    "Your love is the greatest gift I could ever receive. 🎁",
    "I hope your day is filled with all the things you love! 🍰",
    "Thank you for being the best mom ever! I love you to the moon and back! 🌙",
    "You are the reason for my happiness and success. Thank you for everything! 🌟",
    "Happy Birthday, Ma! You are my sunshine on a cloudy day! ☀️",
    "Your love is the foundation of our family, and we are so grateful for you. 🏠",
    "Wishing you a day filled with love, laughter, and all your favorite things! 🎉",
    "You are the most amazing mom in the world, and I am so lucky to have you! 🌍",
    "Thank you for being my role model and my biggest supporter. I love you so much! 💖"
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Load the garden from her browser's memory
  let savedGarden = localStorage.getItem('momGarden');
  if (savedGarden) {
    let loadedData = JSON.parse(savedGarden);
    for (let data of loadedData) {
        let f = new Flower(data.x, data.y);
        f.currentSize = data.maxSize; // Make them already grown
        garden.push(f);
    }
}
}

function draw() {
  background('#fdf5e6');
  
  // 1. Draw Static Garden Flowers
  for (let flower of garden) {
    flower.grow();
    flower.display();
  }

  // 2. Handle Falling Roses and Teddies
  for (let i = fallingItems.length - 1; i >= 0; i--) {
    fallingItems[i].update();
    fallingItems[i].display();
    if (fallingItems[i].offScreen()) {
      fallingItems.splice(i, 1);
    }
  }

  // 3. Handle Heart Explosion Particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
}

function mousePressed() {
  if (mouseY < height - 100) {
    garden.push(new Flower(mouseX, mouseY));
  }
  // Save the garden every time she adds a flower
  localStorage.setItem('momGarden', JSON.stringify(garden));
}

function triggerMagic() {
    // Show random message
    const msgDiv = document.getElementById('message-display');
    msgDiv.innerText = messages[floor(random(messages.length))];
    msgDiv.classList.remove('hidden');
    msgDiv.style.opacity = "1";

    // Create heart explosion (from the button location)
    for(let i = 0; i < 30; i++) {
        particles.push(new Heart(width/2, height - 100));
    }

    // Create falling roses and teddies (from the sky)
    for(let i = 0; i < 25; i++) {
        fallingItems.push(new FallingItem());
    }

    // Hide message after 3 seconds
    setTimeout(() => {
        msgDiv.style.opacity = "0";
        setTimeout(() => msgDiv.classList.add('hidden'), 500);
    }, 4000);
}

// --- Class Definitions ---

class Flower {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.maxSize = random(40, 80);
    this.currentSize = 0;
    this.petalCount = floor(random(6, 10));
    this.color = color(random(200, 255), random(100, 200), random(150, 220), 200);
  }
  grow() { if (this.currentSize < this.maxSize) this.currentSize += 2; }
  display() {
    push();
    translate(this.x, this.y);
    noStroke();
    fill(this.color);
    for (let i = 0; i < this.petalCount; i++) {
      ellipse(0, this.currentSize / 2, this.currentSize / 2.5, this.currentSize);
      rotate(TWO_PI / this.petalCount);
    }
    fill(255, 215, 0);
    circle(0, 0, this.currentSize / 3);
    pop();
  }
}

class Heart {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-5, 5), random(-12, -4));
    this.acc = createVector(0, 0.15);
    this.lifespan = 255;
    this.size = random(10, 25);
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.lifespan -= 3;
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    fill(255, 107, 107, this.lifespan);
    noStroke();
    beginShape();
    vertex(0, 0);
    bezierVertex(-this.size/2, -this.size/2, -this.size, this.size/3, 0, this.size);
    bezierVertex(this.size, this.size/3, this.size/2, -this.size/2, 0, 0);
    endShape(CLOSE);
    pop();
  }
  isDead() { return this.lifespan < 0; }
}

// New Class for Falling Roses and Teddies
class FallingItem {
  constructor() {
    this.x = random(width);
    this.y = random(-height, -50); // Start way above screen
    this.speed = random(2, 6);
    this.char = random(emojis);
    this.size = random(30, 60);
    this.angle = random(TWO_PI);
    this.spin = random(-0.05, 0.05);
  }
  update() {
    this.y += this.speed;
    this.angle += this.spin;
  }
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    textSize(this.size);
    textAlign(CENTER, CENTER);
    text(this.char, 0, 0);
    pop();
  }
  offScreen() { return this.y > height + 100; }
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }