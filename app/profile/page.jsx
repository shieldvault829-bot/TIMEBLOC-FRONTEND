'use client';

import { useState, useEffect } from 'react';
import { 
  User, Settings, Edit, Camera, Calendar, 
  MapPin, Link as LinkIcon, Mail, Users, 
  ImageIcon, Video, Heart, MessageSquare,
  Award, Share2, Bell
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import BadgeDisplay from '@/components/BadgeDisplay';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', userData.user.id)
        .single();
      
      setUser(data);
      
      // Fetch user posts
      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });
      
      setPosts(postsData || []);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 relative">
        <button className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-lg text-white">
          <Camera className="w-5 h-5" />
        </button>
      </div>

      <div className="container mx-auto px-4 -mt-16">
        {/* Profile Header */}
        <div className="flex items-end justify-between mb-8">
          <div className="flex items-end">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-dark-900 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-dark-800 rounded-full">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="ml-6 mb-4">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-gray-400">@{user.username}</p>
            </div>
          </div>
          
          <div className="flex gap-3 mb-4">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg"
            >
              <Edit className="w-4 h-4" />
              {isEditing ? 'Save' : 'Edit'}
            </button>
            <button className="p-2 bg-dark-800 rounded-lg">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bio & Info */}
        <div className="bg-dark-800 rounded-2xl p-6 mb-6">
          <p className="text-gray-300 mb-4">{user.bio || 'No bio yet'}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center text-gray-400">
              <MapPin className="w-4 h-4 mr-3" />
              {user.location || 'Not set'}
            </div>
            <div className="flex items-center text-gray-400">
              <Calendar className="w-4 h-4 mr-3" />
              Joined {new Date(user.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center text-gray-400">
              <LinkIcon className="w-4 h-4 mr-3" />
              {user.website || 'No website'}
            </div>
            <div className="flex items-center text-gray-400">
              <Mail className="w-4 h-4 mr-3" />
              {user.email}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-dark-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{user.posts_count || 0}</div>
            <div className="text-gray-400 text-sm">Posts</div>
          </div>
          <div className="bg-dark-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{user.followers_count || 0}</div>
            <div className="text-gray-400 text-sm">Followers</div>
          </div>
          <div className="bg-dark-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{user.following_count || 0}</div>
            <div className="text-gray-400 text-sm">Following</div>
          </div>
          <div className="bg-dark-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{user.referrals_count || 0}</div>
            <div className="text-gray-400 text-sm">Referrals</div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-dark-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Badges</h2>
          <BadgeDisplay userId={user.id} />
        </div>

        {/* Posts Grid */}
        <div>
          <h2 className="text-xl font-bold mb-4">Posts</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-dark-800 rounded-xl overflow-hidden aspect-square relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between text-white text-sm">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" /> {post.likes_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> {post.comments_count}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}