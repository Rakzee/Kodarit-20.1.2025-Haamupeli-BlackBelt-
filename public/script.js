let BOARD_SIZE = 20 // pelikentän koko
const cellSize = calculateCellSize(); // ruudun responsiivisen koon laskenta
let board; // kentän tallennuskohde
let player; // pelaajan muuttuja


// napin haku ja tapahtumakuuntelijan lisäys
document.getElementById('new-game-btn').addEventListener('click', startGame);

// tapahtumankuuntelija, joka reagoi näppäimistö
document.addEventListener('keydown', (event) =>{
    
    switch (event.key){
    // näppäimen painotarkistus
    case 'ArrowUp' :
        player.move(0, -1) // liikuttaa pelaajaa yhdellä askeleella ylös
        break;

    case 'ArrowDown' :
        player.move (0, 1); // liikuttaa pelaajaa yhdellä askeleella alas
        break;

    case 'ArrowLeft' :
        player.move (-1, 0); // liikuttaa pelaajaa yhdellä askeleella vasemmalle
        break;

    case 'ArrowRight' :
        player.move (1, 0); // liikuttaa pelaajaa yhdellä askeleella oikealle
        break;
    }
    event.preventDefault(); // kieltää selaimen oletustoiminnot (sivun vieritys...)
})

// tietyn arvon asettaminen palaajalle tiettyyn ruutuun pelikentällä
function setCell(board, x, y, value){
    board[x][y] = value;
}

// tietyn ruudun pelilaudasta hakevan apufunktion luonti
function getCell(board, x, y) {
    return board[y][x]; // koordinaattien (x, y) kohdalla olevan arvon palautus
}


function calculateCellSize(){
    // selainikkunan korkeuden ja leveyden selvitys ja niistä pienemmän arvon valinta
    const screenSize = Math.min(window.innerWidth, window.innerHeight);


    // pelikentän koon lasku siten, että jää hieman reunatilaa
    const gameBoardSize = 0.95 * screenSize;
    // yksittäisen ruudun koon lasku jakamalla pelikentän koko ruutujen määrällä
    return gameBoardSize / BOARD_SIZE;
}


function startGame(){
    // intro-näkymän piiloitus ja pelikentän paljastus
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';

    // uuden pelaajan luonti ja sen sijoittaminen koordinaatteihin (0, 0)
    player = new Player(0, 0);

    board = generateRandomBoard(); // luo pelikentän ja piirtää sen


    drawBoard(board); // pelikentän piirtäminen HTML:n


    console.log('Peli aloitettu');
}


function generateRandomBoard(){
    // tyhjillä soluilla täytettävän 2D-taulukon luonti (' ')
    const newBoard = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(''));


    // jokaisen pelikentän rivin läpikäynti
    for ( let y = 0; y < BOARD_SIZE; y++){
        // jokaisen tietyn rivin sarakkeen läpikäynti
        for (let x = 0; x < BOARD_SIZE; x++){
            // tarkistaa, onko solu pelikentän reunassa
            if (y === 0 || y === BOARD_SIZE - 1 || x === 0 || x === BOARD_SIZE - 1) {
                newBoard[y][x] = 'W'; // solun merkintä seinäksi (W), jos se on reunassa
            }
        }
    }
    generateObstacles(newBoard);

   // newBoard[6][7] = 'P'; // pelaajan sijoitus kentälle kohtaan (6,7) P = pelaaja

    const [playerX, playerY] = randomEmptyPosition(newBoard); // satunnaisen tyhjän paikan haku
    setCell(newBoard, playerX, playerY, 'P'); // pelaajan asettaminen tiettyyn kohtaan

    // pelaajan x-y-koordinaattien päivitys vastaamaan uuta sijaintia
    player.x = playerX;
    player.y = playerY;

    return newBoard;
}


// piirtää pelikentän
function drawBoard(board) {
    // HTML elementin, johon pelikenttä lisätään, haku
    const gameBoard = document.getElementById('game-board');
    // tyhjentää olemassa olevan sisällön
    gameBoard.innerHTML = '';
    // sarakkeiden ja rivien asettaminen pelikentän koon mukaisesti
    gameBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;


    for (let y = 0; y < BOARD_SIZE; y++) { // pelikentän rivien läpikäynti
        for (let x = 0; x < BOARD_SIZE; x++) { // jokaisen rivin sarakkeiden läpikäynti
            const cell = document.createElement('div'); // uuden HTML-elementin (div) luonti, joka edustaa yhtä pelikentän ruutua
            cell.classList.add('cell'); // perusluokka cell:in lisäys, joka muotoilee ruudun CSS:llä
            // ruudun leveyden ja korkeuden asettaminen dynaamisesti laskettuun kokoon ja "px"-yksikön luonti
            cell.style.width = cellSize + "px"
            cell.style.height = cellSize + "px"


            if (getCell(board, x, y) === 'W') {
                cell.classList.add('wall');
            } else if (getCell(board, x, y) === 'P'){ // pelaajan lisäys ruudukkoon
                cell.classList.add('player'); // p pelaaja
            }
            gameBoard.appendChild(cell);
        }
    }
}


function generateObstacles(board){
 // lista esteitä
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
        { startX: 2, startY: 2 },   // este kentän vasemmassa yläkulmassa
        { startX: 8, startY: 2 },   // este ylempänä keskellä
        { startX: 4, startY: 8 },   // este vasemmalla keskialueella
        { startX: 3, startY: 16 },  // este alareunan vasemmassa osassa
        { startX: 10, startY: 10 }, // este keskellä kenttää
        { startX: 12, startY: 5 },  // este yläkeskialueella
        { startX: 12, startY: 10 }, // este keskialueella
        { startX: 16, startY: 10 }, // este oikealla keskialueella
        { startX: 13, startY: 14 }  // este alhaalla keskellä
    ];
     // jokaisen aloituspaikan läpikäynti ja satunnaisen esteen lisäys sinne
     positions.forEach(pos => {
        // satunnaisen esteen valinta obstacles-taulukosta
        const randomObstacle = obstacles[Math.floor(Math.random() * obstacles.length)];


        // valitun esteen sijoittaminen kentälle tiettyyn kohtaan
        placeObstacle(board, randomObstacle, pos.startX, pos.startY);
     });


}


function placeObstacle(board, obstacle, startX, startY){
    // jokaisen esteen määrittelemän ruudun läpikäynti
    for (coordinatePair of obstacle) {
        [x, y] = coordinatePair; // koordinaatiparin (x,y) purkaminen muuttujiin


        // esteen ruudun sijoittaminen pelikentälle suhteessa aloituspisteeseen
        board[startY + y][startX + x] = 'W';
    }
}

// luo satunnaisen kokonaisluvun annettujen rajojen sisällä
function randomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1))
}

// satunnaisen tyhjän ruudun etsiminen pelikentältä ja palauttaa sen koordinaatit
function randomEmptyPosition(board) {
    x = randomInt(1, BOARD_SIZE - 2); // satunnainen x-koordinaatti pelikentän sisäalueella
    y = randomInt(1, BOARD_SIZE - 2); // satunnainen y-koordinaatti pelikentän sisäalueelta
 
    if  (getCell(board, x, y) === ' '){
        return [x,y]; // ruudun palatus, jos se on tyhjä (' ')
    } else {
        randomEmptyPosition(board); // uuden satunnaisen paikan haku, jos ruutu ei ole tyhjä
    }
}

// pelaajan sijaintia ja liikettä hallitsevan Player-luokan luonti
class Player {
    constructor(x, y) {
        this.x = x; // tallentaa pelaajan aloituspaikan x-koordinaatin
        this.y = y; // tallentaa pelaajan aloituspaikan y-koordinaatin
    }
    // tallentaa pelaajan nykyisen sijainnin ennen liikettä
    move(deltaX, deltaY){
        const currentX = player.x;
        const currentY = player.y;
        
        // uuden sijainnin laskenta (delta-arvo + nykyinen sijainti)
        const newX = currentX + deltaX;
        const newY = currentY + deltaY;
        if (getCell(board, newX, newY) === ' '){
            // pelaajan uuden sijainnin päivitys muuttujassa
            player.x = newX;
            player.y = newY

            // pelikentän päivitys
            board[currentX][currentY] = ' '; // vanhan paikan tyhkennys pelikentällä
            board[newY][newX] = 'P'; // uuden sijainnin asetus pelikentälle pelaajaksi ('P)
        }

        // pelikentän piirtäminen uudelleen siten, että pelaajan liike näkyy visuaalisesti
        drawBoard(board);
    }
}