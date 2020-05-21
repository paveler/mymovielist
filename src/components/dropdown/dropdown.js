import React from 'react'
import './dropdown.css'

export function Dropdown(props) {
    return (
        <div className="dropdown" onClick={props.onClick}></div>
    )
}