import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Mic, X, Volume2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// 🔑 Replace this with your actual Google API key
const GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY";

const INITIAL_SYSTEM_PROMPT = `You are an expert educational assistant with deep knowledge in engineering, science, mathematics, and other academic fields. Your role is to:
- Help students understand concepts
- Provide step-by-step solutions
- Offer exam preparation tips
- Answer study-related questions in a clear and supportive way.`;

export default function AIChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 🌟 Function to get AI response using Google's Gemini API
  const generateAIResponse = async (userMessage: string, chatHistory: Message[]) => {
    try {
      const formattedHistory = chatHistory
        .map(msg => `${msg.sender.toUpperCase()}: ${msg.text}`)
        .join('\n');

      const prompt = `${INITIAL_SYSTEM_PROMPT}\n\nChat History:\n${formattedHistory}\n\nUser: ${userMessage}\n\nAssistant:`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GOOGLE_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content;
      } else {
        return "I'm having trouble processing your request. Please try again.";
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "Sorry, I couldn't process your request. Please check your API key and try again.";
    }
  };

  // 🚀 Function to handle sending messages
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
      console.error('Error in chat:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I encountered an error. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 🎤 Voice recognition (speech-to-text)
  const toggleVoiceInput = () => {
    if (!isListening && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      setIsListening(true);
    } else {
      alert('Voice recognition is not supported in this browser.');
    }
  };

  // 🔊 Text-to-speech
  const toggleTextToSpeech = (text: string) => {
    if (!isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);

      utterance.onend = () => {
        setIsSpeaking(false);
      };
    } else {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[500px] flex flex-col">
          <div className="p-4 bg-indigo-600 text-white rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">Educational AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-gray-500 text-center p-4">
                👋 Hi! I'm your AI study buddy. Ask me anything about your studies!
              </div>
            )}
            {messages.map((msg) => (
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
              <div className="text-gray-500 text-center p-4">⏳ Generating response...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask me anything..." className="flex-1 p-2 border rounded-lg" disabled={isLoading} />
              <button onClick={toggleVoiceInput} className="p-2 bg-gray-100 rounded-full"><Mic className="h-5 w-5" /></button>
              <button onClick={handleSend} className="p-2 bg-indigo-600 text-white rounded-full"><Send className="h-5 w-5" /></button>
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-indigo-600 p-3 rounded-full shadow-lg"><MessageCircle className="h-6 w-6 text-white" /></button>
      )}
    </div>
  );
}
