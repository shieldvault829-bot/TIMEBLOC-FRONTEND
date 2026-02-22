'use client';

import { useState } from 'react';
import { Globe, Lock, Calendar, Send, Image, Video, Smile } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function CreatePage() {
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [scheduledFor, setScheduledFor] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      const postData = {
        user_id: user.user.id,
        content,
        privacy,
        scheduled_for: scheduledFor || null,
        hashtags,
        published_at: scheduledFor ? null : new Date().toISOString()
      };
      await supabase.from('posts').insert([postData]);
      alert('Post created!');
      setContent('');
    } catch (error) {
      alert('Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-dark-800 rounded-2xl p-6">
          <h1 className="text-2xl font-bold mb-6">Create Post</h1>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full h-40 p-4 bg-dark-900 border border-dark-700 rounded-xl mb-4"
          />

          <div className="flex gap-3 mb-4">
            <button onClick={() => setPrivacy('public')} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${privacy === 'public' ? 'bg-blue-600' : 'bg-dark-700'}`}>
              <Globe className="w-4 h-4" /> Public
            </button>
            <button onClick={() => setPrivacy('private')} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${privacy === 'private' ? 'bg-blue-600' : 'bg-dark-700'}`}>
              <Lock className="w-4 h-4" /> Private
            </button>
            <button onClick={() => setPrivacy('scheduled')} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${privacy === 'scheduled' ? 'bg-blue-600' : 'bg-dark-700'}`}>
              <Calendar className="w-4 h-4" /> Schedule
            </button>
          </div>

          {privacy === 'scheduled' && (
            <input
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              className="w-full p-3 bg-dark-900 border border-dark-700 rounded-xl mb-4"
            />
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button className="p-2 rounded-lg hover:bg-dark-700"><Image className="w-5 h-5" /></button>
              <button className="p-2 rounded-lg hover:bg-dark-700"><Video className="w-5 h-5" /></button>
              <button className="p-2 rounded-lg hover:bg-dark-700"><Smile className="w-5 h-5" /></button>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!content || loading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold ${content ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 cursor-not-allowed'}`}
            >
              <Send className="w-4 h-4" />
              {loading ? 'Posting...' : privacy === 'scheduled' ? 'Schedule' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}