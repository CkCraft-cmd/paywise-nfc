
import { useState, useRef, useEffect } from "react";
import { MessageCircle, SendHorizontal, X, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: "welcome-msg",
    text: "Hi there! I'm PayBot, your virtual assistant. How can I help you with your PayWise account today?",
    sender: "bot",
    timestamp: new Date(),
  },
];

const suggestedQuestions = [
  "How do I add money to my account?",
  "Where can I use my PayWise account?",
  "How do I report suspicious activity?",
  "What are the payment limits?",
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setIsTyping(true);
    
    // Simulating API call delay
    setTimeout(() => {
      generateBotResponse(userMessage.text);
    }, 1500);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    handleSubmit();
  };

  const generateBotResponse = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    let botResponse = "";
    
    // Simple response logic based on keywords
    if (lowerCaseMessage.includes("add money") || lowerCaseMessage.includes("deposit")) {
      botResponse = "To add money to your account, go to your Balance Card on the home page and tap 'Add Money'. You can add funds using a debit card, bank transfer, or cash deposit at participating locations.";
    } else if (lowerCaseMessage.includes("use") || lowerCaseMessage.includes("where")) {
      botResponse = "You can use your PayWise account at all campus locations, including the cafeteria, bookstore, printing services, and vending machines. Just tap your NFC-enabled device or scan the QR code at checkout!";
    } else if (lowerCaseMessage.includes("suspicious") || lowerCaseMessage.includes("fraud") || lowerCaseMessage.includes("report")) {
      botResponse = "If you notice any suspicious activity, please go to Settings > Security and tap 'Report Suspicious Activity'. You can also freeze your account from the same menu if needed.";
    } else if (lowerCaseMessage.includes("limits") || lowerCaseMessage.includes("maximum")) {
      botResponse = "Standard accounts have a daily spending limit of $500 and a monthly limit of $3,000. You can view or request limit changes in your Profile > Payment Methods section.";
    } else if (lowerCaseMessage.includes("hi") || lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hey")) {
      botResponse = `Hello${user?.full_name ? ' ' + user.full_name : ''}! How can I help you today?`;
    } else {
      botResponse = "I'm not sure I understand. Could you rephrase your question? You can also check out the FAQs in the Settings section for more information.";
    }

    const newBotMessage: Message = {
      id: `bot-${Date.now()}`,
      text: botResponse,
      sender: "bot",
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prevMessages) => [...prevMessages, newBotMessage]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      {/* Chatbot toggle button */}
      <button 
        onClick={toggleChatbot}
        className="fixed bottom-20 right-4 z-50 bg-paywise-blue text-white rounded-full p-3 shadow-lg hover:bg-paywise-darkBlue transition-colors duration-200"
        aria-label="Toggle chatbot"
      >
        <MessageCircle size={24} />
      </button>
      
      {/* Chatbot interface */}
      {isOpen && (
        <div 
          className={cn(
            "fixed right-4 z-50 flex flex-col bg-white rounded-lg shadow-xl transition-all duration-300 ease-in-out w-full max-w-sm",
            isMinimized ? "h-14 bottom-20" : "bottom-28 h-[70vh] max-h-[500px]"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 bg-paywise-blue text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} />
              <h3 className="font-medium">PayWise Assistant</h3>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={toggleMinimize} className="p-1 hover:bg-paywise-darkBlue rounded">
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button onClick={toggleChatbot} className="p-1 hover:bg-paywise-darkBlue rounded">
                <X size={16} />
              </button>
            </div>
          </div>
          
          {/* Messages container */}
          {!isMinimized && (
            <>
              <div className="flex-grow overflow-y-auto p-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={cn(
                      "mb-4 max-w-[85%] rounded-lg p-3",
                      msg.sender === "user" 
                        ? "ml-auto bg-paywise-lightBlue text-gray-800" 
                        : "mr-auto bg-gray-100"
                    )}
                  >
                    <p>{msg.text}</p>
                    <span className="text-xs text-gray-500 mt-1 block">
                      {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-2 items-center mr-auto bg-gray-100 rounded-lg p-3 max-w-[85%]">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"/>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"/>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"/>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Suggested questions */}
              {messages.length <= 2 && (
                <div className="px-4 py-2">
                  <p className="text-sm text-gray-500 mb-2">Suggested questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 text-gray-700 transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Input area */}
              <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
                <Textarea
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="min-h-[50px] max-h-[100px] resize-none flex-grow"
                  rows={1}
                />
                <Button 
                  type="submit" 
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                  className="h-[50px] bg-paywise-blue hover:bg-paywise-darkBlue"
                >
                  <SendHorizontal size={20} />
                </Button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;
