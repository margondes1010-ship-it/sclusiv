
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Nova senha para autenticação
  phone?: string;
  avatar: string;
  coverImage?: string;
  sex?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  age?: number;
  location?: string;
  nameChangeHistory: string[];
  following: string[];
  followRequests: string[];
  isPublic: boolean;
  role?: 'admin' | 'user';
  credits: number;
  isBanned?: boolean;
  activeSessions?: { id: string; device: string; location: string; ip: string }[];
  securityLogs?: { id: string; action: string; timestamp: string; status: 'success' | 'warning' | 'error' }[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  imageUrl?: string;
  content: string;
  timestamp: string;
  likes: number;
  likedByMe?: boolean;
  comments: Comment[];
  isHidden?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  imageUrl?: string;
  audioUrl?: string;
  timestamp: string;
}

export type AppView = 'TIMELINE' | 'CHAT' | 'PROFILE' | 'AUTH' | 'USER_PROFILE';
