let BOARD_SIZE = 15 // kentän koko
let board; // kentän tallennus


// napin haku ja tapahtumakuuntelijan lisäys
document.getElementById('new-game-btn').addEventListener('click', startGame);

// tietyn ruudun pelilaudasta hakevan apufunktion luonti
function getCell(board, x, y){
    return board[y][x] // koordinaattien (x,y) kohdalla olevan arvon palautus
}


function startGame(){
    // intro-näkymän piilotus ja pelialueen paljastus
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';


    board = generateRandomBoard(); // pelikentän luonti ja piirto

    drawBoard


    console.log('Peli aloitettu');
}


function generateRandomBoard(){
    // tyhjillä soluilla täytettävän 2D-taulukon luonti (' ')
    const newBoard = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(''));

    // pelikentän rivien läpikäynti
    for ( let y = 0; y < BOARD_SIZE; y++){
        // jokaisen sarakkeen läpikäynti
        for (let x = 0; x < BOARD_SIZE; x++){
            // pelikentän reuna-tarkistus
            if (y === 0 || y === BOARD_SIZE - 1 || x === 0 || x === BOARD_SIZE - 1){
                newBoard[y][x] = "W"; // merkitsee reunasolun seinäksi
            }
        }
    }

    console.log(newBoard);
    return newBoard;
}

// piirtää pelikentän
function drawBoard(board){
    // pelikentän lisäyskohteen HTML-elementin haku
    const gameBoard = document.getElementById("game-board");

    // sarakkeiden ja rivien asetus pelikentän mukaisesti
    gameBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;

    for (let y = 0; y < BOARD_SIZE; y++) { // pelikentän rivien läpikäynti
        for (let x = 0; x < BOARD_SIZE; x++) { // jokaisen rivin sarakkeiden läpikäynti
            const cell = document.createElement("div"); // yhtä pelikentän ruutua edustavan HTML-elementin luonti
            cell.classList.add("cell"); // perusluokka "cell" lisäys, joka muotoilee ruudun CSS:llä

            if (getCell(board, x, y) === "W") {
                cell.classList.add("wall");
            }
            gameBoard.appendChild(cell);
        }
    }
}