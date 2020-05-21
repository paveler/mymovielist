import React from 'react'
import { NavLink } from 'react-router-dom'
import { LogInLogOutButton } from '../loginLogout/loginLogoutButton'
import { useAuth } from '../../auth'
import { Link } from'react-router-dom'

import './menu.css'


export function MainMenu() {
  const authContext = useAuth();
  return (
    <ul className="main-menu">
      <li className="logo">
        MyMovieList
      </li>
      <li>
        <NavLink exact to="/">Watched</NavLink>
      </li>
      <li>
        <NavLink exact to="/towatch">To watch</NavLink>
      </li>
      <li>
        <NavLink exact to="/add">Recommend me a movie</NavLink>
      </li>

      <li className="rihgt-top">
        {!authContext.isAutorised() &&
        <Link to="/register">
          <button>
          Registrer</button></Link>}
        <LogInLogOutButton />
      </li>
    </ul>
  )
}