
import React, { useState } from 'react';
import { Mail, Phone, ArrowRight, Github, User as UserIcon, MapPin, Calendar, Heart, Lock } from 'lucide-react';
import { User } from '../types';
// Import ADMIN_EMAIL from constants
import { ADMIN_EMAIL } from '../constants';

interface AuthProps {
  onLogin: (identifier: string, password?: string) => void;
  onRegister: (userData: Partial<User>) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<User['sex']>('Prefer not to say');
  const [location, setLocation] = useState('');

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!input) {
      setError('Por favor, insira um e-mail ou telefone');
      return;
    }

    // Check for admin login attempt using centralized constant
    if (input === ADMIN_EMAIL && !password) {
      setError('Senha necessária para conta administrativa');
      return;
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    const isPhone = /^\+?[\d\s-]{10,}$/.test(input);

    if (!isEmail && !isPhone) {
      setError('Insira um e-mail ou telefone válido');
      return;
    }

    if (isRegistering) {
      if (!name) {
        setError('Por favor, insira seu nome completo');
        return;
      }
      onRegister({
        name,
        email: isEmail ? input : '',
        phone: isPhone ? input : '',
        age: parseInt(age) || 0,
        sex,
        location,
        avatar: `https://picsum.photos/seed/${name}/200/200`,
      });
    } else {
      onLogin(input, password);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black">
      <div className="w-full max-w-md space-y-8 p-8 md:p-10 bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-red-600 to-purple-600"></div>
        
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-black italic tracking-tighter bg-gradient-to-r from-purple-500 to-red-500 bg-clip-text text-transparent">
            SCLUSIV
          </h1>
          <p className="text-zinc-400 font-medium text-sm">
            {isRegistering ? 'Crie sua nova conta premium' : 'Acesse o sistema de governança'}
          </p>
        </div>

        <form onSubmit={handleAction} className="space-y-4">
          {isRegistering && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                  <UserIcon size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Nome Completo"
                  className="block w-full pl-12 pr-4 py-4 bg-black border border-zinc-800 rounded-2xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Idade" className="block w-full px-4 py-4 bg-black border border-zinc-800 rounded-2xl text-sm text-white outline-none" value={age} onChange={(e) => setAge(e.target.value)} />
                <select className="block w-full px-4 py-4 bg-black border border-zinc-800 rounded-2xl text-sm text-white outline-none appearance-none" value={sex} onChange={(e) => setSex(e.target.value as any)}>
                  <option value="Male">Masculino</option>
                  <option value="Female">Feminino</option>
                  <option value="Prefer not to say">Sexo</option>
                </select>
              </div>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
              {input.includes('@') ? <Mail size={18} /> : <Phone size={18} />}
            </div>
            <input
              type="text"
              placeholder="E-mail ou Telefone"
              className="block w-full pl-12 pr-4 py-4 bg-black border border-zinc-800 rounded-2xl text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all text-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {(input === ADMIN_EMAIL || !isRegistering) && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                <Lock size={18} />
              </div>
              <input
                type="password"
                placeholder="Senha"
                className="block w-full pl-12 pr-4 py-4 bg-black border border-zinc-800 rounded-2xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest px-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-red-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest flex items-center justify-center space-x-2 hover:opacity-90 transform active:scale-[0.98] transition-all shadow-2xl"
          >
            <span>{isRegistering ? 'Criar Acesso' : 'Entrar no Sistema'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="text-center pt-4">
          <button
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
          >
            {isRegistering ? 'Já possui acesso? Conecte-se' : "Não possui acesso? Solicite agora"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
