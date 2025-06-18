
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, Loader2, Bot, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getChatResponse, ChatAssistantInputType } from '@/ai/flows/chat-assistant-flow';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export default function AiChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initialAiMessage: ChatMessage = {
    id: `ai-init-${Date.now()}`,
    sender: 'ai',
    text: "היי! אני עוזר ה-AI של LivePick. איך אני יכול לעזור לך היום? אפשר לשאול אותי על הזמנות, איך למצוא מסעדות, או לבקש המלצות!",
    timestamp: new Date(),
  };

  useEffect(() => {
    if (isOpen && chatHistory.length === 0 && !isLoading) {
      setChatHistory([initialAiMessage]);
    }
  }, [isOpen, chatHistory.length, isLoading]);


  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('div > div'); // Adjust selector if needed
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [chatHistory]);
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100); // Delay focus slightly for sheet animation
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userInput,
      timestamp: new Date(),
    };
    setChatHistory(prev => [...prev, newUserMessage]);
    const currentInput = userInput;
    setUserInput('');
    setIsLoading(true);

    try {
      const input: ChatAssistantInputType = { userInput: currentInput };
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call delay
      const result = await getChatResponse(input);
      const aiResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: result.assistantResponse,
        timestamp: new Date(),
      };
      setChatHistory(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting chat response:', error);
      toast({
        title: 'שגיאה',
        description: 'עוזר ה-AI אינו זמין כרגע. אנא נסה שוב מאוחר יותר.',
        variant: 'destructive',
      });
      const errorResponse: ChatMessage = {
        id: `ai-error-${Date.now()}`,
        sender: 'ai',
        text: "מצטער, אני מתקשה להתחבר כרגע. אנא נסה שוב בעוד מספר רגעים.",
        timestamp: new Date(),
      };
      setChatHistory(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="default"
        size="lg"
        className="fixed bottom-6 right-6 rounded-full shadow-xl p-0 h-16 w-16 bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground z-50 transition-all duration-300 hover:scale-110 focus:ring-4 focus:ring-primary/50"
        onClick={() => setIsOpen(true)}
        aria-label="פתח עוזר צ'אט AI"
        title="פתח עוזר צ'אט AI"
      >
        <Bot className="h-8 w-8" /> {/* Slightly larger icon */}
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md flex flex-col p-0 shadow-2xl">
          <SheetHeader className="p-4 sm:p-6 pb-2 border-b bg-muted/30">
            <SheetTitle className="flex items-center text-lg text-primary font-headline">
              <Sparkles className="h-6 w-6 mr-2 text-accent" /> LivePick AI Assistant
            </SheetTitle>
            <SheetDescription className="text-xs sm:text-sm">
              מוכן לעזור לך למצוא, להזמין וליהנות. שאל אותי כל דבר!
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-grow p-4 sm:p-6 space-y-4 bg-background" ref={scrollAreaRef}>
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col mb-3 animate-fadeInUp ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {msg.sender === 'ai' && (
                    <Avatar className="h-8 w-8 border-2 border-primary/50">
                      <AvatarFallback><Bot className="h-5 w-5 text-primary"/></AvatarFallback>
                    </Avatar>
                  )}
                   {msg.sender === 'user' && (
                    <Avatar className="h-8 w-8 border-2 border-accent/50">
                      <AvatarFallback className="bg-accent/20 text-accent-foreground">אני</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[85%] p-3 rounded-xl text-sm shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-foreground rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
                 <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary/70 mr-10' : 'text-muted-foreground/80 ml-10'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </p>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-end gap-2 animate-fadeInUp">
                 <Avatar className="h-8 w-8 border-2 border-primary/50">
                    <AvatarFallback><Bot className="h-5 w-5 text-primary"/></AvatarFallback>
                </Avatar>
                <div className="max-w-[85%] p-3 rounded-xl bg-muted text-muted-foreground flex items-center shadow-sm rounded-bl-none">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> מקליד...
                </div>
              </div>
            )}
          </ScrollArea>

          <SheetFooter className="p-3 sm:p-4 border-t bg-card">
            <div className="flex w-full items-center space-x-2 rtl:space-x-reverse">
              <Input
                ref={inputRef}
                type="text"
                placeholder="לדוגמה: 'מה חדש בפיצריות?'"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                disabled={isLoading}
                className="flex-grow h-11 text-sm"
                aria-label="הקלד את הודעתך כאן"
              />
              <Button onClick={handleSendMessage} disabled={isLoading || !userInput.trim()} aria-label="שלח הודעה" size="lg" className="h-11">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
