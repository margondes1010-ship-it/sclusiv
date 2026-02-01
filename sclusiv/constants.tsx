
import { Post, User } from './types';

// Admin email constant used for governance and access control
export const ADMIN_EMAIL = 'margondes1010@gmail.com';

// Added followRequests: [] to fix missing property error on line 7
export const INITIAL_USER: User = {
  id: 'current-user',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+55 11 99999-9999',
  avatar: 'https://picsum.photos/seed/john/200/200',
  coverImage: 'https://picsum.photos/seed/cover/800/400',
  sex: 'Male',
  age: 28,
  location: 'São Paulo, Brazil',
  nameChangeHistory: [],
  following: [],
  followRequests: [],
  isPublic: true,
  role: 'user',
  credits: 1000,
  isBanned: false,
  activeSessions: [
    { id: 's1', device: 'iPhone 15 Pro', location: 'São Paulo, BR', ip: '191.181.2.1' },
    { id: 's2', device: 'MacBook Air M2', location: 'São Paulo, BR', ip: '191.181.2.1' }
  ],
  securityLogs: [
    { id: 'l1', action: 'Login detectado', timestamp: new Date().toISOString(), status: 'success' },
    { id: 'l2', action: 'Troca de IP detectada', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'warning' },
    { id: 'l3', action: 'Bloqueio de DLP: Arquivo sensível', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'error' }
  ]
};

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    userId: 'user-2',
    userName: 'Alice Smith',
    userAvatar: 'https://picsum.photos/seed/alice/200/200',
    imageUrl: 'https://picsum.photos/seed/travel/600/600',
    content: 'Exploring the mountains today! #nature #hiking',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    likes: 42,
    likedByMe: false,
    comments: [],
  },
  {
    id: '2',
    userId: 'user-3',
    userName: 'Robert Brown',
    userAvatar: 'https://picsum.photos/seed/rob/200/200',
    imageUrl: 'https://picsum.photos/seed/food/600/600',
    content: 'Best burger in town. Highly recommended!',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    likes: 128,
    likedByMe: true,
    comments: [
      { id: 'c1', userId: 'user-2', userName: 'Alice Smith', text: 'Looks delicious!', timestamp: new Date().toISOString() }
    ],
  },
];

export const MOCK_CHATS: User[] = [
  {
    id: 'user-2',
    name: 'Alice Smith',
    email: 'alice@example.com',
    avatar: 'https://picsum.photos/seed/alice/200/200',
    coverImage: 'https://picsum.photos/seed/alice-cover/800/400',
    sex: 'Female',
    age: 24,
    location: 'New York, USA',
    nameChangeHistory: [],
    following: [],
    // Added followRequests: [] to fix missing property error on line 64
    followRequests: [],
    isPublic: true,
    credits: 1000,
    isBanned: false,
  },
  {
    id: 'user-3',
    name: 'Robert Brown',
    email: 'rob@example.com',
    avatar: 'https://picsum.photos/seed/rob/200/200',
    coverImage: 'https://picsum.photos/seed/rob-cover/800/400',
    sex: 'Male',
    age: 32,
    location: 'London, UK',
    nameChangeHistory: [],
    following: [],
    // Added followRequests: [] to fix missing property error on line 79
    followRequests: [],
    isPublic: true,
    credits: 1000,
    isBanned: false,
  },
];
