import React, {useEffect, useState} from 'react'
import './GameScreen.css'
import Square from '../../components/Square/Square';
import { io } from 'socket.io-client'
import queryString from 'query-string'
import { serverUrl } from './../../config.json'
import Button from '../../components/Button/Button';
// import { generateCellsData, checkForWinner } from '../../helper'

let socket;

let symbol;

const GameScreen = ({location, history}) => {

    const { name, size } = queryString.parse(location.search)
    const [opponentName, setOpponentName] = useState('');
    const [cellsData, setCellsData] = useState([])
    const [waiting, setWaiting] = useState(true);
    const [myTurn, setMyTurn] = useState(false);
    const [gameStatus, setGameStatus] = useState('');
    const [winningCells, setWinningCells] = useState(null)
    const [gameOver, setGameOver] = useState(false)
    const [winner, setWinner] = useState(false);
    const [opponentLeft, setOpponentLeft] = useState('')
    const totalCells = Number(size) ? Number(size) * Number(size) : 9;

    useEffect(() => {
        socket = io(serverUrl, {
            reconnectionAttempts: 5,
        });

        socket.emit('join', {name, size: totalCells})

        socket.on('waiting', data => {
            setWaiting(data.isWaiting);
        })
        socket.on('gameStart', data => {
            symbol = data.symbol
            setOpponentName(data.opponentName);
            setCellsData(data.cellsData)
            setMyTurn(data.myTurn)
            setWaiting(false)
        })

        socket.on('switchTurns', data => {
            setMyTurn(data.myTurn)
            setCellsData(data.cellsData)
            
        })

        socket.on('hasWinner', data => {
            setGameStatus(data.msg);
            setCellsData(data.cellsData)
            setWinningCells(data.winningCells)
            setWinner(data.winner)
        })

        socket.on('gameOver', data => {
            setGameStatus(data.msg);
            setGameOver(true)
            setCellsData(data.cellsData)
        })

        socket.on('opponentLeft', data => {
            setOpponentLeft(data.msg);
        })

    }, [])

    const newGameHandler = () => {
        socket.disconnect();
        socket.off()
        window.location.reload(true)
    }

    const goBackHandler = () => {
        socket.disconnect();
        socket.off()
        history.goBack()
    }

    const cellClickHandler = (index) => {
        const occupiedCell = cellsData[index].data;
        if(occupiedCell) return;         

        socket.emit('makeMove', {
            index, 
            symbol
        })

    }

    if(waiting) return (
        <h2>Waiting for another player... {'  '}
            <Button onClick = {goBackHandler} variant = 'info'>Go Back</Button>
        </h2>
    )

    if(opponentLeft) return (
        <h2>
            {opponentLeft}{'  '}
            <Button onClick = {goBackHandler} variant = 'info'>Go Back</Button>
        </h2>
    )

    return (
        <div className = 'game-screen'>
            <Button onClick = {goBackHandler} variant = 'danger my-1'>Go back</Button>
            
            {opponentName && (
                <div className = 'players-content'>
                    <p className = 'lead'>Player 1:<strong className = 'mx-1' style = {{color: "green"}}>{name}</strong></p>
                    <br /> 
                    <p className = 'lead'>Player 2:<strong className = 'mx-1' style = {{color: "red"}}>{opponentName}</strong></p>
                </div>
            )}
            <h3>Your symbol: <strong>{symbol}</strong></h3>
            <h3>{myTurn ? <span>Your turn</span>: <span style = {{color: '#666'}}>{`${opponentName}'s turn`}</span>}</h3>
            {gameStatus && <h3 style = {{color: winningCells ? winner ? 'green': 'red': ''}}>{gameStatus}</h3>}
            <div style = {{gridTemplateColumns: `repeat(${size}, auto)`}} className = 'cells'>
                {
                    cellsData.map((cell, index) => (
                        <Square 
                        key = {index}
                        signClass = {cell.data}
                        index = {index}
                        onClickHandler = {cellClickHandler}
                        disabled = {winningCells || !myTurn || gameOver}
                        winnerClass = {winningCells ? winningCells.includes(index) ? 'winner': 'loser' : ''}
                        >
                        </Square>
                    ))
                }
            </div>
            <Button variant = 'success my-1' onClick = {newGameHandler}>
                New Game
            </Button>
        </div>
    )
}

export default GameScreen
