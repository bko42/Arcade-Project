/*

Requirements

Initial State:
    - Tic tac toe grid
    - Previous Winner Board
    - Score Board
    - X assigned player - Red
    - O assigned Player - Blue
    - Player Timer
    - One player or Two player

Functions needed:
    - reset board
    - check winning combos
    

*/
const board = document.getElementById("board")
const cell = document.getElementsByClassName("cell")
const announce = document.getElementById("announce")
const p1Score = document.getElementById("p1xScore")
const p2Score = document.getElementById("p2oScore")
const p1ScoreName = document.getElementById("p1ScoreName")
const p2ScoreName = document.getElementById("p2ScoreName")
const player1X = "X"
const player2O = "O"
let numPlayers = ""
let p1Name = ""
let p2Name = ""
let currentPlayer = ""
let currentPlayerName = ""
let gameOver = "false"
let xScore = 0
let yScore = 0
let turns = 0

//8 winning combinations =
const winningCombos = [
    [0, 1, 2], //r1
    [3, 4, 5], //r2
    [6, 7, 8], //r3

    [0, 3, 6], //c1
    [1, 4, 7], //c2
    [2, 5, 8], //c3

    [0, 4, 8], //d1
    [2, 4, 6], //d2
]

// Resets the game and clears all variables as if page was reloaded.
resetGame()
const reset = document.getElementById("reset")
reset.addEventListener('click', resetGame)

function resetGame() {
    const clearBoxes = document.getElementsByClassName("cell")

    for (let i = 0; i < clearBoxes.length; i++) {
        clearBoxes[i].innerText = ""
    }

    xScore = 0
    yScore = 0
    p1Score.innerText = xScore
    p2Score.innerText = yScore
    announce.innerText = ""
    turns = 0
    gameOver = "false"
    numPlayers = ""
    p1Name = ""
    p2Name = ""
    p1ScoreName.innerText = "Player 1"
    p2ScoreName.innerText = "Player 2"
    document.getElementById("playAgain").style.display = "none";
    document.getElementById("players").style.display = "block"
    board.addEventListener('click', markBox)

}

// Sets up a new game, keeps the score and players.
const playAgain = document.getElementById("playAgain")
playAgain.addEventListener('click', nextGame)

function nextGame() {
    const clearBoxes = document.getElementsByClassName("cell")

    for (let i = 0; i < clearBoxes.length; i++) {
        clearBoxes[i].innerText = ""
    }
    turns = 0
    gameOver = "false"
    announce.textContent = ""
    document.getElementById("playAgain").style.display = "none";
    board.addEventListener('click', markBox);
    choosePlayer()
    announcePlayer()
    checkCompTurn()
}

//Player number selection with name prompt
const playerSelect1 = document.getElementById("onePlayer")
playerSelect1.addEventListener('click', function (event) {
    numPlayers = "onePlayer"
    namePrompt()
    p1ScoreName.innerText = p1Name
    p2ScoreName.innerText = p2Name
    choosePlayer()
    announcePlayer()
    checkCompTurn()
})

const playerSelect2 = document.getElementById("twoPlayers")
playerSelect2.addEventListener('click', function (event) {
    numPlayers = "twoPlayers"
    namePrompt()
    p1ScoreName.innerText = p1Name
    p2ScoreName.innerText = p2Name
    choosePlayer()
    announcePlayer()
})

//Get player names, defaults to Player 1 & Player 2.
function namePrompt() {
    if (numPlayers === "onePlayer") {
        p1Name = prompt("What is your name?");
        if (p1Name === null || p1Name === "") {
            p1Name = "Player 1"
        }
        p2Name = "Computer"
    } else if (numPlayers === "twoPlayers") {
        p1Name = prompt("What is player 1's name?");
        if (p1Name === null || p1Name === "") {
            p1Name = "Player 1"
        }
        p2Name = prompt("What is player 2's name?");
        if (p2Name === null || p2Name === "") {
            p2Name = "Player 2"
        }
    }
    document.getElementById("players").style.display = "none"
}
//Randomly select who goes first
function choosePlayer() {
    if (Math.random() < 0.5) {
        currentPlayer = player2O
        currentPlayerName = p2Name
    } else {
        currentPlayer = player1X
        currentPlayerName = p1Name
    }
}
//Announces whose turn it is
function announcePlayer() {
    announce.innerText = "It is " + currentPlayerName + "'s" + "(" + currentPlayer + ") turn to go"
}

//Checks to see if computer is playing and then initiates computers turn
function checkCompTurn() {
    if (currentPlayerName === "Computer") {
        board.removeEventListener('click', markBox);
        const waitToMark = setTimeout(compTurn, 1500);
    }
}

//Marks chosen box human player
function markBox(event) {
    let box = event.target

    if (numPlayers === "") {
        announce.innerText = "Please pick the number of players.";
        return;
    }

    if (box.innerText === "") {
        box.innerText = currentPlayer
    } else { return }

    turns++
    winCheck()

    if (gameOver === "true") {
        announce.innerText = currentPlayer + " (" + currentPlayerName + ") Has Won!\n\n" + "Would you like to play another round?"
        document.getElementById("playAgain").style.display = "block";
        board.removeEventListener('click', markBox);
    } else if (turns >= 9) {
        announce.innerText = "It's a DRAW!"
        document.getElementById("playAgain").style.display = "block";
        board.removeEventListener('click', markBox);
    } else
        switchPlayers()

}

// Automated computers turn
function compTurn() {
    console.log("turn completed")
    if (!checkNearWin()) {
        if (!checkNearLoss()) {

            let num = Math.floor((Math.random() * 9))
            let box = cell[num]
            while (box.innerText !== "") {
                num = Math.floor((Math.random() * 9))
                box = cell[num]
            }
            box.innerText = currentPlayer
            console.log("picked random box")
        }

    }
    turns++
    winCheck()
    if (gameOver === "true") {
        announce.innerText = currentPlayer + " (" + currentPlayerName + ") Has Won!\n\n" + "Would you like to play another round?"
        document.getElementById("playAgain").style.display = "block";
    } else if (turns >= 9) {
        announce.innerText = "It's a DRAW!"
        document.getElementById("playAgain").style.display = "block";
    } else {
        board.addEventListener('click', markBox)
        switchPlayers()
    }
}



function checkNearWin() {
    for (let i = 0; i < 8; i++) {
        const win = winningCombos[i];
        let sq1 = cell[win[0]].innerText;
        let sq2 = cell[win[1]].innerText;
        let sq3 = cell[win[2]].innerText;
        console.log("board", sq1, sq2, sq3)
        if (sq1 === currentPlayer && sq1 === sq2 && sq3 === "") {
            //sq3 = currentPlayer
            cell[win[2]].innerText = currentPlayer
            console.log(sq3, "picked sq3")
            return true
        } else if (sq2 === currentPlayer && sq2 === sq3 && sq1 === "") {
            //sq1 = currentPlayer
            cell[win[0]].innerText = currentPlayer
            console.log(sq1, "picked sq1")
            return true
        } else if (sq3 === currentPlayer && sq1 === sq3 && sq2 === "") {
            //sq2 = currentPlayer
            cell[win[1]].innerText = currentPlayer
            console.log(sq2, "picked sq2")
            return true
        }
    } return false
}


function checkNearLoss() {
    for (let i = 0; i < 8; i++) {
        const win = winningCombos[i];
        let sq1 = cell[win[0]].innerText;
        let sq2 = cell[win[1]].innerText;
        let sq3 = cell[win[2]].innerText;


        if (sq1 === "X" && sq1 === sq2 && sq3 === "") {
            cell[win[2]].innerText = currentPlayer
            return true
        } else if (sq2 === "X" && sq2 === sq3 && sq1 === "") {
            cell[win[0]].innerText = currentPlayer
            return true
        } else if (sq3 === "X" && sq1 === sq3 && sq2 === "") {
            cell[win[1]].innerText = currentPlayer
            return true
        }
    } return false
}

//Switches players
function switchPlayers() {
    if (currentPlayer === player1X) {
        currentPlayer = player2O;
        currentPlayerName = p2Name;
    } else {
        currentPlayer = player1X;
        currentPlayerName = p1Name;
    }
    announcePlayer()
    checkCompTurn()
}

//Checks for a win
function winCheck() {
    for (let i = 0; i < 8; i++) {
        const win = winningCombos[i];
        const sq1 = cell[win[0]].innerText;
        const sq2 = cell[win[1]].innerText;
        const sq3 = cell[win[2]].innerText;
        if (sq1 === '' || sq2 === '' || sq3 === '') {
            continue;
        }
        if (sq1 === sq2 && sq2 === sq3) {
            gameOver = "true";
            if (currentPlayer === "X") {
                xScore++;
                p1Score.innerText = xScore;
                break;
            } else {
                yScore++;
                p2Score.innerText = yScore;
                break;
            }
        }
    }
}

