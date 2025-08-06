import React, { useState } from 'react'
import './login.css';
import Fetch from '../../resources/fetch'
import apiRoutes from '../../resources/apiUrls'
import store, { setCurrentScreen } from '../../redux/store'
import logo from './../../images/logo.png'




export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');
    function submitLoginRequest(e) {
        e?.preventDefault();
        if (username !== "" && password !== "") {
            Fetch(apiRoutes.LOGIN, "post", JSON.stringify({
                "username": username,
                "password": password,
            }), "json").then(
                (response) => {
                    setUsername("");
                    setPassword("");
                    setStatus(response.message)
                    if (response?.status) {
                        store.dispatch(setCurrentScreen(username))
                    }
                }
            )
        }
            
    }
    const handleClick = (value) => {
        store.dispatch(setCurrentScreen(value))          
    };
  return (
    <>

    <div className="wp-otr-pre-login">
        <div className="wp-inr-pre-login">
            <div className="pre-nav">
                <img src={logo} alt='...'/>
            </div>
            <div className="sub-nav-pre-login">
                <button onClick={() => handleClick('about')}>About</button>
                <button onClick={() => handleClick('contact')}>Contact Us</button>
            </div>
            <div className="wp-login-form">
                <span className="">Login</span>
                <form className="wp-inr-login-form" action="" method="post" onSubmit={submitLoginRequest}>
                    <input 
                        type="text" 
                        id="username" 
                        name="username"
                        placeholder='Username'
                        onChange={(e) => setUsername(e.target.value)}
                        value={username} 
                        required/>
                    <input 
                        type="password" 
                        id="password" 
                        name="password"
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password} 
                        required/>
                    <input className='login-button' type="submit" value="Login"/>
                </form>
            </div>
            <div className="login-msg">{status}</div>
        </div>
    </div>
    </>
  )
}
