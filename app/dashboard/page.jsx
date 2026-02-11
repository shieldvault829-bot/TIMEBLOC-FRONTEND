'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, Users, FileText, Share2, 
  Award, TrendingUp, Clock, Shield,
  Calendar, Image as ImageIcon, Video,
  DollarSign, Target, Zap, Globe
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import BadgeDisplay from '@/components/BadgeDisplay';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    posts: 0,
    followers: 0,
    following: 0,
    referrals: 0,
    monthlyReferrals: 0,
    likes: 0,
    storage: '0/10GB'
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    // Fetch user stats
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.user.id)
      .single();

    if (userData) {
      setStats({
        posts: userData.posts_count || 0,
        followers: userData.followers_count || 0,
        following: userData.following_count || 0,
        referrals: userData.referrals_count || 0,
        monthlyReferrals: userData.monthly_referrals_count || 0,
        likes: userData.likes_received || 0,
        storage: '4.2/10GB'
      });
    }

    // Fetch recent posts
    const { data: posts } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    setRecentPosts(posts || []);

    // Fetch notifications
    const { data: notifs } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    setNotifications(notifs || []);
  };

  const quickActions = [
    { icon: FileText, label: 'New Post', color: 'from-blue-500 to-cyan-500', href: '/create' },
    { icon: Calendar, label: 'Schedule', color: 'from-purple-500 to-pink-500', href: '/create?tab=schedule' },
    { icon: Users, label: 'Invite', color: 'from-green-500 to-emerald-500', href: '/invite' },
    { icon: DollarSign, label: 'Upgrade', color: 'from-amber-500 to-orange-500', href: '/subscriptions' },
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's your activity summary</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-dark-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Total Posts</p>
                <p className="text-3xl font-bold">{stats.posts}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-dark-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Followers</p>
                <p className="text-3xl font-bold">{stats.followers}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-dark-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Referrals</p>
                <p className="text-3xl font-bold">{stats.referrals}</p>
              </div>
              <Share2 className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-dark-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Badges</p>
                <p className="text-3xl font-bold">7</p>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <a
                key={idx}
                href={action.href}
                className={`bg-gradient-to-r ${action.color} rounded-2xl p-6 text-center hover:opacity-90 transition-all`}
              >
                <Icon className="w-8 h-8 mb-3 mx-auto" />
                <div className="font-bold">{action.label}</div>
              </a>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Badges Section */}
          <div className="lg:col-span-2 bg-dark-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Your Badges</h2>
            <BadgeDisplay />
          </div>

          {/* Notifications */}
          <div className="bg-dark-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Recent Notifications</h2>
            <div className="space-y-4">
              {notifications.slice(0, 5).map((notif) => (
                <div key={notif.id} className="p-3 bg-dark-700 rounded-lg">
                  <div className="font-medium">{notif.title}</div>
                  <div className="text-sm text-gray-400">{notif.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="mt-6 bg-dark-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="p-4 bg-dark-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-400">
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${post.privacy === 'public' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {post.privacy}
                  </div>
                </div>
                <p className="mb-2">{post.content?.substring(0, 100)}...</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>❤️ {post.likes_count}</span>
                  <span>💬 {post.comments_count}</span>
                  <span>🔗 {post.shares_count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}