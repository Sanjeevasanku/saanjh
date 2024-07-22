import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader, MessageCircle, X, User, Bot } from 'lucide-react';
import axios from 'axios';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, newMessage]);
        setInput('');
        setIsLoading(true);

        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const data = await axios.post('/en/chatbot', {
            message: input,
        });

        let botResponse;
        botResponse = {
            text: data.data.reply,
            sender: 'bot'
        };

        setMessages(prev => [...prev, botResponse]);
        setIsLoading(false);
    };

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    // return (
    //     <>
    //       {isOpen ? (
    //         <div className="chatbot-window">
    //           <div className="chatbot-header">
    //             <div className="chatbot-title">
    //               <MessageCircle size={20} />
    //               <span>MedAssist</span>
    //             </div>
    //             <button onClick={toggleChatbot} className="chatbot-close-btn">
    //               <X size={20} />
    //             </button>
    //           </div>
    //           <div className="chatbot-messages">
    //             {messages.map((message, index) => (
    //               <div key={index} className={`chat-bubble ${message.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
    //                 {message.text}
    //               </div>
    //             ))}
    //             <div ref={messagesEndRef} />
    //           </div>
    //           <form onSubmit={sendMessage} className="chatbot-input-area">
    //             <input
    //               type="text"
    //               value={input}
    //               onChange={(e) => setInput(e.target.value)}
    //               placeholder="Ask me about your health..."
    //               className="chatbot-input"
    //             />
    //             <button 
    //               type="submit" 
    //               className="chatbot-send-btn"
    //               disabled={isLoading}
    //             >
    //               {isLoading ? <Loader className="animate-spin" /> : <Send size={20} />}
    //             </button>
    //           </form>
    //         </div>
    //       ) : (
    //         <button
    //           onClick={toggleChatbot}
    //           className="chatbot-trigger"
    //         >
    //           <MessageCircle size={24} />
    //           <span>Chat with MedAssist</span>
    //         </button>
    //       )}
    //     </>
    //   );


    return (
        <>
          {isOpen ? (
            <div className="chatbot-window">
              <div className="chatbot-header">
                <h2>MedAssist</h2>
                <button onClick={toggleChatbot} className="chatbot-close-btn">
                  <X size={20} />
                </button>
              </div>
              <div className="chatbot-messages">
                {messages.map((message, index) => (
                  <div key={index} className={`chatbot-message ${message.sender}`}>
                    {message.text}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={sendMessage} className="chatbot-input-form">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your health query..."
                  className="chatbot-input"
                />
                <button 
                  type="submit" 
                  className="chatbot-send-btn"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader className="animate-spin" /> : <Send size={20} />}
                </button>
              </form>
            </div>
          ) : (
            <button
              onClick={toggleChatbot}
              className="chatbot-toggle-btn"
            >
              <MessageCircle size={24} />
              <span>Chat with MedAssist</span>
            </button>
          )}
        </>
      );
};

export default Chatbot;