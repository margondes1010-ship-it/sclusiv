
import React, { useState, useRef } from 'react';
import { Send, ArrowLeft, MoreVertical, Sparkles, Camera, Mic, Coins, AlertTriangle, User as UserIcon } from 'lucide-react';
import { User, Message } from '../types';
import { MOCK_CHATS } from '../constants';
import { generateSmartReply } from '../services/geminiService';

interface ChatListProps {
  currentUser: User;
  onViewProfile?: (userId: string) => void;
  directChatUser?: User | null;
  messages: Message[];
  onSendMessage: (msg: Message) => boolean;
  adminUser: User;
}

const ChatList: React.FC<ChatListProps> = ({ currentUser, onViewProfile, directChatUser, messages, onSendMessage, adminUser }) => {
  const [selectedChat, setSelectedChat] = useState<User | null>(directChatUser || null);
  const [inputText, setInputText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Filter messages for current chat session
  const activeChatMessages = messages.filter(m => 
    (m.senderId === currentUser.id && m.receiverId === selectedChat?.id) ||
    (m.senderId === selectedChat?.id && m.receiverId === currentUser.id)
  );

  const handleSendMessage = (text?: string, imageUrl?: string, audioUrl?: string) => {
    if (!text?.trim() && !imageUrl && !audioUrl || !selectedChat) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: selectedChat.id,
      text,
      imageUrl,
      audioUrl,
      timestamp: new Date().toISOString(),
    };

    if (onSendMessage(newMessage)) {
      setInputText('');
    }
  };

  const handleAiReply = async () => {
    if (!activeChatMessages.length) return;
    const lastMsg = activeChatMessages[activeChatMessages.length - 1];
    if (lastMsg.senderId === currentUser.id) return;
    
    setIsAiLoading(true);
    const reply = await generateSmartReply(lastMsg.text || 'Olá!');
    setInputText(reply);
    setIsAiLoading(false);
  };

  if (selectedChat) {
    const outOfCredits = currentUser.credits < 10 && currentUser.email !== 'margondes1010@gmail.com';

    return (
      <div className="flex flex-col h-[calc(100vh-140px)] bg-zinc-900 rounded-[2rem] shadow-2xl overflow-hidden md:h-[700px] border border-zinc-800 animate-in fade-in duration-300">
        {/* Chat Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900 shrink-0">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSelectedChat(null)} className="md:hidden text-zinc-400"><ArrowLeft size={24} /></button>
            <div className="relative cursor-pointer" onClick={() => onViewProfile?.(selectedChat.id)}>
              <img src={selectedChat.avatar} className="w-11 h-11 rounded-full border-2 border-red-500 p-0.5" alt={selectedChat.name} />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-zinc-900 rounded-full"></div>
            </div>
            <div className="cursor-pointer" onClick={() => onViewProfile?.(selectedChat.id)}>
              <h3 className="font-bold text-sm text-white hover:text-red-400 transition-colors">{selectedChat.name}</h3>
              <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Ativo Agora</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
             <div className="hidden sm:flex items-center space-x-1 bg-black/40 px-3 py-1 rounded-full border border-zinc-800">
               <Coins size={12} className="text-yellow-500" />
               <span className="text-[10px] font-black text-white">{currentUser.credits}</span>
             </div>
             <button className="text-zinc-600"><MoreVertical size={20} /></button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/40 relative">
          {activeChatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
              <img src={selectedChat.avatar} className="w-24 h-24 rounded-full border-4 border-zinc-800 shadow-2xl" alt="" />
              <div>
                <h4 className="font-black text-xl text-white">{selectedChat.name}</h4>
                <p className="text-sm text-zinc-500 italic">"As palavras têm poder. Comece algo SCLUSIV."</p>
              </div>
            </div>
          ) : (
            activeChatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-5 py-3 rounded-[1.5rem] shadow-xl text-sm leading-relaxed ${msg.senderId === currentUser.id ? 'bg-gradient-to-br from-purple-600 to-red-600 text-white rounded-br-none' : 'bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-bl-none'}`}>
                  {msg.text && <p>{msg.text}</p>}
                  {msg.imageUrl && <img src={msg.imageUrl} className="rounded-xl max-w-full h-auto mt-2" alt="Sent" />}
                  {msg.audioUrl && <audio controls className="mt-2 w-full max-w-[200px] h-8 invert opacity-80"><source src={msg.audioUrl} type="audio/mpeg" /></audio>}
                  <div className={`text-[9px] mt-2 font-bold opacity-50 text-right uppercase tracking-tighter`}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            ))
          )}

          {outOfCredits && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300 z-10">
              <div className="w-20 h-20 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mb-6"><AlertTriangle size={40} /></div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Sem Créditos</h3>
              <p className="text-sm text-zinc-400 mb-8 max-w-xs">Cada mensagem consome 10 CR. Entre em contato com o mestre para recarregar sua conta.</p>
              <button onClick={() => setSelectedChat(adminUser)} className="w-full bg-gradient-to-r from-purple-600 to-red-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 hover:opacity-90 transition-all shadow-2xl"><UserIcon size={16} /><span>Falar com Administrador</span></button>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-5 border-t border-zinc-800 bg-zinc-900 shrink-0">
          <div className="flex items-center space-x-2">
            <button onClick={handleAiReply} disabled={isAiLoading || outOfCredits} className={`p-2 rounded-xl transition-all ${isAiLoading ? 'text-zinc-700' : 'text-purple-400 bg-purple-900/10 hover:bg-purple-900/20'} ${outOfCredits ? 'opacity-20' : ''}`}><Sparkles size={20} className={isAiLoading ? 'animate-spin' : ''} /></button>
            <button disabled={outOfCredits} onClick={() => fileInputRef.current?.click()} className={`p-2 text-zinc-500 hover:text-red-500 transition-colors ${outOfCredits ? 'opacity-20' : ''}`}><Camera size={22} /><input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={(e) => e.target.files?.[0] && handleSendMessage(undefined, URL.createObjectURL(e.target.files[0]))} /></button>
            <button disabled={outOfCredits} onClick={() => audioInputRef.current?.click()} className={`p-2 text-zinc-500 hover:text-purple-500 transition-colors ${outOfCredits ? 'opacity-20' : ''}`}><Mic size={22} /><input type="file" className="hidden" ref={audioInputRef} accept="audio/*" onChange={(e) => e.target.files?.[0] && handleSendMessage(undefined, undefined, URL.createObjectURL(e.target.files[0]))} /></button>
            <input type="text" disabled={outOfCredits} placeholder={outOfCredits ? "Limite atingido" : "Mensagem... (10 CR)"} className="flex-1 bg-black border border-zinc-800 rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all text-white placeholder-zinc-700 disabled:opacity-20" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)} />
            <button onClick={() => handleSendMessage(inputText)} className="bg-red-600 text-white p-3.5 rounded-2xl hover:bg-red-700 transition-all disabled:opacity-20 shadow-lg" disabled={!inputText.trim() || outOfCredits}><Send size={20} /></button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-zinc-800 overflow-hidden">
      <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
        <h2 className="text-2xl font-black italic tracking-tighter bg-gradient-to-r from-purple-500 to-red-500 bg-clip-text text-transparent uppercase tracking-widest">Mensagens</h2>
        <div className="flex items-center space-x-1 bg-black/40 px-3 py-1 rounded-full border border-zinc-800"><Coins size={14} className="text-yellow-500" /><span className="text-xs font-black text-white">{currentUser.credits}</span></div>
      </div>
      <div className="divide-y divide-zinc-800">
        {MOCK_CHATS.map((chat) => (
          <div key={chat.id} className="flex items-center space-x-4 p-5 hover:bg-zinc-800/50 cursor-pointer transition-all active:scale-[0.99]" onClick={() => setSelectedChat(chat)}>
            <div className="relative">
              <img src={chat.avatar} className="w-16 h-16 rounded-full border-2 border-zinc-800 p-0.5" alt={chat.name} onClick={(e) => { e.stopPropagation(); onViewProfile?.(chat.id); }} />
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-zinc-900 rounded-full"></div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-white text-lg">{chat.name}</h3>
                <span className="text-[10px] font-bold text-zinc-600 uppercase">Status: Online</span>
              </div>
              <p className="text-sm text-zinc-500 truncate font-medium">Toque para retomar a conversa</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
