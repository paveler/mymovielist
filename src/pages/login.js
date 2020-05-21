import { useHistory, useLocation, Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import { useAuth } from "../auth";

import { Loader } from '../components/loader/loader';

export default function LoginPage() {
    let history = useHistory()
    let location = useLocation()

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    let { from } = location.state || { from: { pathname: '/' } }
    const auth = useAuth();

    useEffect(() => {
        if (auth.isAutorised()) {
            history.replace(from);
        }
    })
    let login = (e) => {
        e.preventDefault()
        setLoading(true)
        auth.login(username, password).then(() => {
            history.replace(from);
            setLoading(false)
        }).catch(e => {
            setError("You login or password is incorrect");
            setLoading(false)
        })
        return false
    }

    return (
        <div className="content form">
            {(from.pathname == "/add") ?
            <h1>Please, log in to recommend a movie</h1> :
            <h1>Log in</h1>}
            
            <input type="text" placeholder="login" onChange={(e) => {
                setUsername(e.target.value)
            }} />
            <input type="password" placeholder="password" onChange={(e) => {
                setPassword(e.target.value)
            }} />
            {error && <div className="error">{error}</div>}

            {!loading ? 
            <div>
                <button onClick={login}>Log in</button>
                <Link to="register">Register</Link>
            </div> : <Loader  text='Logging in...'/>}
        </div>
    )
}