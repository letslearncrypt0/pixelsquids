const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let selectedCharacter = null;

function selectCharacter(character) {
    selectedCharacter = character;
    document.getElementById("characterSelection").style.display = "none";
    document.getElementById("gameCanvas").style.display = "block";
    initializeGame();
}

function initializeGame() {
    const player = {
        x: 50,
        y: canvas.height - 50,
        width: 60,
        height: 60,
        speed: 5,
        money: 0,
        lives: 3,
        shieldActive: false,
        shieldRemaining: 1,
        image: new Image(),
    };

    player.image.src = `images/${selectedCharacter}.png`;

    const coins = [];
    const obstacles = [];
    const powerups = [];

    let isGameOver = false;
    let isPaused = false;

    function spawnCoins() {
        const coin = {
            x: Math.random() * (canvas.width - 20),
            y: 0,
            width: 15,
            height: 15,
            speed: Math.random() * 2 + 2,
        };
        coins.push(coin);
    }

    function spawnObstacles() {
        const obstacle = {
            x: Math.random() * (canvas.width - 30),
            y: 0,
            width: 30,
            height: 30,
            speed: Math.random() * 2 + 1,
        };
        
        // Check if the player has an active shield
        if (player.shieldActive) {
            player.shieldActive = false; // Consume the shield
        } else {
            obstacles.push(obstacle);
        }
    }
    
    function spawnShieldPowerup() {
        const shieldPowerup = {
            x: Math.random() * (canvas.width - 30),
            y: 0,
            width: 30,
            height: 30,
            speed: Math.random() * 2 + 1,
        };
        powerups.push(shieldPowerup);
    }
    

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(player.image, player.x, player.y, player.width, player.height);

        ctx.fillStyle = "#ff0";
        coins.forEach((coin) => {
            ctx.fillRect(coin.x, coin.y, coin.width, coin.height);
        });

        ctx.fillStyle = "#f00";
        obstacles.forEach((obstacle) => {
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });

        ctx.fillStyle = "#0f0"; // Green color for the shield powerup
        powerups.forEach((powerup) => {
            ctx.fillRect(powerup.x, powerup.y, powerup.width, powerup.height);
        });

        ctx.fillStyle = "#fff";
        ctx.font = "12px 'Press Start 2P'";
        ctx.fillText(`Money: $${player.money}`, 10, 20);
        ctx.fillText(`Lives: ${player.lives}`, canvas.width - 80, 20);

        if (isGameOver) {
            ctx.fillStyle = "#fff";
            ctx.fillText("Game Over! Press 'Space' to restart.", canvas.width / 2 - 120, canvas.height / 2);
            return;
        }

        if (isPaused) {
            ctx.fillStyle = "#fff";
            ctx.fillText("Game Paused. Press 'P' to resume.", canvas.width / 2 - 100, canvas.height / 2);
            return;
        }
    }

    function update() {
        if (isPaused) return;

        if (keys.ArrowUp && player.y > 0) {
            player.y -= player.speed;
        }
        if (keys.ArrowDown && player.y + player.height < canvas.height) {
            player.y += player.speed;
        }
        if (keys.ArrowLeft && player.x > 0) {
            player.x -= player.speed;
        }
        if (keys.ArrowRight && player.x + player.width < canvas.width) {
            player.x += player.speed;
        }

        if (Math.random() < 0.02) {
            spawnCoins();
        }

        if (Math.random() < 0.01) {
            spawnObstacles();
        }

        if (Math.random() < 0.005) {
            spawnShieldPowerup();
        }

        coins.forEach((coin) => {
            coin.y += coin.speed;

            if (
                player.x < coin.x + coin.width &&
                player.x + player.width > coin.x &&
                player.y < coin.y + coin.height &&
                player.y + player.height > coin.y
            ) {
                player.money += 10;

                if (player.money % 10000 === 0) {
                    player.lives += 1;
                }

                coins.splice(coins.indexOf(coin), 1);
            }

            if (coin.y > canvas.height) {
                coins.splice(coins.indexOf(coin), 1);
            }
        });

        obstacles.forEach((obstacle) => {
            obstacle.y += obstacle.speed;

            if (
                player.x < obstacle.x + obstacle.width &&
                player.x + player.width > obstacle.x &&
                player.y < obstacle.y + obstacle.height &&
                player.y + player.height > obstacle.y
            ) {
                if (!player.shieldActive) {
                    player.lives -= 1;

                    if (player.lives > 0) {
                        restartGame();
                    } else {
                        isGameOver = true;
                        return;
                    }
                }

                obstacles.splice(obstacles.indexOf(obstacle), 1);
            }

            if (obstacle.y > canvas.height) {
                obstacles.splice(obstacles.indexOf(obstacle), 1);
            }
        });

        powerups.forEach((powerup) => {
            powerup.y += powerup.speed;

            if (
                player.x < powerup.x + powerup.width &&
                player.x + player.width > powerup.x &&
                player.y < powerup.y + powerup.height &&
                player.y + player.height > powerup.y
            ) {
                player.shieldActive = true;
                powerups.splice(powerups.indexOf(powerup), 1);
            }

            if (powerup.y > canvas.height) {
                powerups.splice(powerups.indexOf(powerup), 1);
            }
        });
    }

    function gameLoop() {
        draw();
        update();
        requestAnimationFrame(gameLoop);
    }

    const keys = {};
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    function handleKeyDown(e) {
        keys[e.key] = true;

        if (isGameOver) {
            if (e.key === ' ' || e.key === 'Space') {
                restartGame();
            }
        } else if (isPaused && (e.key === 'P' || e.key === 'p')) {
            isPaused = false;
        } else if (!isPaused && (e.key === 'P' || e.key === 'p')) {
            isPaused = true;
        } else if (isGameOver && (e.key === 'E' || e.key === 'e')) {
            returnToCharacterSelection();
        }
    }

    function handleKeyUp(e) {
        keys[e.key] = false;
    }

    function restartGame() {
        isGameOver = false;
        isPaused = false;
        player.shieldActive = false;
        player.shieldRemaining = 1;
        coins.length = 0;
        obstacles.length = 0;
        powerups.length = 0;
        player.x = 50;
        player.y = canvas.height - 50;
    }

    function returnToCharacterSelection() {
        isGameOver = false;
        isPaused = false;
        coins.length = 0;
        obstacles.length = 0;
        powerups.length = 0;
        document.getElementById("characterSelection").style.display = "block";
        document.getElementById("gameCanvas").style.display = "none";
    }

    gameLoop();
}
