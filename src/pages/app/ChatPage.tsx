import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { Message } from '@/lib/types';
import { cn } from '@/lib/utils';

const initialMessages: Message[] = [
  { id: '1', text: 'Hey everyone, how is it going?', sender: 'other', userName: 'Alex', avatar: 'A', timestamp: '10:30 AM' },
  { id: '2', text: 'Going good! Just finished the morning count.', sender: 'me', userName: 'You', avatar: 'Y', timestamp: '10:31 AM' },
  { id: '3', text: 'Great. I have updated the product list. We need to buy more oil.', sender: 'other', userName: 'Maria', avatar: 'M', timestamp: '10:32 AM' },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    const msg: Message = {
      id: new Date().toISOString(),
      text: newMessage,
      sender: 'me',
      userName: 'You',
      avatar: 'Y',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  return (
    <Card className="h-[calc(100vh-8rem)] flex flex-col">
      <CardHeader>
        <CardTitle>Group Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={cn('flex items-end gap-2', msg.sender === 'me' ? 'justify-end' : 'justify-start')}>
              {msg.sender === 'other' && (
                <div className="flex items-center justify-center w-8 h-8 font-bold text-white bg-gray-400 rounded-full">
                  {msg.avatar}
                </div>
              )}
              <div className={cn('max-w-xs p-3 rounded-lg md:max-w-md', msg.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
                <p className="text-sm font-bold">{msg.sender === 'other' ? msg.userName : ''}</p>
                <p>{msg.text}</p>
                <p className="mt-1 text-xs opacity-70">{msg.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <Button type="submit" size="icon">
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
