import React from 'react';
// import { motion } from 'framer-motion';
import './about.css';
// import Fetch from '../../resources/fetch'
// import apiRoutes from '../../resources/apiUrls'
import store, { setCurrentScreen } from '../../redux/store'
import logo from './../../images/logo.png'
  


export default function About() {
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
                    <button onClick={() => handleClick('contact')}>Contact Us</button>
                </div>
                <div className="wp-login-form">
                    <span className="">About</span>
                    <div className='wp-about'>
                        <b>LogInsightsAI</b> is a cutting-edge generative AI-based tool designed to analyze and troubleshoot various types of application logs seamlessly. Leveraging LLMs and Natural Language Processing. AI LogInsights provides a comprehensive solution for identifying issues, suggesting fixes, and improving system performance and preventive actions.
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}



