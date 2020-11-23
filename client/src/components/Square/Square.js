import React from 'react'
import './Square.css';

const Square = ({children, onClickHandler, index, disabled, winnerClass, signClass}) => {


    return (
        <div onClick = {() => onClickHandler(index)} className = 'btn-container'>
            <button 
                className = {`${signClass} ${winnerClass}`}
                disabled = {disabled} 
                >
                    {children}
            </button>
        </div>
    )
}

export default Square
