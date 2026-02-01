
import React, { useState, useRef } from 'react';
import { 
  Camera, Edit3, Eye, EyeOff, Save, ShieldAlert, Coins, Search, Unlock, Ban, Image as ImageIcon, Mail, Phone, ShieldCheck, Trash2, Key
} from 'lucide-react';
import { User, Post } from '../types';
import { ADMIN_EMAIL } from '../constants';

interface ProfileSettingsProps {
  user: User;
  posts: Post[];
  allUsers: User[];
  onUpdateUser: (updates: Partial<User>) => void;
  onAdminUpdateUser: (userId: string, updates: Partial<User>) => void;
  onDeletePost: (postId: string) => void;
  onEditPost: (postId: string, newContent: string) => void;
  onToggleHidePost: (postId: string) => void;
  onAdminAddCredits: (userId: string, amount: number, absolute?: boolean) => void;
  onAdminToggleBan: (userId: string) => void;
  onImageClick?: (url: string) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ 
  user, posts, allUsers, onUpdateUser, onAdminUpdateUser, onDeletePost, onEditPost, onToggleHidePost, onAdminAddCredits, onAdminToggleBan, onImageClick
}) => {
  const isAdmin = user.email === ADMIN_EMAIL;
  const [activeTab, setActiveTab] = useState<'profile' | 'admin'>(isAdmin ? 'admin' : 'profile');
  const [searchUser, setSearchUser] = useState('');
  const [creditInput, setCreditInput] = useState<Record<string, string>>({});
  
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Local state for editing credentials
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [tempEmail, setTempEmail] = useState(user.email);
  const [tempPhone, setTempPhone] = useState(user.phone || '');
  const [tempPassword, setTempPassword] = useState(user.password || '');

  // Admin temp states
  const [adminTempUsers, setAdminTempUsers] = useState<Record<string, { email?: string, phone?: string, password?: string }>>({});

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateCredentials = () => {
    if (tempEmail === user.email && tempPhone === user.phone && tempPassword === user.password) return;
    onUpdateUser({ email: tempEmail, phone: tempPhone, password: tempPassword });
  };

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const changesThisMonth = user.nameChangeHistory.filter(d => new Date(d) >= monthStart).length;
  const remainingChanges = Math.max(0, 3 - changesThisMonth);

  const filteredUsers = allUsers.filter(u => u.id !== user.id && (u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase())));

  return (
    <div className="space-y-8 pb-20 max-w-2xl mx-auto">
      {isAdmin && (
        <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800 shadow-xl mx-auto max-w-sm">
          <button onClick={() => setActiveTab('profile')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-zinc-100 text-black' : 'text-zinc-500'}`}>Perfil</button>
          <button onClick={() => setActiveTab('admin')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center space-x-2 ${activeTab === 'admin' ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white' : 'text-zinc-500'}`}><ShieldAlert size={14} /><span>Mestre</span></button>
        </div>
      )}

      {activeTab === 'profile' ? (
        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-zinc-800 overflow-hidden relative">
            <div className="h-40 w-full relative group">
              <img src={user.coverImage || 'https://picsum.photos/seed/default/800/400'} className="w-full h-full object-cover" alt="Cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button onClick={() => coverInputRef.current?.click()} className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:scale-110 transition-transform"><ImageIcon size={24} /></button>
                 <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && onUpdateUser({ coverImage: URL.createObjectURL(e.target.files[0]) })} />
              </div>
            </div>

            <div className="px-8 pb-8 -mt-16 flex flex-col items-center relative z-10">
              <div className="relative group">
                <img src={user.avatar} className="w-32 h-32 rounded-full object-cover border-4 border-zinc-900 shadow-2xl cursor-zoom-in" alt="Avatar" onClick={() => onImageClick?.(user.avatar)} />
                <button onClick={() => avatarInputRef.current?.click()} className="absolute bottom-1 right-1 bg-gradient-to-r from-purple-600 to-red-600 text-white p-2.5 rounded-full hover:scale-110 transition-transform shadow-xl border-2 border-zinc-900"><Camera size={18} /></button>
                <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && onUpdateUser({ avatar: URL.createObjectURL(e.target.files[0]) })} />
              </div>

              <div className="text-center mt-4 space-y-3 w-full max-w-sm">
                {isEditingName ? (
                  <div className="flex flex-col space-y-2 animate-in fade-in zoom-in-95">
                    <input type="text" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-center text-white text-lg font-black outline-none focus:ring-1 focus:ring-red-500" value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus />
                    <div className="flex gap-2 justify-center">
                       <button onClick={() => { onUpdateUser({ name: newName }); setIsEditingName(false); }} className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 shadow-lg"><Save size={12}/> Confirmar (-100 CR)</button>
                       <button onClick={() => { setIsEditingName(false); setNewName(user.name); }} className="bg-zinc-800 text-zinc-400 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase">Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 group cursor-pointer" onClick={() => !isAdmin && setIsEditingName(true)}>
                    <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{user.name}</h2>
                    {!isAdmin && <Edit3 size={16} className="text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </div>
                )}
                
                <div className="bg-black/40 p-5 rounded-3xl border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Segurança & Acesso</span>
                    <Coins size={14} className="text-yellow-500" />
                  </div>
                  <div className="space-y-3">
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input type="email" value={tempEmail} onChange={(e) => setTempEmail(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-zinc-300 outline-none focus:border-red-500" placeholder="E-mail" />
                    </div>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input type="text" value={tempPhone} onChange={(e) => setTempPhone(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-zinc-300 outline-none focus:border-red-500" placeholder="Telefone" />
                    </div>
                    <div className="relative">
                      <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input type="password" value={tempPassword} onChange={(e) => setTempPassword(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-zinc-300 outline-none focus:border-red-500" placeholder="Nova Senha" />
                    </div>
                  </div>
                  {(tempEmail !== user.email || tempPhone !== user.phone || tempPassword !== user.password) && (
                    <button onClick={handleUpdateCredentials} className="w-full bg-zinc-100 text-black py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-white animate-in slide-in-from-top-1 transition-all">
                      <ShieldCheck size={14} /> Atualizar Acesso (-100 CR)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-black italic tracking-tighter text-white uppercase ml-4 border-l-4 border-red-600 pl-4">Minha Galeria</h3>
            <div className="grid grid-cols-1 gap-4">
              {posts.map(post => (
                <div key={post.id} className={`bg-zinc-900 border border-zinc-800 rounded-3xl p-4 flex gap-4 transition-all ${post.isHidden ? 'opacity-50' : ''}`}>
                  {post.imageUrl && <img src={post.imageUrl} className="w-24 h-24 object-cover rounded-2xl cursor-zoom-in hover:brightness-110" alt="" onClick={() => onImageClick?.(post.imageUrl!)} />}
                  <div className="flex-1 flex flex-col justify-between">
                    {editingPostId === post.id ? (
                      <div className="space-y-2">
                        <textarea className="w-full bg-black border border-zinc-800 rounded-xl p-2 text-xs text-white" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                        <div className="flex gap-2">
                           <button onClick={() => { onEditPost(post.id, editContent); setEditingPostId(null); }} className="bg-green-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase">Salvar</button>
                           <button onClick={() => setEditingPostId(null)} className="bg-zinc-800 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase">Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-300 line-clamp-2">{post.content}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                       <button onClick={() => { setEditingPostId(post.id); setEditContent(post.content); }} className="p-2 bg-zinc-800 text-purple-400 rounded-xl hover:bg-zinc-700"><Edit3 size={16} /></button>
                       <button onClick={() => onToggleHidePost(post.id)} className={`p-2 rounded-xl ${post.isHidden ? 'bg-red-900/30 text-red-500' : 'bg-zinc-800 text-zinc-400'}`}>{post.isHidden ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                       <button onClick={() => onDeletePost(post.id)} className="p-2 bg-red-900/20 text-red-600 rounded-xl hover:bg-red-600 hover:text-white"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="relative flex items-center space-x-4 mb-8">
              <div className="p-3 bg-red-600/20 rounded-2xl text-red-500"><ShieldAlert size={32} /></div>
              <div>
                <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase">SCLUSIV MASTER PANEL</h3>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Sessão: {user.email}</p>
              </div>
            </div>

            <div className="relative mb-6">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="text" placeholder="Buscar usuário na base de dados..." className="w-full bg-black border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:ring-2 focus:ring-red-600 outline-none" value={searchUser} onChange={(e) => setSearchUser(e.target.value)} />
            </div>

            <div className="space-y-4 max-h-[650px] overflow-y-auto custom-scrollbar pr-2">
              {filteredUsers.map(u => (
                <div key={u.id} className={`p-5 rounded-3xl border transition-all ${u.isBanned ? 'bg-red-950/10 border-red-900/50 grayscale' : 'bg-black/40 border-zinc-800'}`}>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img src={u.avatar} className="w-12 h-12 rounded-full border-2 border-zinc-800" alt="" />
                        <div>
                          <p className="text-sm font-black text-white uppercase tracking-tight">{u.name}</p>
                          <p className="text-[10px] font-bold text-zinc-500 tracking-wider">ID: {u.id}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-yellow-500 uppercase">{u.credits} CRÉDITOS</span>
                        {u.isBanned && <span className="text-[8px] font-black text-red-600 uppercase">BLOQUEADO</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <input type="email" placeholder="E-mail" value={adminTempUsers[u.id]?.email ?? u.email} onChange={(e) => setAdminTempUsers({...adminTempUsers, [u.id]: { ...(adminTempUsers[u.id] || {}), email: e.target.value }})} className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-[10px] text-zinc-300 outline-none focus:border-red-500" />
                      <input type="text" placeholder="Telefone" value={adminTempUsers[u.id]?.phone ?? (u.phone || '')} onChange={(e) => setAdminTempUsers({...adminTempUsers, [u.id]: { ...(adminTempUsers[u.id] || {}), phone: e.target.value }})} className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-[10px] text-zinc-300 outline-none focus:border-red-500" />
                      <input type="text" placeholder="Senha" value={adminTempUsers[u.id]?.password ?? (u.password || '')} onChange={(e) => setAdminTempUsers({...adminTempUsers, [u.id]: { ...(adminTempUsers[u.id] || {}), password: e.target.value }})} className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-[10px] text-zinc-300 outline-none focus:border-red-500" />
                    </div>

                    <div className="flex items-center gap-2 bg-black/40 p-2 rounded-2xl border border-zinc-800">
                      <input type="number" placeholder="Injetar CR" className="bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white w-24 outline-none focus:ring-1 focus:ring-purple-600" value={creditInput[u.id] || ''} onChange={(e) => setCreditInput({ ...creditInput, [u.id]: e.target.value })} />
                      <button onClick={() => { onAdminAddCredits(u.id, parseInt(creditInput[u.id] || '0')); setCreditInput({ ...creditInput, [u.id]: '' }); }} className="flex-1 bg-green-600/20 text-green-500 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-green-600 hover:text-white transition-all">OK</button>
                      
                      {adminTempUsers[u.id] && (
                        <button onClick={() => { onAdminUpdateUser(u.id, adminTempUsers[u.id]!); setAdminTempUsers(prev => { const n = {...prev}; delete n[u.id]; return n; }); }} className="bg-zinc-100 text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-white transition-all">Salvar</button>
                      )}

                      <button onClick={() => onAdminToggleBan(u.id)} className={`p-2 rounded-xl transition-all ${u.isBanned ? 'bg-green-600 text-white' : 'bg-zinc-800 text-red-600 hover:bg-red-600'}`}>{u.isBanned ? <Unlock size={16} /> : <Ban size={16} />}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
