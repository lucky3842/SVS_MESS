import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
    avatar_initials: string;
  };
}

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMsg = payload.new as Message;
        supabase
          .from('profiles')
          .select('full_name, avatar_initials')
          .eq('id', newMsg.user_id)
          .maybeSingle()
          .then(({ data }) => {
            if (data) {
              setMessages((prev) => [...prev, { ...newMsg, profiles: data }]);
            }
          });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('id, content, created_at, user_id, profiles(full_name, avatar_initials)')
      .order('created_at', { ascending: true });

    if (data) {
      setMessages(data as unknown as Message[]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        content: newMessage,
        user_id: user.id,
      });

    if (!error) {
      setNewMessage('');
    }
  };

  return (
    <Card className="h-[calc(100vh-8rem)] flex flex-col">
      <CardHeader>
        <CardTitle>Group Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No messages yet. Start the conversation!</div>
          ) : (
            messages.map((msg) => {
              const isOwnMessage = msg.user_id === user?.id;
              return (
                <div key={msg.id} className={cn('flex items-end gap-2', isOwnMessage ? 'justify-end' : 'justify-start')}>
                  {!isOwnMessage && (
                    <div className="flex items-center justify-center w-8 h-8 font-bold text-white bg-gray-400 rounded-full">
                      {msg.profiles.avatar_initials}
                    </div>
                  )}
                  <div className={cn('max-w-xs p-3 rounded-lg md:max-w-md', isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
                    {!isOwnMessage && <p className="text-sm font-bold">{msg.profiles.full_name}</p>}
                    <p>{msg.content}</p>
                    <p className="mt-1 text-xs opacity-70">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
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
