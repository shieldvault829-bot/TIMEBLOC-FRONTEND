'use client';

import { useState, useEffect } from 'react';
import { User, MapPin, Link as LinkIcon, Calendar, Edit, Camera, Heart, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import BadgeDisplay from '@/components/BadgeDisplay';
import LoadingScreen from '@/components/LoadingScreen';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      setUser(userData);

      const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setPosts(posts || []);
    } catch (error) {
      console.error('Profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 relative">
        <button className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-lg">
          <Camera className="w-5 h-5" />
        </button>
      </div>

      <div className="container mx-auto px-4 -mt-16">
        <div className="flex justify-between items-end mb-8">
          <div className="flex items-end gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-dark-900 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-4xl">
                {user.name?.charAt(0)}
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-dark-800 rounded-full">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="mb-4">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-gray-400">@{user.username}</p>
            </div>
          </div>
          <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg mb-4">
            <Edit className="w-4 h-4" /> {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>

        <div className="bg-dark-800 rounded-2xl p-6 mb-6">
          <p className="text-gray-300 mb-4">{user.bio || 'No bio yet'}</p>
          <div className="grid grid-cols-2 gap-4 text-gray-400">
            <div><MapPin className="w-4 h-4 inline mr-2" /> {user.location || 'Not set'}</div>
            <div><Calendar className="w-4 h-4 inline mr-2" /> Joined {new Date(user.created_at).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-dark-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{user.followers_count || 0}</div>
            <div className="text-gray-400">Followers</div>
          </div>
          <div className="bg-dark-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{user.following_count || 0}</div>
            <div className="text-gray-400">Following</div>
          </div>
          <div className="bg-dark-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{posts.length}</div>
            <div className="text-gray-400">Posts</div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Badges</h2>
          <BadgeDisplay />
        </div>

        <h2 className="text-xl font-bold mb-4">Posts</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-dark-800 rounded-xl overflow-hidden aspect-square relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 opacity-0 group-hover:opacity-100 transition">
                <div className="flex justify-between text-white text-sm">
                  <span><Heart className="w-3 h-3 inline" /> {post.likes_count}</span>
                  <span><MessageSquare className="w-3 h-3 inline" /> {post.comments_count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}