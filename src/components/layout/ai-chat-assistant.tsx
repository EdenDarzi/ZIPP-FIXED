
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, Loader2, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getChatResponse, ChatAssistantInput } from '@/ai/flows/chat-assistant-flow'; // Adjust path as needed
import { ScrollArea } from '../ui/scroll-area';

interface ChatMessage {
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

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newUserMessage: ChatMessage = {
      sender: 'user',
      text: userInput,
      timestamp: new Date(),
    };
    setChatHistory(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const input: ChatAssistantInput = { userInput: newUserMessage.text };
      const result = await getChatResponse(input);
      const aiResponse: ChatMessage = {
        sender: 'ai',
        text: result.assistantResponse,
        timestamp: new Date(),
      };
      setChatHistory(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting chat response:', error);
      toast({
        title: 'Error',
        description: 'AI assistant is currently unavailable. Please try again later.',
        variant: 'destructive',
      });
      const errorResponse: ChatMessage = {
        sender: 'ai',
        text: "Sorry, I couldn't process that. Please try again.",
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
        className="fixed bottom-6 right-6 rounded-full shadow-xl p-4 h-16 w-16 bg-primary hover:bg-primary/90 text-primary-foreground z-50"
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Chat Assistant"
      >
        <Bot className="h-7 w-7" />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
          <SheetHeader className="p-6 pb-2 border-b">
            <SheetTitle className="flex items-center text-primary">
              <Bot className="h-6 w-6 mr-2" /> LivePick AI Ordering Assistant
            </SheetTitle>
            <SheetDescription>
              Ask me anything about food, orders, or find what you crave!
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-grow p-6 space-y-4">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <p>{msg.text}</p>
                   <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/70 text-left'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-muted text-muted-foreground flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Thinking...
                </div>
              </div>
            )}
          </ScrollArea>

          <SheetFooter className="p-4 border-t bg-background">
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="e.g., 'Something light, under $15'"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                disabled={isLoading}
                className="flex-grow"
                aria-label="Chat input"
              />
              <Button onClick={handleSendMessage} disabled={isLoading || !userInput.trim()} aria-label="Send message">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
