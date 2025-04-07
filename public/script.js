let BOARD_SIZE = 20 // pelikentän koko
const cellSize = calculateCellSize(); // ruudun responsiivisen koon laskenta
let board; // kentän tallennuskohde
let player; // muuttuja pelaajalle
let ghosts = []; // ghost-olioiden lista


// napin haku ja tapahtumakuuntelijan lisäys
document.getElementById('new-game-btn').addEventListener('click', startGame);


// näppäimistön painalluksiin reagoivan tapahtumakuuntelijan lisäys
document.addEventListener('keydown', (event) => {


    switch (event.key){


        // painetun nappulan tarkistus
        case 'ArrowUp':
            player.move(0, -1); // Liikuta pelaajaa yksi askel ylöspäin
            break;


        case 'ArrowDown':
            player.move(0, 1); //Liikuta pelaajaa yksi askel alaspäin
            break;


        case 'ArrowLeft':
            player.move(-1, 0); //Liikuta pelaajaa yksi askel vasemmalle
            break;


        case 'ArrowRight':
            player.move(1, 0); // Liikuta pelaajaa yksi askel oikealle
            break;

        case 'w':
            shootAt(player.x, player.y - 1); // ylöspäin ampuminen
            break;

        case 's':
            shootAt(player.x, player.y + 1); // alaspäin ampuminen
            break;

        case 'a':
            shootAt(player.x - 1, player.y); // vasemmalle ampuminen
            break;

        case 'd':
            shootAt(player.x + 1, player.y); // oikealle ampuminen
            break;

    }
    event.preventDefault(); // Estetään selaimen oletustoiminnot, kuten sivun vieritys
});


// Asettaa tietyn arvon esim 'P' pelaajalle tiettyyn ruutuun pelikentällä
function setCell(board, x, y, value) {
    board[y][x] = value; // Muutetaan pelikentän (board) koordinaatin (x, y) arvoksi 'value'
}
//Luodaan apufunktio joka hakee tietyn ruudun sisällön pelilaudasta
function getCell(board, x, y) {
    return board[y][x]; //Palautetaan koordinaattien (x, y) kohdalla oleva arvo
}


function calculateCellSize(){
    // Selvitetään selainikkunan leveys ja korkeus ja valitaan näistä pienempi arvo
    const screenSize = Math.min(window.innerWidth, window.innerHeight);


    // Lasketaan pelilaudan koko että jää hieman reunatilaa
    const gameBoardSize = 0.95 * screenSize;
    // Lasketaan yksittäisen ruudun koko jakamalla pelilaudan koko ruutujen määrällä
    return gameBoardSize / BOARD_SIZE;
}


function startGame(){
    // Piilotetaan intro-näkymä ja näytetään pelialue
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';


    //Luo uuden pelaajan ja sijoittaa sen koordinaatteihin (0,0)
    player = new Player(0, 0);


    board = generateRandomBoard(); //Luo pelikenttä ja piirrä se


    drawBoard(board); // Piirretään pelikenttä HTML:n


    console.log('Peli aloitettu');
}


function generateRandomBoard(){
    // Luodaan 2D-taulukko, joka täytetään tyhjillä soluilla (' ')
    const newBoard = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(' '));


    // Käydään läpi pelikentän jokainen rivi
    for ( let y = 0; y < BOARD_SIZE; y++){
        // Käydään läpi jokainen sarake kyseisellä rivillä
        for (let x = 0; x < BOARD_SIZE; x++){
            // Tarkistetaan, onko solu pelikentän reunassa
            if (y === 0 || y === BOARD_SIZE - 1 || x === 0 || x === BOARD_SIZE - 1) {
                newBoard[y][x] = 'W'; // Jos solu on reunassa, merkitään se seinäksi ('W')
            }
        }
    }
    generateObstacles(newBoard);

    for (let i = 0; i < 5; i++){ // 5 haamun luonti
        const [ghostX, ghostY] = randomEmptyPosition(newBoard) // satunnaisen tyhjän paikan haku kentältä
        setCell(newBoard, ghostX, ghostY, 'H'); // haamun "h" asettaminen pelikentän matriisiin
        ghosts.push(new Ghost(ghostX, ghostY)); // uuden ghost-olion lisäys ja sen listaan lisäys
    }


    const [playerX, playerY] = randomEmptyPosition(newBoard); // satunnaisen tyhjän paikan haku kentältä
    setCell(newBoard, playerX, playerY, 'P'); // pelaajan asettaminen tiettyyn kohtaan

    // pelaajan x-y-koordinaattien päivitys vastaamaan uuttasijaintia
    player.x = playerX;
    player.y = playerY;
       
    return newBoard;
}


//Tämä funktio piirtää pelikentän
function drawBoard(board) {
    //Haetaan HTML-elementti, johon pelikenttä lisätään
    const gameBoard = document.getElementById('game-board');
    // Tyhjennä olemassa oleva sisältö
    gameBoard.innerHTML = '';
    // Asetetaan sarakkeet ja rivit pelikentän koon mukaisesti
    gameBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;


    for (let y = 0; y < BOARD_SIZE; y++) { // Käydään läpi pelikentän rivit
        for (let x = 0; x < BOARD_SIZE; x++) { // Käydään läpi jokaisen rivin sarakkeet
            const cell = document.createElement('div'); // Luodaan uusi HTML-elementti (div), joka edustaa yhtä pelikentän ruutua
            cell.classList.add('cell'); // Lisätään ruudulle perusluokka "cell", joka muotoilee ruudun CSS:llä
            // Asetetaan ruudun leveys ja korkeus dynaamisesti laskettuun kokoon, lisätään yksikkö "px"
            cell.style.width = cellSize + "px"
            cell.style.height = cellSize + "px"


            if (getCell(board, x, y) === 'W') {
                cell.classList.add('wall');
            } else if (getCell(board, x, y) === 'P'){ // pelaajan lisäys ruudukkoon
                cell.classList.add('player'); // 'p' = pelaaja
            } else if (getCell(board, x, y) === 'H'){ // jos ruudussa on 'H' = haamu
                cell.classList.add('hornmonster'); // hahmon CSS-luokan lisäys, joka näyttää sen kuvana
            } else if (getCell(board, x, y) === 'B' ){
                cell.classList.add('bullet'); // B = ammus
                setTimeout(()=> {
                    setCell(board, x, y, ' ')
                }, 500); // ammus katoaa 0.5 sekunnin jälkeen
            gameBoard.appendChild(cell);
        }
    }
}


function generateObstacles(board){
 //Lista esteitä
    const obstacles = [
        [[0,0],[0,1],[1,0],[1,1]], // Square (neliö)
        [[0,0],[0,1],[0,2],[0,3]], // I-muoto (pysty- tai vaakasuora palkki)
        [[0,0],[1,0],[2,0],[1,1]], // T-muoto
        [[1,0],[2,0],[1,1],[0,2],[1,2]], // Z-muoto
        [[1,0],[2,0],[0,1],[1,1]], // S-muoto
        [[0,0],[1,0],[1,1],[1,2]], // L-muoto
        [[0,2],[0,1],[1,1],[2,1]]  // J-muoto (peilikuva L-muodosta)
    ];
    //Kovakoodatut aloituspaikat esteille pelikentällä
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
     //Käydään läpi jokainen aloituspaikka ja lisätään sinne satunnainen este
     positions.forEach(pos => {
        // Valitaan satunnainen este obstacles-taulukosta
        const randomObstacle = obstacles[Math.floor(Math.random() * obstacles.length)];


        //Sijoitetaan valittu este kentälle kyseiseen kohtaan
        placeObstacle(board, randomObstacle, pos.startX, pos.startY);
     });


}


function placeObstacle(board, obstacle, startX, startY){
    // Käydään läpi jokainen esteen määrittelemä ruutu
    for (coordinatePair of obstacle) {
        [x, y] = coordinatePair; //Puretaan koordinaattipari x- ja y-muuttujiin


        // Sijoitetaan esteen ruutu pelikentälle suhteessa aloituspisteeseen
        board[startY + y][startX + x] = 'W';
    }
}
// Luo satunnaisen kokonaisluvun annettujen rajojen sisällä
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Etsii pelikentältä satunnaisen tyhjän ruudun ja palauttaa sen koordinaatit
function randomEmptyPosition(board) {
    x = randomInt(1, BOARD_SIZE - 2); //Satunnainen x-koordinaatti pelikentän sisäalueelta
    y = randomInt(1, BOARD_SIZE - 2); // Satunnainen y-koordinaatti pelikentän sisäalueella


    if (getCell(board, x, y) === ' '){
        return [x, y]; // Jos ruutu on tyhjä (' '), palautetaan se
    } else {
        randomEmptyPosition(board); // Jos ruutu ei ole tyhjä, haetaan uusi satunnainen paikka
    }
}


// Luodaan Player-luokka, joka hallitsee pelaajan sijaintia ja liikettä
class Player {
    constructor(x, y) {
        this.x = x; // Tallennetaan pelaajan aloituspaikan x-koordinaatti
        this.y = y; // Tallennetaan pelaajan aloituspaikan y-koordinaatti
    }


    // Funktio pelaajan liikuttamiseen
    move(deltaX, deltaY) {
        // Tallennetaan pelaajan nykyinen sijainti ennen liikettä
        const currentX = player.x;
        const currentY = player.y;


        // Lasketaan uusi sijainti lisäämällä delta-arvot nykyiseen sijaintiin
        const newX = currentX + deltaX;
        const newY = currentY + deltaY;
        if (getCell(board,newX,newY) === ' '){
            // Päivitetään pelaajan uusi sijainti muuttujissa
            player.x = newX;
            player.y = newY;


            // Päivitetään pelikenttä
            board[currentY][currentX] = ' '; // Tyhjennetään vanha paikka pelikentällä
            board[newY][newX] = 'P'; // Asetetään uusi sijainti pelikentälle pelaajaksi ('P')
        }
        // Piirretään pelikenttä uudelleen, jotta pelaajan liike näkyy visuaalisesti
        drawBoard(board);
    }
}

// kummitusten luokka
class Ghost {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

function shootAt(x, y) {

    // ammuksen seinään osumis tarkistus
    if (getCell(board, x, y) === 'W'){
        // jos ruudussa on seinä, ei tee mitään
        return;
    }

    // haamun ammuntakohderuudun selvitys
    const ghostIndex = ghosts.findIndex(ghost => ghost.x === x && ghost.y === y);

    if (ghostIndex != -1) {
        // haamun poisto haamulistasta, jos sellainen löytyy
        ghosts.splice(ghostIndex, 1); // poistaa yhden haamun listasta
        updateScoreBoard(50); // pisteiden lisäys (50 pistettä osumasta)
    }

    // ammuksen 'b' asettaminen ruutuun, jotta se näkyy pelissä
    setCell(board, x, y, 'B');

    // pelin uudelleen piirtäminen, jotta ammus näkyy
    drawBoard(board);

    // tarkistaa, onko kaikki haamut tuhottu (seuraava taso jos on)
    if (ghosts.length === 0){
        // siirtyy seuraavalle tasolle, jos kaikki haamut on tuhottu
        alert('kaikki tuhottu');
    }
}

function moveGhosts(){
    // kaikkien hahmojen sijainnin tallennus ennen niiden liikutusta
const oldGhosts = ghosts.map(ghost => ({ x: ghost.x, y: ghost.y}));
}
    
