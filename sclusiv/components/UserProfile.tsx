
import React from 'react';
import { User, Post } from '../types';
import { MessageCircle, UserPlus, UserMinus, Lock, MapPin, Calendar, Heart, Hourglass } from 'lucide-react';

interface UserProfileProps {
  currentUser: User;
  targetUser: User;
  posts: Post[];
  onFollow: (userId: string) => void;
  onUnfollow: (userId: string) => void;
  onMessage: (user: User) => void;
  onImageClick?: (url: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  currentUser, 
  targetUser, 
  posts, 
  onFollow, 
  onUnfollow, 
  onMessage,
  onImageClick
}) => {
  const isFollowing = currentUser.following.includes(targetUser.id);
  const isRequested = targetUser.followRequests?.includes(currentUser.id);
  const userPosts = posts.filter(p => p.userId === targetUser.id);
  
  return (
    <div className="bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-zinc-800 overflow-hidden max-w-2xl mx-auto mb-10">
      <div className="h-48 w-full relative">
        <img src={targetUser.coverImage || 'https://picsum.photos/seed/default/800/400'} className="w-full h-full object-cover" alt="Cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
      </div>

      <div className="px-8 pb-12 -mt-20 relative z-10 space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-r ${isFollowing ? 'from-green-500 to-emerald-500' : 'from-purple-600 to-red-600'} rounded-full blur-xl opacity-40 transition-opacity`}></div>
            <img src={targetUser.avatar} className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-zinc-900 relative z-10 shadow-2xl cursor-zoom-in" alt={targetUser.name} onClick={() => onImageClick?.(targetUser.avatar)} />
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">{targetUser.name}</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {isFollowing ? (
            <button onClick={() => onUnfollow(targetUser.id)} className="flex items-center justify-center space-x-2 bg-zinc-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-zinc-700 transition-all">
              <UserMinus size={16} /> <span>Seguindo</span>
            </button>
          ) : isRequested ? (
            <button className="flex items-center justify-center space-x-2 bg-zinc-800 text-zinc-500 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] cursor-default">
              <Hourglass size={16} /> <span>Aguardando...</span>
            </button>
          ) : (
            <button onClick={() => onFollow(targetUser.id)} className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-red-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:opacity-90 shadow-xl transition-all">
              <UserPlus size={16} /> <span>Seguir</span>
            </button>
          )}
          <button onClick={() => onMessage(targetUser)} className="flex items-center justify-center space-x-2 bg-zinc-100 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-lg">
            <MessageCircle size={16} /> <span>Mensagem</span>
          </button>
        </div>

        <div className="border-t border-zinc-800 pt-8">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6">Publicações</h3>

          {isFollowing ? (
            userPosts.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {userPosts.filter(p => !p.isHidden).map(post => (
                  <div key={post.id} className="aspect-square relative group overflow-hidden rounded-2xl border border-zinc-800 cursor-zoom-in" onClick={() => post.imageUrl && onImageClick?.(post.imageUrl)}>
                    {post.imageUrl ? (
                      <img src={post.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Post" />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center p-3 text-[9px] text-zinc-400 text-center uppercase font-bold italic">{post.content.slice(0, 40)}...</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-black/20 rounded-3xl border border-dashed border-zinc-800">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Nenhuma foto</p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-16 space-y-4 bg-black/40 rounded-3xl border border-zinc-800">
              <div className="p-5 bg-zinc-800 rounded-full text-zinc-500"><Lock size={32} /></div>
              <div className="text-center space-y-1">
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Acesso Restrito</h4>
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest max-w-[180px] mx-auto leading-relaxed">
                  Envie um convite e aguarde a aceitação de {targetUser.name.split(' ')[0]} para visualizar as fotos.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
