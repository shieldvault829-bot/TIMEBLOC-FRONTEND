'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Users, Share2, Award, Plus, Bell, ChevronRight, Heart, MessageSquare, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import BadgeDisplay from '@/components/BadgeDisplay';
import LoadingScreen from '@/components/LoadingScreen';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0, referrals: 0 });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userData) {
        setUser(userData);
        setStats({
          posts: userData.posts_count || 0,
          followers: userData.followers_count || 0,
          following: userData.following_count || 0,
          referrals: userData.referrals_count || 0,
        });
      }

      const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentPosts(posts || []);
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user?.name || 'User'}!</h1>
          <Link href="/create" className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700">
            <Plus className="w-5 h-5" /> Create Post
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={FileText} value={stats.posts} label="Posts" color="blue" />
          <StatCard icon={Users} value={stats.followers} label="Followers" color="green" />
          <StatCard icon={Share2} value={stats.referrals} label="Referrals" color="purple" />
          <StatCard icon={Award} value="7" label="Badges" color="yellow" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-dark-800 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Your Badges</h2>
              <BadgeDisplay />
            </div>

            <div className="bg-dark-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
              {recentPosts.map((post) => (
                <div key={post.id} className="bg-dark-900 rounded-xl p-4 mb-3">
                  <p className="mb-2">{post.content}</p>
                  <div className="flex gap-4 text-sm text-gray-400">
                    <span><Heart className="w-4 h-4 inline" /> {post.likes_count || 0}</span>
                    <span><MessageSquare className="w-4 h-4 inline" /> {post.comments_count || 0}</span>
                    <span><Eye className="w-4 h-4 inline" /> {post.views_count || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-dark-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Notifications</h2>
            <p className="text-gray-400 text-center py-8">No notifications yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color }) {
  return (
    <div className={`bg-gradient-to-br from-${color}-600/20 to-${color}-600/5 rounded-2xl p-6 border border-${color}-500/20`}>
      <Icon className={`w-8 h-8 text-${color}-400 mb-2`} />
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-gray-400">{label}</div>
    </div>
  );
}