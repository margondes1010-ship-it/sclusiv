
import React from 'react';
import { Home, MessageCircle, User, LogOut } from 'lucide-react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate, onLogout }) => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800 px-4 h-16 flex items-center justify-between max-w-5xl mx-auto w-full">
        <h1 
          className="text-2xl font-black italic tracking-tighter cursor-pointer select-none bg-gradient-to-r from-purple-500 to-red-500 bg-clip-text text-transparent"
          onClick={() => onNavigate('TIMELINE')}
        >
          SCLUSIV
        </h1>
        
        <div className="hidden md:flex items-center space-x-8">
          <button onClick={() => onNavigate('TIMELINE')} className={`transition-all hover:scale-110 ${activeView === 'TIMELINE' ? 'text-red-500' : 'text-zinc-500'}`}>
            <Home size={24} />
          </button>
          <button onClick={() => onNavigate('CHAT')} className={`transition-all hover:scale-110 ${activeView === 'CHAT' ? 'text-purple-500' : 'text-zinc-500'}`}>
            <MessageCircle size={24} />
          </button>
          <button onClick={() => onNavigate('PROFILE')} className={`transition-all hover:scale-110 ${activeView === 'PROFILE' ? 'text-purple-400' : 'text-zinc-500'}`}>
            <User size={24} />
          </button>
          <button onClick={onLogout} className="text-zinc-500 hover:text-red-600 transition-colors">
            <LogOut size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-lg mx-auto md:max-w-4xl md:px-4 py-6 mb-20 md:mb-0">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-lg border-t border-zinc-800 h-16 flex items-center justify-around px-2 z-50">
        <button onClick={() => onNavigate('TIMELINE')} className={`p-2 transition-transform active:scale-90 ${activeView === 'TIMELINE' ? 'text-red-500' : 'text-zinc-500'}`}>
          <Home size={28} />
        </button>
        <button onClick={() => onNavigate('CHAT')} className={`p-2 transition-transform active:scale-90 ${activeView === 'CHAT' ? 'text-purple-500' : 'text-zinc-500'}`}>
          <MessageCircle size={28} />
        </button>
        <button onClick={() => onNavigate('PROFILE')} className={`p-2 transition-transform active:scale-90 ${activeView === 'PROFILE' ? 'text-purple-400' : 'text-zinc-500'}`}>
          <User size={28} />
        </button>
        <button onClick={onLogout} className="p-2 text-zinc-600">
          <LogOut size={28} />
        </button>
      </nav>
    </div>
  );
};

export default Layout;
