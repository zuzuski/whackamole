// Variabelen voor het spel
let currMoleTile;
let currBombTile; 
let score = 0; // Huidige score van de speler
let gameOver = false; // Boolean om te controleren of het spel voorbij is
let moleClickable = true; // Boolean om te bepalen of de mol aangeklikt kan worden
let moleInterval;
let bombInterval; 
let backgroundMusic; 

window.onload = function() {
    showStartScreen();
};

// functie die de start screen weergeeft
function showStartScreen() {
    let startScreen = document.createElement("div");
    startScreen.id = "startScreen";
    startScreen.innerHTML = `
        <h1>Welkom bij het spel!</h1>
        <h2>Het doel is om de mollen te raken en de bommen te ontwijken!</h2>
        <button class="menu-button" onclick="startGame()">Start</button>
    `;
    document.body.appendChild(startScreen);
}

// functie die de eind screen weergeeft wanneer het spel voorbij is
function showEndScreen(message) {
    let endScreen = document.createElement("div");
    endScreen.id = "endScreen";
    endScreen.innerHTML = `
        <h1>${message}</h1>
        <button class="menu-button" onclick="restartGame()">Opnieuw spelen</button>
    `;
    document.body.appendChild(endScreen);
}

// functie om de game te starten
function startGame() {
    console.log("Start Game is aangeroepen!");
    let startsound = new Audio("./start-sound.mp3");
    startsound.play();

    let startScreen = document.getElementById("startScreen");
    if (startScreen) {
        console.log("Startscreen gevonden, verwijderen...");
        startScreen.remove();
    } else {
        console.log("Startscreen niet gevonden!");
    }

    setGame();
}

// functie om de game te restarten
function restartGame() {
    document.getElementById("endScreen").remove();
    score = 0;
    gameOver = false;
    moleClickable = true;
    document.getElementById("score").innerText = "Score: 0";
    clearInterval(moleInterval);
    clearInterval(bombInterval);
    setGame();
}

// klikgeluid afspelen
function playClickSound() {
    let clickSound = new Audio("./click-sound.mp3");
    clickSound.play();
}

// zet het speelbord klaar
function setGame() {
    let board = document.getElementById("board");
    if (!board) {
        board = document.createElement("div");
        board.id = "board";
        document.body.appendChild(board);
    } else {
        board.innerHTML = "";
    }

    let scoreDisplay = document.getElementById("score");
    if (!scoreDisplay) {
        scoreDisplay = document.createElement("div");
        scoreDisplay.id = "score";
        scoreDisplay.innerText = "Score: 0";
        document.body.appendChild(scoreDisplay);
    }
    
    // Tegels genereren voor het bord
    for (let i = 0; i < 9; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        board.appendChild(tile);
    }
    // bepaalt hoe snel de mol en bom bewegen
    moleInterval = setInterval(setMole, 750); 
    bombInterval = setInterval(setBomb, 1500);
}

// Genereert een willekeurig tegel-ID
function getRandomTile() {
    let num = Math.floor(Math.random() * 9);
    return num.toString();
}

// Zet een mol op een willekeurige tegel
function setMole() {
    if (gameOver) return;
    if (currMoleTile) currMoleTile.innerHTML = "";
    
    let mole = document.createElement("img");
    mole.src = "./mole.png";

    let num = getRandomTile();
    if (currBombTile && currBombTile.id == num) return;
    
    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole);
    moleClickable = true;
}

// Zet een bom op een willekeurige tegel
function setBomb() {
    if (gameOver) return;
    if (currBombTile) currBombTile.innerHTML = "";
    
    let bomb = document.createElement("img");
    bomb.src = "./bomb.png";
    
    let num = getRandomTile();
    if (currMoleTile && currMoleTile.id == num) return;
    
    currBombTile = document.getElementById(num);
    currBombTile.appendChild(bomb);
}

// Functie die bepaalt wat er gebeurt als een tegel wordt aangeklikt
function selectTile() {
    if (gameOver) return;
    playClickSound();
    
    if (this == currMoleTile && moleClickable) {
        score += 10;
        document.getElementById("score").innerText = "Score: " + score;
        moleClickable = false;
        
        // Max score = 250 
        if (score >= 250) {
            gameOver = true;
            clearInterval(moleInterval);
            clearInterval(bombInterval);
            showEndScreen("Gewonnen! Score: " + score);
        }
    } else if (this == currBombTile) {
        gameOver = true;
        clearInterval(moleInterval);
        clearInterval(bombInterval);
        showEndScreen("GAME OVER, Jouw score was: " + score);
    }
}
