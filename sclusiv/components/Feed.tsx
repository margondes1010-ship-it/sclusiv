
import React, { useState } from 'react';
import { Heart, MessageSquare, Send, Camera, Sparkles } from 'lucide-react';
import { Post, User } from '../types';
import { generateSmartCaption } from '../services/geminiService';

interface FeedProps {
  user: User;
  posts: Post[];
  onAddPost: (content: string, image?: string) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onViewProfile: (userId: string) => void;
  onImageClick?: (url: string) => void;
}

const Feed: React.FC<FeedProps> = ({ user, posts, onAddPost, onLikePost, onAddComment, onViewProfile, onImageClick }) => {
  const [newContent, setNewContent] = useState('');
  const [newImage, setNewImage] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewImage(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() && !newImage) return;
    onAddPost(newContent, newImage || undefined);
    setNewContent('');
    setNewImage(null);
  };

  const handleAiImprove = async () => {
    if (!newContent.trim()) return;
    setIsAiLoading(true);
    const improved = await generateSmartCaption(newContent);
    setNewContent(improved);
    setIsAiLoading(false);
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    onAddComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl">
        <div className="flex space-x-4">
          <img 
            src={user.avatar} 
            className="w-12 h-12 rounded-full object-cover border-2 border-purple-500 cursor-pointer" 
            alt="Profile" 
            onClick={() => onViewProfile(user.id)}
          />
          <div className="flex-1 space-y-3">
            <textarea
              placeholder="O que você está pensando?"
              className="w-full bg-transparent border-none focus:ring-0 text-lg resize-none placeholder-zinc-600 text-white"
              rows={2}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            {newImage && (
              <div className="relative group">
                <img src={newImage} className="w-full rounded-2xl object-cover max-h-96 border border-zinc-800 cursor-zoom-in" alt="Preview" onClick={() => onImageClick?.(newImage)} />
                <button 
                  onClick={() => setNewImage(null)}
                  className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110"
                >
                  &times;
                </button>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
              <div className="flex items-center space-x-2">
                <label className="cursor-pointer p-2 hover:bg-zinc-800 rounded-full text-red-500 transition-colors">
                  <Camera size={22} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
                <button 
                  onClick={handleAiImprove}
                  disabled={isAiLoading || !newContent}
                  className={`flex items-center space-x-1 p-2 rounded-xl transition-colors ${isAiLoading ? 'text-zinc-700' : 'text-purple-400 hover:bg-purple-900/20'}`}
                >
                  <Sparkles size={20} className={isAiLoading ? 'animate-pulse' : ''} />
                  <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">IA Caption</span>
                </button>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!newContent.trim() && !newImage}
                className="bg-gradient-to-r from-purple-600 to-red-600 text-white px-8 py-2.5 rounded-full font-bold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Postar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.id} className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src={post.userAvatar} 
                  className="w-11 h-11 rounded-full border-2 border-zinc-800 p-0.5 cursor-pointer hover:border-red-500 transition-colors" 
                  alt={post.userName} 
                  onClick={() => onViewProfile(post.userId)}
                />
                <div className="cursor-pointer" onClick={() => onViewProfile(post.userId)}>
                  <h3 className="font-bold text-sm text-white hover:text-red-400 transition-colors">{post.userName}</h3>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{new Date(post.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            {post.imageUrl && (
              <div className="px-2">
                <img 
                  src={post.imageUrl} 
                  className="w-full aspect-square object-cover rounded-3xl cursor-zoom-in hover:brightness-110 transition-all" 
                  alt="Post content" 
                  onClick={() => onImageClick?.(post.imageUrl!)}
                />
              </div>
            )}

            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => onLikePost(post.id)}
                  className={`transition-colors ${post.likedByMe ? 'text-red-500' : 'text-zinc-400 hover:text-red-500'}`}
                >
                  <Heart size={28} fill={post.likedByMe ? "currentColor" : "none"} />
                </button>
                <button className="text-zinc-400 hover:text-purple-500 transition-colors">
                  <MessageSquare size={28} />
                </button>
                <button className="text-zinc-400 hover:text-red-400 transition-colors">
                  <Send size={28} />
                </button>
              </div>
              <p className="font-black text-sm text-white tracking-tight">{post.likes.toLocaleString()} curtidas</p>
              <div className="space-y-1">
                <p className="text-sm leading-relaxed">
                  <span 
                    className="font-black mr-2 text-purple-400 cursor-pointer hover:underline"
                    onClick={() => onViewProfile(post.userId)}
                  >
                    {post.userName}
                  </span>
                  <span className="text-zinc-300 whitespace-pre-wrap">{post.content}</span>
                </p>
              </div>

              {/* Comments Section */}
              <div className="border-t border-zinc-800 pt-4 space-y-3">
                {post.comments.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                    {post.comments.map(comment => (
                      <p key={comment.id} className="text-xs">
                        <span 
                          className="font-bold text-red-400 mr-2 cursor-pointer hover:underline"
                          onClick={() => onViewProfile(comment.userId)}
                        >
                          {comment.userName}
                        </span>
                        <span className="text-zinc-400">{comment.text}</span>
                      </p>
                    ))}
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <input 
                    type="text" 
                    placeholder="Adicione um comentário..."
                    className="flex-1 bg-black border border-zinc-800 rounded-full px-4 py-2 text-xs text-white focus:ring-1 focus:ring-purple-500 outline-none"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                  />
                  <button 
                    onClick={() => handleCommentSubmit(post.id)}
                    className="text-purple-500 font-bold text-xs px-2"
                  >
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Feed;
