import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader, MessageCircle, X } from 'lucide-react';
import axios from 'axios';

const DISCLAIMER =
    'AI-assisted information only. Please consult a healthcare professional for medical decisions.';

const Chatbot = ({ patientId, patientName }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef(null);

    const storageKey = patientId ? `medassist-${patientId}` : 'medassist-general';

    useEffect(() => {
        const saved = sessionStorage.getItem(storageKey);
        if (saved) {
            try {
                setMessages(JSON.parse(saved));
            } catch {
                setMessages([]);
            }
        }
    }, [storageKey]);

    useEffect(() => {
        if (messages.length > 0) {
            sessionStorage.setItem(storageKey, JSON.stringify(messages));
        }
    }, [messages, storageKey]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (isOpen && patientId && messages.length === 0) {
            setMessages([
                {
                    text: patientName
                        ? `Hi! I can answer questions about ${patientName}'s lab reports and health records. What would you like to know?`
                        : "Hi! Ask me about this patient's records.",
                    sender: 'bot',
                },
            ]);
        }
    }, [isOpen, patientId, patientName, messages.length]);

    const sendMessage = async (e) => {
        e.preventDefault();
        const text = input.trim();
        if (!text || isLoading) return;

        setMessages((prev) => [...prev, { text, sender: 'user' }]);
        setInput('');
        setIsLoading(true);

        try {
            const { data } = await axios.post('/en/chatbot', {
                message: text,
                patientId: patientId || null,
                patientName: patientName || null,
            });

            setMessages((prev) => [
                ...prev,
                {
                    text: data.reply || 'No response received.',
                    sender: 'bot',
                    engine: data.engine,
                    sources: data.sources,
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    text: 'Sorry, I could not process your request. Please try again.',
                    sender: 'bot',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleChatbot = () => setIsOpen(!isOpen);

    const title = patientName
        ? `MedAssist — ${patientName}`
        : patientId
          ? 'MedAssist — Patient'
          : 'MedAssist';

    return (
        <>
            {isOpen ? (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h2>{title}</h2>
                        <button
                            type="button"
                            onClick={toggleChatbot}
                            className="chatbot-close-btn"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    {patientId && (
                        <p className="chatbot-disclaimer">{DISCLAIMER}</p>
                    )}
                    <div className="chatbot-messages">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`chatbot-message ${message.sender}`}
                            >
                                {message.text}
                                {message.engine === 'langchain-rag' &&
                                    message.sources?.length > 0 && (
                                        <small className="chatbot-sources">
                                            Retrieved from {message.sources.length}{' '}
                                            record(s)
                                        </small>
                                    )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="chatbot-message bot">
                                <Loader className="animate-spin" size={16} />
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={sendMessage} className="chatbot-input-form">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={
                                patientId
                                    ? 'Ask about lab values, summary, precautions...'
                                    : 'Type your health query...'
                            }
                            className="chatbot-input"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="chatbot-send-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader className="animate-spin" />
                            ) : (
                                <Send size={20} />
                            )}
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={toggleChatbot}
                    className="chatbot-toggle-btn"
                >
                    <MessageCircle size={24} />
                    <span>
                        {patientName
                            ? `Chat about ${patientName}`
                            : 'Chat with MedAssist'}
                    </span>
                </button>
            )}
        </>
    );
};

export default Chatbot;
