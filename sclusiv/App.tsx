
import React, { useState, useEffect } from 'react';
import { User, Post, AppView, Comment, Message } from './types';
import { INITIAL_USER, MOCK_POSTS, MOCK_CHATS, ADMIN_EMAIL } from './constants';
import Layout from './components/Layout';
import Feed from './components/Feed';
import ChatList from './components/ChatList';
import ProfileSettings from './components/ProfileSettings';
import UserProfile from './components/UserProfile';
import Auth from './components/Auth';
import { X, Check } from 'lucide-react';

const STORAGE_KEY = 'sclusiv_user';
const USERS_KEY = 'sclusiv_all_users';
const POSTS_KEY = 'sclusiv_posts';
const MESSAGES_KEY = 'sclusiv_messages';
const ADMIN_PASS = '1995';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>({ ...INITIAL_USER, followRequests: [] });
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [view, setView] = useState<AppView>('TIMELINE');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [directChatUser, setDirectChatUser] = useState<User | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    const savedAllUsers = localStorage.getItem(USERS_KEY);
    const savedPosts = localStorage.getItem(POSTS_KEY);
    const savedMessages = localStorage.getItem(MESSAGES_KEY);

    let usersBase = savedAllUsers ? JSON.parse(savedAllUsers) : [...MOCK_CHATS.map(u => ({...u, followRequests: [], password: '123'})), { ...INITIAL_USER, email: ADMIN_EMAIL, role: 'admin', id: 'admin-master', followRequests: [] }];
    const adminIdx = usersBase.findIndex((u: User) => u.email === ADMIN_EMAIL);
    if (adminIdx === -1) {
      usersBase.push({ ...INITIAL_USER, email: ADMIN_EMAIL, role: 'admin', id: 'admin-master', followRequests: [] });
    } else {
      usersBase[adminIdx].role = 'admin';
    }
    setAllUsers(usersBase);
    setPosts(savedPosts ? JSON.parse(savedPosts) : MOCK_POSTS);
    setAllMessages(savedMessages ? JSON.parse(savedMessages) : []);
    
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      const synced = usersBase.find((u: User) => u.id === parsed.id);
      if (synced && !synced.isBanned) {
        setCurrentUser(synced);
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (allUsers.length > 0) localStorage.setItem(USERS_KEY, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages));
  }, [allMessages]);

  const handleLogin = (id: string, password?: string) => {
    if (id === ADMIN_EMAIL && password === ADMIN_PASS) {
      const adminUser = allUsers.find(u => u.email === ADMIN_EMAIL) || { ...INITIAL_USER, email: ADMIN_EMAIL, role: 'admin', id: 'admin-master', followRequests: [] };
      setCurrentUser(adminUser);
      setIsLoggedIn(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser));
      return;
    }
    const existing = allUsers.find(u => u.email === id || u.phone === id);
    if (existing) {
      if (existing.isBanned) return alert("Sua conta foi banida.");
      if (existing.password !== password) return alert("Senha incorreta.");
      setCurrentUser(existing);
      setIsLoggedIn(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } else {
      alert("Usuário não encontrado.");
    }
  };

  const handleRegister = (userData: Partial<User>) => {
    if (userData.email === ADMIN_EMAIL) return;
    const newUser: User = {
      ...INITIAL_USER,
      id: `user-${Date.now()}`,
      name: userData.name || 'New User',
      email: userData.email || '',
      phone: userData.phone || '',
      password: userData.password || '',
      avatar: userData.avatar || `https://picsum.photos/seed/${userData.name}/200/200`,
      role: 'user',
      credits: 1000,
      following: [],
      followRequests: [],
      nameChangeHistory: [],
    };
    setAllUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    let finalCredits = currentUser.credits;
    let finalNameHistory = [...currentUser.nameChangeHistory];

    if (updates.name && updates.name !== currentUser.name && currentUser.email !== ADMIN_EMAIL) {
      if (currentUser.credits < 100) return alert("Créditos insuficientes.");
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      if (currentUser.nameChangeHistory.filter(d => new Date(d) >= monthStart).length >= 3) return alert("Limite mensal atingido.");
      finalCredits -= 100;
      finalNameHistory.push(now.toISOString());
    }

    if ((updates.email && updates.email !== currentUser.email) || 
        (updates.phone && updates.phone !== currentUser.phone) ||
        (updates.password && updates.password !== currentUser.password)) {
      if (currentUser.email !== ADMIN_EMAIL) {
        if (currentUser.credits < 100) return alert("Créditos insuficientes para alterar dados de acesso (100 CR).");
        finalCredits -= 100;
      }
    }

    const updated = { ...currentUser, ...updates, credits: finalCredits, nameChangeHistory: finalNameHistory };
    setCurrentUser(updated);
    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleAdminUpdateUser = (userId: string, updates: Partial<User>) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, ...updates };
        if (userId === currentUser.id) {
          setCurrentUser(updated);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
        return updated;
      }
      return u;
    }));
  };

  const handleSendMessage = (message: Message) => {
    if (currentUser.email !== ADMIN_EMAIL) {
      if (currentUser.credits < 10) return false;
      handleUpdateCredits(currentUser.id, -10);
    }
    setAllMessages(prev => [...prev, message]);
    return true;
  };

  const handleUpdateCredits = (userId: string, amount: number) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, credits: Math.max(0, u.credits + amount) };
        if (userId === currentUser.id) {
          setCurrentUser(updated);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
        return updated;
      }
      return u;
    }));
  };

  const handleSendRequest = (targetId: string) => {
    setAllUsers(prev => prev.map(u => 
      u.id === targetId ? { ...u, followRequests: [...(u.followRequests || []), currentUser.id] } : u
    ));
  };

  const handleAcceptRequest = (requesterId: string) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const updated = { 
          ...u, 
          followRequests: u.followRequests.filter(id => id !== requesterId),
          following: [...u.following, requesterId]
        };
        setCurrentUser(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      }
      if (u.id === requesterId) return { ...u, following: [...u.following, currentUser.id] };
      return u;
    }));
  };

  const handleDeclineRequest = (requesterId: string) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const updated = { ...u, followRequests: u.followRequests.filter(id => id !== requesterId) };
        setCurrentUser(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      }
      return u;
    }));
  };

  return (
    <Layout activeView={view} onNavigate={(v) => { setView(v); setDirectChatUser(null); }} onLogout={() => setIsLoggedIn(false)}>
      {isLoggedIn ? (
        <>
          {currentUser.followRequests?.length > 0 && (
            <div className="mb-6 space-y-2">
              <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest px-4">Solicitações Pendentes</h4>
              {currentUser.followRequests.map(reqId => {
                const requester = allUsers.find(u => u.id === reqId);
                return requester ? (
                  <div key={reqId} className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl flex items-center justify-between mx-2">
                    <div className="flex items-center gap-3">
                      <img src={requester.avatar} className="w-8 h-8 rounded-full object-cover" />
                      <span className="text-xs font-bold text-white uppercase">{requester.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleAcceptRequest(reqId)} className="bg-green-600 p-2 rounded-xl text-white hover:scale-110 transition-transform"><Check size={14}/></button>
                      <button onClick={() => handleDeclineRequest(reqId)} className="bg-zinc-800 p-2 rounded-xl text-zinc-400 hover:text-red-500"><X size={14}/></button>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          )}

          {view === 'TIMELINE' && <Feed user={currentUser} posts={posts} onAddPost={(c, i) => setPosts([{ id: Date.now().toString(), userId: currentUser.id, userName: currentUser.name, userAvatar: currentUser.avatar, content: c, imageUrl: i, timestamp: new Date().toISOString(), likes: 0, comments: [] }, ...posts])} onLikePost={(pid) => setPosts(posts.map(p => p.id === pid ? { ...p, likedByMe: !p.likedByMe, likes: p.likedByMe ? p.likes - 1 : p.likes + 1 } : p))} onAddComment={(pid, t) => setPosts(posts.map(p => p.id === pid ? { ...p, comments: [...p.comments, { id: Date.now().toString(), userId: currentUser.id, userName: currentUser.name, text: t, timestamp: new Date().toISOString() }] } : p))} onViewProfile={(uid) => { setSelectedUserId(uid); setView('USER_PROFILE'); }} onImageClick={setExpandedImage} />}
          {view === 'CHAT' && <ChatList currentUser={currentUser} onViewProfile={(uid) => { setSelectedUserId(uid); setView('USER_PROFILE'); }} directChatUser={directChatUser} messages={allMessages} onSendMessage={handleSendMessage} adminUser={allUsers.find(u => u.email === ADMIN_EMAIL)!} />}
          {view === 'PROFILE' && <ProfileSettings user={currentUser} posts={posts.filter(p => p.userId === currentUser.id)} allUsers={allUsers} onUpdateUser={handleUpdateUser} onAdminUpdateUser={handleAdminUpdateUser} onDeletePost={(pid) => setPosts(posts.filter(p => p.id !== pid))} onEditPost={(pid, c) => setPosts(posts.map(p => p.id === pid ? { ...p, content: c } : p))} onToggleHidePost={(pid) => setPosts(posts.map(p => p.id === pid ? { ...p, isHidden: !p.isHidden } : p))} onAdminAddCredits={handleUpdateCredits} onAdminToggleBan={(uid) => setAllUsers(prev => prev.map(u => u.id === uid ? {...u, isBanned: !u.isBanned} : u))} onImageClick={setExpandedImage} />}
          {view === 'USER_PROFILE' && (() => {
            const target = allUsers.find(u => u.id === selectedUserId);
            return target ? <UserProfile currentUser={currentUser} targetUser={target} posts={posts} onFollow={handleSendRequest} onUnfollow={(id) => setCurrentUser({...currentUser, following: currentUser.following.filter(f => f !== id)})} onMessage={(u) => { setDirectChatUser(u); setView('CHAT'); }} onImageClick={setExpandedImage} /> : null;
          })()}
        </>
      ) : (
        <Auth onLogin={handleLogin} onRegister={handleRegister} />
      )}

      {expandedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setExpandedImage(null)}>
          <button className="absolute top-6 right-6 text-white p-2 bg-white/10 rounded-full hover:bg-white/20 z-[110]" onClick={() => setExpandedImage(null)}><X size={28} /></button>
          <img src={expandedImage} className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl animate-in zoom-in-95" alt="Expanded" onClick={(e) => e.stopPropagation()}/>
        </div>
      )}
    </Layout>
  );
};

export default App;
