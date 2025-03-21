import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Mic, X, Volume2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Secure API Key from Environment Variables
const API_KEY = "../.env";

// Gemini AI Setup
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const INITIAL_SYSTEM_PROMPT = `You are an expert educational assessment AI assistant. Your role is to:
1. Explain academic concepts in detail
2. Guide students with step-by-step solutions
3. Provide study strategies and exam preparation tips
4. Clarify doubts in a structured manner
5. Offer relevant examples and analogies
Always maintain an encouraging and supportive tone while ensuring academic accuracy.`;

export default function AIChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate AI Response
  const generateAIResponse = async (userMessage: string, chatHistory: Message[]) => {
    try {
      const chat = model.startChat({
        history: chatHistory.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        })),
        generationConfig: { maxOutputTokens: 200 },
      });

      const result = await chat.sendMessage(userMessage);
      return result.response.text();
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "Sorry, I couldn't process your request right now. Please try again.";
    }
  };

  // Handle Message Send
  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(userMessage.text, messages);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: "I encountered an error. Please try again.", sender: 'ai', timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice Recognition (Speech-to-Text)
  const toggleVoiceInput = () => {
    if (!isListening && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results.item(0).item(0).transcript;
        setMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
      setIsListening(true);
    } else {
      alert('Voice recognition is not supported in this browser.');
    }
  };

  // Text-to-Speech
  const toggleTextToSpeech = (text: string) => {
    if (!isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);

      utterance.onend = () => setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[500px] flex flex-col">
          {/* Header */}
          <div className="p-4 bg-indigo-600 text-white rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">Educational AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-gray-500 text-center p-4">👋 Hi! Ask me anything about your studies!</div>
            )}
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <button onClick={() => toggleTextToSpeech(msg.text)} className="text-xs opacity-70 hover:opacity-100">
                      <Volume2 className="h-4 w-4" />
                    </button>
                    <span className="text-xs opacity-70">{msg.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 p-2 border rounded-lg"
                disabled={isLoading}
              />
              <button onClick={toggleVoiceInput} className={`p-2 rounded-full ${isListening ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                <Mic className="h-5 w-5" />
              </button>
              <button onClick={handleSend} disabled={!message.trim()} className="p-2 bg-indigo-600 text-white rounded-full">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-indigo-600 p-3 rounded-full shadow-lg hover:bg-indigo-700">
          <MessageCircle className="h-6 w-6 text-white" />
        </button>
      )}
    </div>
  );
}
