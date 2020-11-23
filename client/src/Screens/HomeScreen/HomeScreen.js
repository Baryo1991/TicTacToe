import React, { useState } from 'react'
import './HomeScreen.css'
import { Link } from 'react-router-dom'
import Button from '../../components/Button/Button'

const HomeScreen = () => {

    const [name, setName] = useState(null)
    const [boardSize, setBoardSize] = useState(3)
    const [nameError, setNameError] = useState(null);

    const validateInput = (e) => {
        if(!name) {
            setNameError('Name is required')
            setTimeout(() => {
                setNameError(null)
            }, 2500);
            return e.preventDefault() 
        }
    }

    return (
        <div className = 'home-screen'>
            <h1>Welcome to TIC TAC TOE</h1>
            <div className = 'form-container py-3 px-3'>
                    {nameError && <strong style = {{color: "red"}}>{nameError}</strong>}
                    <div className = 'input-wrapper my-2'>
                        <label>Your name: </label>
                        <input 
                            className = 'py-1 px-1'
                            name = 'name' 
                            placeholder = 'Enter your name' 
                            onChange = {({target: {value}}) => setName(value)}
                            required
                            /> 
                    </div>
                    {/* <div className = 'input-wrapper my-2'>
                        <input 
                            className = 'py-1 px-1'
                            name = 'gameSize' 
                            placeholder = 'Enter board size' 
                            onChange = {({target: {value}}) => setBoardSize(value)}
                            required
                            /> 
                    </div> */}

                    <div className = 'input-wrapper my-2'>
                        <label>Choose game size: </label>
                        <select 
                        onChange = {({target: {value}})=> setBoardSize(value)}
                        value = {boardSize}
                        className = 'py-1'>
                            {
                                [...Array(4).keys()].map((x,index) => {
                                    return (
                                        <option key = {x + 2} value = {x + 2}>
                                            { x + 2} X {x + 2}
                                        </option>
                                    )
                                    
                                })
                            }
                        </select>
                    </div>
                    <Link 
                    onClick = {validateInput}
                    to = {`/game?name=${name}&size=${boardSize}`}>
                        <Button 
                            variant = 'info'
                            >
                            Join 
                        </Button>
                    </Link>                   
            </div>
            
        </div>
    )
}

export default HomeScreen
