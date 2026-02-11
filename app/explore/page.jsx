'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Hash, Users, Video, ImageIcon, Globe, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ExplorePage() {
  const [trending, setTrending] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    // Fetch trending posts
    const { data } = await supabase
      .from('posts')
      .select('*, user:users(username, avatar_url)')
      .eq('privacy', 'public')
      .order('likes_count', { ascending: false })
      .limit(20);
    
    setTrending(data || []);
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore</h1>
          <p className="text-gray-400">Discover trending content and communities</p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search posts, users, or hashtags..."
            className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {['Technology', 'Art', 'Gaming', 'Music', 'Sports', 'Travel', 'Food', 'Fashion'].map((cat) => (
            <div key={cat} className="bg-dark-800 rounded-xl p-6 text-center hover:bg-dark-700 cursor-pointer">
              <div className="text-2xl mb-2">📁</div>
              <h3 className="font-bold">{cat}</h3>
            </div>
          ))}
        </div>

        {/* Trending */}
        <div className="bg-dark-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Trending Now
            </h2>
            <button className="text-blue-400 hover:text-blue-300">View All</button>
          </div>

          <div className="space-y-4">
            {trending.map((post) => (
              <div key={post.id} className="bg-dark-900 rounded-xl p-4 hover:bg-dark-700 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold">@{post.user?.username}</span>
                      <span className="text-gray-400 text-sm">• 2h ago</span>
                    </div>
                    <p className="mb-3">{post.content?.substring(0, 150)}...</p>
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                      <span className="flex items-center gap-1">
                        ❤️ {post.likes_count}
                      </span>
                      <span className="flex items-center gap-1">
                        💬 {post.comments_count}
                      </span>
                      <span className="flex items-center gap-1">
                        🔗 {post.shares_count}
                      </span>
                    </div>
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