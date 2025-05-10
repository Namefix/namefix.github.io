const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randf = (min, max) => Math.random() * (max - min + 1) + min;
function randomSpawnPosition() {
    const side = rand(0, 3);
    let pos = {x: 0, y: 0};
    if (side === 0) {
        pos.x = rand(0, window.innerWidth);
        pos.y = -32;
    } else if (side === 1) {
        pos.x = window.innerWidth + 32;
        pos.y = rand(0, window.innerHeight);
    } else if (side === 2) {
        pos.x = rand(0, window.innerWidth);
        pos.y = window.innerHeight + 32;
    } else {
        pos.x = -32;
        pos.y = rand(0, window.innerHeight);
    }
    return pos;
}

const canvasObject = document.querySelector("#game");
const logoText = document.querySelector(".logo-text");
const ctx = canvasObject.getContext("2d");
let keys = new Map();
let gameLastTimestamp = 0;
let difficultyIncreaseTimestamp = 0;
let difficulty = 0;

let gameTime = 0;
let gameLost = false;

let bullets = [];
let lastBulletSpawn = 0;

class Entity {
    constructor() {
        this.pos = {x:window.innerWidth/2,y:window.innerHeight/2};
        this.velocity = {x:0,y:0};
        this.acceleration = 720;
        this.maxSpeed = 300;
        this.size = 16;
        this.color = "white";
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    tick(delta) {
        this.velocity.x = clamp(this.velocity.x, -this.maxSpeed, this.maxSpeed);
        this.velocity.y = clamp(this.velocity.y, -this.maxSpeed, this.maxSpeed);

        this.pos.x += this.velocity.x * delta;
        this.pos.y += this.velocity.y * delta;

        const frictionFactor = Math.pow(0.97, delta * 60);
        this.velocity.x *= frictionFactor;
        this.velocity.y *= frictionFactor;
    }
}

class Player extends Entity {
    tick(delta) {
        if(keys.has("KeyW")) this.velocity.y -= this.acceleration * delta;
        if(keys.has("KeyA")) this.velocity.x -= this.acceleration * delta;
        if(keys.has("KeyS")) this.velocity.y += this.acceleration * delta;
        if(keys.has("KeyD")) this.velocity.x += this.acceleration * delta;

        if(
            this.pos.x > window.innerWidth + 32 || this.pos.x <= -32 ||
            this.pos.y > window.innerHeight + 32 || this.pos.y <= -32
        )
        gameOver();

        super.tick(delta);
    }
}

class Rocket extends Entity {
    constructor(pos) {
        super();
        this.pos = pos;
        this.color = "red";
        this.size = rand(6+difficulty,10+difficulty);

        this.angle = Math.atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x);
        this.turnRate = randf(Math.PI/2, Math.PI*1.5);
        this.speed = rand(180+(difficulty*5), 220+(difficulty*5));
        this.followTicks = rand(7+difficulty,12+difficulty);
        this.markedForDeletion = false;
    }
    tick(delta) {
        if(this.followTicks > 0) {
            const wantedAngle = Math.atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x);
            let angleDiff = wantedAngle - this.angle;
            while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
            while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        
            const maxTurn = this.turnRate * delta;
            if (angleDiff > maxTurn) {
                angleDiff = maxTurn;
            } else if (angleDiff < -maxTurn) {
                angleDiff = -maxTurn;
            }
            this.angle += angleDiff;

            this.followTicks -= delta;
        }

        this.velocity.x = Math.cos(this.angle) * this.speed;
        this.velocity.y = Math.sin(this.angle) * this.speed;
    
        if(
            this.pos.x > window.innerWidth + 128 || this.pos.x <= -128 ||
            this.pos.y > window.innerHeight + 128 || this.pos.y <= -128
        ) {
            this.markedForDeletion = true;
            return;
        }

        super.tick(delta);
    }
}

function checkCollisions() {
    for (let i = 0; i < bullets.length; i++) {
        for (let j = i + 1; j < bullets.length; j++) {
            const dx = bullets[i].pos.x - bullets[j].pos.x;
            const dy = bullets[i].pos.y - bullets[j].pos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < bullets[i].size + bullets[j].size) {
                bullets[i].markedForDeletion = true;
                bullets[j].markedForDeletion = true;
            }
        }
    }

    for (let bullet of bullets) {
        const dx = bullet.pos.x - player.pos.x;
        const dy = bullet.pos.y - player.pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < bullet.size + player.size) {
            gameOver();
            break;
        }
    }
}

let player = new Player();
bullets.push(new Rocket(randomSpawnPosition()));

function startGame() {
    document.body.style.overflow = "hidden";
    logoText.textContent = "0";
    if(gameLost) {
        gameTime = 0;
        player = new Player();
        bullets = [];
        lastBulletSpawn = 0;
        difficulty = 0;
        difficultyIncreaseTimestamp = 0;
        bullets.push(new Rocket(randomSpawnPosition()));
        gameLost = false;
    }

    requestAnimationFrame(tick);
}

function endGame() {
    document.body.style.overflow = "auto";
    logoText.textContent = "Namefix - " + logoText.textContent;
}

function gameOver() {
    gameLost = true;
    const seconds = Math.floor(gameTime);
    const ms = Math.floor((gameTime - seconds) * 10);
    logoText.textContent = `${seconds}:${ms} GAME OVER`;
    toggleMinigameStatus();
}

function tick(timestamp) {
    if (!gameLastTimestamp) gameLastTimestamp = timestamp;
    const delta = (timestamp - gameLastTimestamp) / 1000;
    gameLastTimestamp = timestamp;
    
    canvasObject.width = window.innerWidth;
    canvasObject.height = window.innerHeight;

    ctx.save();
    
    if (minigameStatus) { 
        player.tick(delta);
        player.draw();

        checkCollisions();
        bullets = bullets.filter(bullet => !bullet.markedForDeletion);
        bullets.forEach(bullet => {
            bullet.tick(delta);
            bullet.draw();
        })

        gameTime += delta;  

        if (gameTime - difficultyIncreaseTimestamp >= 15) {
            difficulty++;
            difficultyIncreaseTimestamp = gameTime;
        }

        if (gameTime - lastBulletSpawn >= 7 - (difficulty/10)) {
            bullets.push(new Rocket(randomSpawnPosition()));
            lastBulletSpawn = gameTime;
        }

        const seconds = Math.floor(gameTime);
        const ms = Math.floor((gameTime - seconds) * 10);
        if(!gameLost) logoText.textContent = `${seconds}:${ms}`;
    }
    
    ctx.restore();
    requestAnimationFrame(tick);
}

document.addEventListener("keydown", (e) => {
    keys.set(e.code, true);
});
document.addEventListener("keyup", (e) => {
    keys.delete(e.code);
})