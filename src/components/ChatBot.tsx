import { useState, useRef, useEffect } from "react";
import { MessageCircle, SendHorizontal, X, Minimize2, Maximize2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { fetchChatHistory, saveMessage, clearChatHistory, ChatMessage } from "@/services/chatService";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const initialWelcomeMessage: ChatMessage = {
  id: "welcome-msg",
  user_id: "system",
  text: "Hi there! I'm PayBot, your virtual assistant powered by AI. I can help with PayWise questions or anything else you'd like to know!",
  sender: "bot",
  timestamp: new Date().toISOString(),
};

const suggestedQuestions = [
  "How do I add money to my account?",
  "Where can I use my PayWise account?",
  "Tell me about digital payment security",
  "What's the latest in fintech?",
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialWelcomeMessage]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [useTestMode, setUseTestMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      loadChatHistory();
    }
  }, [user?.id]);

  const loadChatHistory = async () => {
    if (!user?.id) return;
    
    setIsLoadingHistory(true);
    try {
      const history = await fetchChatHistory(user.id, useTestMode);
      
      if (history.length > 0) {
        setMessages([initialWelcomeMessage, ...history]);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive",
      });
      setUseTestMode(true);
    } finally {
      setIsLoadingHistory(false);
    }
  };

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

  const handleClearChat = async () => {
    if (!user?.id) return;
    
    try {
      await clearChatHistory(user.id, useTestMode);
      setMessages([initialWelcomeMessage]);
      toast({
        title: "Chat Cleared",
        description: "Your chat history has been cleared",
      });
    } catch (error) {
      console.error("Failed to clear chat history:", error);
      toast({
        title: "Error",
        description: "Failed to clear chat history",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputValue.trim() || !user?.id) return;
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      user_id: user.id,
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setIsTyping(true);
    
    try {
      await saveMessage(userMessage, useTestMode);
      
      const response = await generateGPTResponse(userMessage.text);
      
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        user_id: user.id,
        text: response,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      
      await saveMessage(botMessage, useTestMode);
      
      setIsTyping(false);
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      setIsTyping(false);
      
      const errorMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        user_id: user.id,
        text: "I'm having trouble connecting right now. Let me try to help with what I know about PayWise.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      
      await saveMessage(errorMessage, useTestMode);
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      
      generateFallbackResponse(userMessage.text);
      
      toast({
        title: "Connection Issue",
        description: "Could not connect to AI service. Using local responses.",
        variant: "destructive",
      });
    }
  };

  const generateGPTResponse = async (userMessage: string): Promise<string> => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes("add money") || lowerCaseMessage.includes("deposit")) {
      return "To add money to your account, go to your Balance Card on the home page and tap 'Add Money'. You can add funds using a debit card, bank transfer, or cash deposit at participating locations.";
    } else if (lowerCaseMessage.includes("use") && lowerCaseMessage.includes("where")) {
      return "You can use your PayWise account at all campus locations, including the cafeteria, bookstore, printing services, and vending machines. Just tap your NFC-enabled device or scan the QR code at checkout!";
    } else if (lowerCaseMessage.includes("suspicious") || lowerCaseMessage.includes("fraud") || lowerCaseMessage.includes("report")) {
      return "If you notice any suspicious activity, please go to Settings > Security and tap 'Report Suspicious Activity'. You can also freeze your account from the same menu if needed.";
    } else if (lowerCaseMessage.includes("limits") || lowerCaseMessage.includes("maximum")) {
      return "Standard accounts have a daily spending limit of $500 and a monthly limit of $3,000. You can view or request limit changes in your Profile > Payment Methods section.";
    } else if (lowerCaseMessage.includes("hi") || lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hey")) {
      return `Hello${user?.full_name ? ' ' + user.full_name : ''}! How can I help you today?`;
    }
    
    try {
      if (!useTestMode) {
        try {
          const { data, error } = await supabase.functions.invoke("chat-gpt", {
            body: { 
              message: userMessage,
              userId: user?.id || "anonymous"
            }
          });
          
          if (error) throw error;
          if (data && data.response) {
            return data.response;
          }
          
          throw new Error("Invalid response format");
        } catch (error) {
          console.warn("Edge function error, falling back to simulated response:", error);
          setUseTestMode(true);
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return simulateGPTResponse(userMessage);
    } catch (error) {
      console.error("Error calling GPT API:", error);
      throw new Error("Failed to generate response");
    }
  };

  const simulateGPTResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes("weather")) {
      return "I don't have access to real-time weather data, but you can check your local weather app or website for the most accurate forecast.";
    } else if (lowerCaseMessage.includes("time") && lowerCaseMessage.includes("now")) {
      return `The current time is ${new Date().toLocaleTimeString()}.`;
    } else if (lowerCaseMessage.includes("digital payment") || lowerCaseMessage.includes("security")) {
      return "Digital payment security involves multiple layers of protection including encryption, tokenization, and biometric authentication. Always use strong passwords, enable two-factor authentication, and monitor your accounts regularly for suspicious activity.";
    } else if (lowerCaseMessage.includes("fintech") || lowerCaseMessage.includes("financial technology")) {
      return "Fintech continues to evolve rapidly with innovations in blockchain, AI-powered financial advice, contactless payments, and decentralized finance (DeFi). Mobile payment solutions and digital wallets like PayWise are becoming increasingly popular, especially among younger users.";
    } else if (lowerCaseMessage.includes("blockchain") || lowerCaseMessage.includes("crypto")) {
      return "Blockchain technology provides a decentralized and secure way to record transactions. It's the foundation for cryptocurrencies like Bitcoin and Ethereum, but has many other applications in finance, supply chain management, and digital identity verification.";
    } else if (lowerCaseMessage.includes("budget") || lowerCaseMessage.includes("saving") || lowerCaseMessage.includes("save money")) {
      return "Creating a budget is key to financial health. Track your income and expenses, set realistic saving goals, reduce unnecessary spending, and consider automating your savings. The PayWise app can help you track your spending patterns.";
    } else {
      return "That's an interesting question. While I don't have all the information at hand, I'd be happy to help you find more resources on this topic or answer any PayWise-related questions you might have.";
    }
  };

  const generateFallbackResponse = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    let botResponse = "";
    
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

    const newBotMessage: ChatMessage = {
      id: `bot-fallback-${Date.now()}`,
      user_id: user?.id || "anonymous",
      text: botResponse,
      sender: "bot",
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newBotMessage]);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    handleSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!user) return null;

  return (
    <>
      <button 
        onClick={toggleChatbot}
        className="fixed bottom-20 right-4 z-50 bg-paywise-blue text-white rounded-full p-3 shadow-lg hover:bg-paywise-darkBlue transition-colors duration-200"
        aria-label="Toggle chatbot"
      >
        <MessageCircle size={24} />
      </button>
      
      {isOpen && (
        <div 
          className={cn(
            "fixed right-4 z-50 flex flex-col bg-white rounded-lg shadow-xl transition-all duration-300 ease-in-out w-full max-w-sm",
            isMinimized ? "h-14 bottom-20" : "bottom-28 h-[70vh] max-h-[500px]"
          )}
        >
          <div className="flex items-center justify-between p-3 bg-paywise-blue text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} />
              <h3 className="font-medium">PayWise AI Assistant</h3>
            </div>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={handleClearChat} className="p-1 hover:bg-paywise-darkBlue rounded">
                      <Trash2 size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear chat history</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <button onClick={toggleMinimize} className="p-1 hover:bg-paywise-darkBlue rounded">
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button onClick={toggleChatbot} className="p-1 hover:bg-paywise-darkBlue rounded">
                <X size={16} />
              </button>
            </div>
          </div>
          
          {!isMinimized && (
            <>
              <div className="flex-grow overflow-y-auto p-4">
                {isLoadingHistory && messages.length <= 1 && (
                  <div className="flex justify-center my-4">
                    <div className="animate-spin h-6 w-6 border-2 border-paywise-blue border-t-transparent rounded-full"></div>
                  </div>
                )}
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
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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
              
              <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
                <Textarea
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
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
