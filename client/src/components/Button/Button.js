import React from 'react'
import propTypes from 'prop-types'
import './Button.css'

const Button = ({children, variant, disabled, onClick}) => {
    return (
        <button onClick = {onClick} disabled = {disabled} className = {`custom-button ${variant}`}>
            {children}
        </button>
    )
}

Button.defaultProps = {
    variant: 'success'
}

export default Button
