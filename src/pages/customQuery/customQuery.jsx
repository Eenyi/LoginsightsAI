import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './customQuery.css';
import Fetch from '../../resources/fetch'
import apiRoutes from '../../resources/apiUrls'
import { useSelector } from "react-redux";
import store, { setCurrentScreen } from '../../redux/store'
import ReactMarkdown from 'react-markdown';
import TypingBubble from '../../components/typingbubble/TypingBubble';
import logo from './../../images/logo.png'




export default function CustomQuery() {
    const currentScreen = useSelector((state) => state?.currentScreen);
    const loggedUser = useSelector((state) => state?.loggedUser);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);

    const handleSendMessage = () => {
        if (input.trim() !== '') {
            setMessages([...messages, { text: input, sender: 'user' }]);
            setInput('');
        }
    };
    function submitRequest(e) {
        e?.preventDefault();
        setTyping(true);
        if (input !== "") {
            Fetch(apiRoutes.QUERY_PROMPT, "post", JSON.stringify({
                "query": input,
            }), "json").then(
                (response) => {
                    if (response?.status) {
                        setMessages((prevMessages) => [...prevMessages, { text: response.response["response"], sender: 'bot' }]);
                        setInput("");
                        setTyping(false);
                    }
                }
            )
        }
        handleSendMessage();
    }
    const handleClick = (value) => {
        store.dispatch(setCurrentScreen(value))
    };
    return (
        <>
            <div className="dash">
                <div className="nav">
                    <img src={logo} alt='...'/>
                    <div className="wp-user">
                        <div>Welcome! {loggedUser}</div>
                    </div>
                </div>
                <div className="sub-nav">
                    <button onClick={() => handleClick('user')}>Home</button>
                    <button onClick={() => handleClick('login')}>logout</button>
                </div>
                    <div className="chat-container">
                        <div className="chat-input-container">
                            <form className='form-width' action="" method="post" onSubmit={submitRequest}>
                                <input
                                    className="chat-input"
                                    type="text"
                                    name="prompt"
                                    placeholder="Type your message..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' ? submitRequest() : null}
                                    required
                                />
                                <input type="submit" className="chat-button" value="Send"></input>
                            </form>
                        </div>

                        <div className="chat-messages-container">
                            {messages.map((message, index) => (
                                <div key={index} className={`chat-message ${message.sender}`}>
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                        <ReactMarkdown className={`chat-bubble ${message.sender}`}>
                                            {message.text}
                                        </ReactMarkdown>
                                    </motion.div>
                                </div>
                            ))}
                            {typing && <TypingBubble/>}
                        </div>
                    </div>
                </div>
        </>
    )
}



