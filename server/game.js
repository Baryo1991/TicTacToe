const { checkForWinner } = require("./helpers/gameHelper");

players = {}

var games = {}

exports.joinUser = (socket, data) => {
    // Find for waiting opponent

    const foundOpponent = Object.values(players).find(player => !player.opponent && player.size === data.size)

    if(foundOpponent) {
        foundOpponent.opponent = {
            socket,
            name: data.name,
            size: data.size,
            symbol: 'O',
            opponent: foundOpponent
        }
        return foundOpponent;
    }

    const newPlayer = {
        socket,
        name: data.name,
        size: data.size,
        symbol: 'X',
        opponent: null
    }
    players[socket.id] = newPlayer

    return newPlayer;
}

//build a new game while two joined
exports.buildNewGame = (size, socket, opponentSocket) => {
    games[socket.id] = {
        socketId: socket.id,
        opponentSocketId: opponentSocket.id,
        cells: [...Array(size).keys()].map(_ => ({ data: null })),
        size
    };
    return games[socket.id]
}


//While one of the players made a move
exports.setCellData = (index, symbol, socket) => {
    const desiredGame = this.findGameById(socket.id)
    if(!desiredGame) { //This situation should never ever happen
        return;
    }
    desiredGame.cells[index].data = symbol;
}


exports.checkWinnerState = (socket) => {
    const desiredGame = this.findGameById(socket.id)
    const winningCells = checkForWinner(desiredGame.size, desiredGame.cells);
    if(winningCells) {
        return {
            socket, 
            opponentSocket: desiredGame.opponent,
            cells: winningCells
        };
    }
}

exports.checkGameOver = (socket) => {
    const desiredGame = this.findGameById(socket.id);
    const isGameOver = desiredGame.cells.every(cell => cell.data === 'X' || cell.data === 'O');
    return isGameOver
}


exports.findGameById = (id) => {
    let desiredGame = games[id];
    if(!desiredGame) {
        desiredGame = Object.values(games).find(game => game.opponentSocketId === id)
    }

    return desiredGame;
}

exports.findPlayerById = id => {
    return players[id];
}

exports.findOpponentById = opponentId => {
    const desiredPlayer = Object.values(players).find(player => player.opponent &&  player.opponent.socket.id === opponentId);
    return desiredPlayer ? desiredPlayer.opponent : null
}

exports.removeUserBySocketId = (socket) => {
    //Remove player
    let desiredPlayer = players[socket.id];
    if(!desiredPlayer) {
        desiredPlayer = Object.values(players).find(player => player.opponent.socket.id === socket.id);
    }
    delete players[desiredPlayer.socket.id]
}

exports.deleteGameAndUsers = socketId => {
    let firstPlayer = this.findPlayerById(socketId)
    if(!firstPlayer) {
        const secondPlayer = this.findOpponentById(socketId);
        firstPlayer = secondPlayer.opponent
    }
    //Delete player
    delete players[firstPlayer.socket.id]

    //Delete game
    delete games[firstPlayer.socket.id]
}