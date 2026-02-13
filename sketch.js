let garden = [];
let particles = [];
let fallingItems = [];
let isNight = false;
let isCinemaMode = false;

// Slideshow Variables
let photos = [];
let currentPhotoIndex = 0;
let showSlideshow = false;

const emojis = ["🌹", "🧸", "🌸", "💖", "✨", "🎈", "🫰"];
const messages = [
    "You are the best mom in the whole world! 🌍",
    "I'm so lucky to have you as my mom. ❤️",
    "Missing you from college, can't wait to see you! 🎓",
    "Happy Birthday, Ma! You are my hero! 🦸‍♀️",
    "You are the heart of our family! ❤️",
    "Thank you for always being there for me! 🙏",
    "Wishing you a day as wonderful as you are! 🎉",
    "Love you to the moon and back, Ma! 🌙",
    "You deserve all the happiness in the world! 🌈",
    "Thank you for your endless love and support! 💕",
    "You make our lives so much brighter! ☀️",
    "To the most amazing mom, happy birthday! 🎂",
    "Your love is the greatest gift of all! 🎁",
    "You are my first friend, my best friend, and my forever friend. 👭",
    "Thank you for being my rock and my inspiration! 🪨",
    "You are the glue that holds our family together! 🧩",
    "Wishing you a day filled with love and laughter! 😂",
    "You are the sunshine in my life! 🌞",
    "Thank you for all the sacrifices you've made for me! 🙌",
    "You are my role model and my biggest supporter! 🌟",
    "Happy Birthday to the most loving and caring mom! 🎈",
    "You are my angel on earth! 😇",
    "Thank you for your unconditional love! 💖",
    "You are the reason for my happiness! 😊",
    "Wishing you a day as special as you are! 🎉"];

function preload() {
    for (let i = 1; i <= 21; i++) {
        photos.push(loadImage(i + '.jpeg'));
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    localStorage.clear(); 
}

function draw() {
    if (isNight) {
        background(26, 26, 46);
    } else {
        background('#fdf5e6');
    }

    // 1. Draw Slideshow
    if (showSlideshow && photos.length > 0) {
        displaySlideshow();
        displayFloatingText();
        
        // Auto-generate falling flowers during slideshow
        if (frameCount % 30 == 0) {
            let item = new FallingItem();
            item.speed = random(1, 2); 
            fallingItems.push(item);
        }
    }

    // 2. Draw Static Garden Flowers
    for (let flower of garden) {
        flower.grow();
        flower.display();
    }

    // 3. Handle Falling Items
    for (let i = fallingItems.length - 1; i >= 0; i--) {
        fallingItems[i].update();
        fallingItems[i].display();
        if (fallingItems[i].offScreen()) fallingItems.splice(i, 1);
    }

    // 4. Handle Heart Particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].display();
        if (particles[i].isDead()) particles.splice(i, 1);
    }
}

function displaySlideshow() {
    let img = photos[currentPhotoIndex];
    if (!img) return;

    let ratio = min(width / img.width, height / img.height) * 0.7;
    let w = img.width * ratio;
    let h = img.height * ratio;

    push();
    imageMode(CENTER);
    noStroke();
    fill(255, 255, 255, 150);
    rect(width/2 - w/2 - 10, height/2 - h/2 - 10, w + 20, h + 20, 15);
    image(img, width/2, height/2, w, h);
    
    // UI Hint for Mom
    textAlign(CENTER);
    textSize(16);
    noStroke();
    fill(255, 180);
    text("(Tap anywhere to see the next memory)", width/2, height/2 + h/2 + 40);
    pop();
}

function displayFloatingText() {
    push();
    textAlign(CENTER, CENTER);
    textSize(width < 600 ? 20 : 32); 
    fill(255);
    stroke(0, 150);
    strokeWeight(4);
    text("You made it all happen.\nWe all Love you very much", width/2, 80);
    pop();
}

function toggleCinemaMode() {
    isCinemaMode = !isCinemaMode;
    showSlideshow = isCinemaMode;
    currentPhotoIndex = 0; // Reset to start
    document.body.classList.toggle('cinema-filter');
    
    let ui = document.getElementById('ui-overlay');
    if (showSlideshow) {
        ui.style.display = 'none';
    } else {
        ui.style.display = 'block';
    }
}

function toggleNightMode() {
    isNight = !isNight;
    document.body.classList.toggle('night');
}

function clearGarden() {
    garden = [];
    fallingItems = [];
    particles = [];
}

function triggerMagic() {
    const msgDiv = document.getElementById('message-display');
    msgDiv.innerText = messages[floor(random(messages.length))];
    msgDiv.classList.remove('hidden');
    msgDiv.style.opacity = "1";

    for(let i = 0; i < 30; i++) particles.push(new Heart(width/2, height - 100));
    for(let i = 0; i < 15; i++) fallingItems.push(new FallingItem());

    setTimeout(() => {
        msgDiv.style.opacity = "0";
        setTimeout(() => msgDiv.classList.add('hidden'), 500);
    }, 3000);
}

function mousePressed() {
    // If in Picture mode, tap to change photo
    if (showSlideshow) {
        currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    } 
    // Otherwise, plant a flower if above the button area
    else if (mouseY < height - 100) {
        garden.push(new Flower(mouseX, mouseY));
    }
}

// --- CLASSES ---

class Flower {
    constructor(x, y) {
        this.x = x; this.y = y;
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
            ellipse(0, this.currentSize/2, this.currentSize/2.5, this.currentSize);
            rotate(TWO_PI/this.petalCount);
        }
        fill(255, 215, 0);
        circle(0, 0, this.currentSize/3);
        pop();
    }
}

class Heart {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(random(-5, 5), random(-12, -4));
        this.acc = createVector(0, 0.15);
        this.lifespan = 255;
        this.size = random(10, 20);
    }
    update() { this.vel.add(this.acc); this.pos.add(this.vel); this.lifespan -= 4; }
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

class FallingItem {
    constructor() {
        this.x = random(width);
        this.y = random(-height, -50);
        this.speed = random(2, 5);
        this.char = random(emojis);
        this.size = random(30, 50);
        this.angle = random(TWO_PI);
        this.spin = random(-0.05, 0.05);
    }
    update() { this.y += this.speed; this.angle += this.spin; }
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