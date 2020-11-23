const express = require('express')
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors')
const game = require('./game')

const app = express()
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

  //Events
io.on('connection', socket => {
    console.log('new player has joined', socket.id)
    socket.on('disconnect', () => {
        console.log('user left!!!')
        let leftPlayer = game.findPlayerById(socket.id)
        if(!leftPlayer) {
            leftPlayer = game.findOpponentById(socket.id);
        }
        if(!leftPlayer) { //Two users left
            return;
        }
        leftPlayer.opponent.socket.emit('opponentLeft', {
            msg: `${leftPlayer.name} had left the game`
        })
        game.deleteGameAndUsers(socket.id)
    })

    //Player joined
    socket.on('join', data => {

       const firstPlayer = game.joinUser(socket, data)
       if(firstPlayer.opponent) {
           const currentGame = game.buildNewGame(data.size, firstPlayer.socket, firstPlayer.opponent.socket)
           
           firstPlayer.socket.emit('gameStart', {
               cellsData: currentGame.cells,
               symbol: firstPlayer.symbol,
               myTurn: true,
               opponentName: firstPlayer.opponent.name
           })

           firstPlayer.opponent.socket.emit('gameStart', {
                cellsData: currentGame.cells,
                symbol: firstPlayer.opponent.symbol,
                myTurn: false,
                opponentName: firstPlayer.name
           })
       }
       else {
           socket.emit('waiting', {
               isWaiting: true
           })
       }
    })

    socket.on('makeMove', data => {
        game.setCellData(data.index, data.symbol, socket);
        const winningCellsObj = game.checkWinnerState(socket)
        const currentGame = game.findGameById(socket.id)

        if(winningCellsObj) {
            let wonPlayer = game.findPlayerById(socket.id)
            if(!wonPlayer) {
                wonPlayer = game.findOpponentById(socket.id);
            }

            wonPlayer.socket.emit('hasWinner', {
                msg: 'You won!',
                winner: true,
                winningCells: winningCellsObj.cells,
                cellsData: currentGame.cells
            })

            wonPlayer.opponent.socket.emit('hasWinner', {
                msg: 'You lost!',
                winner: false,
                winningCells: winningCellsObj.cells,
                cellsData: currentGame.cells
            })
        } else if(game.checkGameOver(socket)) {
            let firstPlayer = game.findPlayerById(socket.id)
            let secondPlayer;

            if(firstPlayer) {
                secondPlayer = firstPlayer.opponent
            } else {
                secondPlayer = game.findOpponentById(socket.id)
                firstPlayer = secondPlayer.opponent
            }

            firstPlayer.socket.emit('gameOver', {
                msg: 'The game is over!',
                cellsData: currentGame.cells
            })

            secondPlayer.socket.emit('gameOver', {
                msg: 'The game is over!',
                cellsData: currentGame.cells
            })
        } else {
            let firstPlayer = game.findPlayerById(socket.id)
            let secondPlayer;
            let firstPlayerTurn;

            if(firstPlayer) {
                secondPlayer = firstPlayer.opponent
                firstPlayerTurn = false;
            } else {
                secondPlayer = game.findOpponentById(socket.id)
                firstPlayer = secondPlayer.opponent
                firstPlayerTurn = true
            }

            
            firstPlayer.socket.emit('switchTurns', {
                msg: firstPlayerTurn ? 'Your Turn': 'Your opponent turn',
                myTurn: firstPlayerTurn,
                cellsData: currentGame.cells
            })

            secondPlayer.socket.emit('switchTurns', {
                msg: firstPlayerTurn ? 'Your opponent turn': 'Your turn',
                myTurn: !firstPlayerTurn,  
                cellsData: currentGame.cells
            })
        }
    })
})  


const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
    console.log(`Server is up and running on port: ${PORT}`)
})