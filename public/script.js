let BOARD_SIZE = 20 // kentän koko
const cellSize = calculateCellSize(); // ruudun koon laskeminen responsiivisesti
let board; // kentän tallennus

// napin haku ja tapahtumakuuntelijan lisäys
document.getElementById('new-game-btn').addEventListener('click', startGame);

// tietyn ruudun pelilaudasta hakevan apufunktion luonti
function getCell(board, x, y){
    return board[y][x] // koordinaattien (x,y) kohdalla olevan arvon palautus
}

function calculateCellSize(){
    const screenSize = Math.min(window.innerWidth, window.innerHeight); // selainikkunan leveys-korkeus selvitys ja pienemmän arvon valinta

    const gameBoardSize = 0.95 * screenSize; // pelilaudan koon lasku, jossa jää reunatilaa

    return gameBoardSize / BOARD_SIZE; // yksittäisen ruudun koon määritys pelikentän koon ja pelikentän ruutujen lukumäärän osamäärästä
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
            const cell = document.createElement('div'); // yhtä pelikentän ruutua edustavan HTML-elementin luonti
            cell.classList.add('cell'); // perusluokka "cell" lisäys, joka muotoilee ruudun CSS:llä

            // ruudun leveyden ja korkeuden asettaminen dynaamisesti laskettuun kokoon
            cell.style.width = cellSize + "px"
            cell.style.height = cellSize + "px"

            if (getCell(board, x, y) === 'W') {
                cell.classList.add('wall');
            }
            gameBoard.appendChild(cell);
        }
    }
}

function generateObstacles(board){
// estelista
    const obstacles = [
        [[0,0],[0,1],[1,0],[1,1]], // Square (neliö)
        [[0,0],[0,1],[0,2],[0,3]], // I-muoto (pysty- tai vaakasuora palkki)
        [[0,0],[1,0],[2,0],[1,1]], // T-muoto
        [[1,0],[2,0],[1,1],[0,2],[1,2]], // Z-muoto
        [[1,0],[2,0],[0,1],[1,1]], // S-muoto
        [[0,0],[1,0],[1,1],[1,2]], // L-muoto
        [[0,2],[0,1],[1,1],[2,1]]  // J-muoto (peilikuva L-muodosta)
    ];

    // kovakoodatut aloituspaikat esteille pelikentällä
    const positions = [
        { startX: 2, startY: 2 },   // Este kentän vasemmassa yläkulmassa
        { startX: 8, startY: 2 },   // Este ylempänä keskellä
        { startX: 4, startY: 8 },   // Este vasemmalla keskialueella
        { startX: 3, startY: 16 },  // Este alareunan vasemmassa osassa
        { startX: 10, startY: 10 }, // Este keskellä kenttää
        { startX: 12, startY: 5 },  // Este yläkeskialueella
        { startX: 12, startY: 10 }, // Este keskialueella
        { startX: 16, startY: 10 }, // Este oikealla keskialueella
        { startX: 13, startY: 14 }  // Este alhaalla keskellä
    ];

    // jokaisen aloituspaikan läpikäynti ja esteen lisäys
    positions.forEach(pos => {
        // satunnaisen esteen valinta obstacles-taulukosta
        const randomObstacle = obstacles[Math.floor(Math.random() * obstacles.length)];

        // valitun esteen sijoittaminen kentälle tiettyyn kohtaan
        placeObstacle(board, randomObstacle, pos.startX, pos.startY);
    });
}

function placeObstacle(board, obstacle, startX, startY){
    // jokaisen esteen määrittelemän ruudun läpikäynti
    for (coordinatePair of obstacle){
        [x, y] = coordinatePair; // koordinaattiparin purku x-ja y-muuttujiin

        // esteen ruudn sijoittaminen pelikentälle suhteessa aloituspisteeseen
        board[startY + y][startX + x] = 'W';
    }
}