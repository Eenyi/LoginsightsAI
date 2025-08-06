import React from 'react'
import "./contact.css"
import store, { setCurrentScreen } from '../../redux/store'
import logo from './../../images/logo.png'


export default function Contact() {
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
                <button onClick={() => handleClick('login')}>Login</button>
                <button onClick={() => handleClick('about')}>About</button>
            </div>
            <div className="wp-login-form">
                <span className="">Contact us</span>
                <div className='wp-contact'>
                    <ul>
                        <li><div>
                            <div><b>M. Sohail Iqbal</b></div>
                            <div>Email Address : <b>msohail@techlogix.com</b></div>
                            <div>Contact Number : <b>03334415532</b></div>
                        </div>
                        </li>
                        <li><div>
                            <div><b>Asim Nazir Mangat</b></div>
                            <div>Email Address : <b>asim.nazir@techlogix.com</b></div>
                            <div>Contact Number : <b>03210649722</b></div>
                        </div>
                        </li>
                        <li><div>
                            <div><b>Hamza Siddique</b></div>
                            <div>Email Address : <b>hamza.siddique@techlogix.com</b></div>
                            <div>Contact Number : <b>03144114564</b></div>
                        </div>
                        </li>
                        <li><div>
                            <div><b>Syed M. Inshal Hussain</b></div>
                            <div>Email Address : <b>inshal.hussain@techlogix.com</b></div>
                            <div>Contact Number : <b>03214060848</b></div>
                        </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}
