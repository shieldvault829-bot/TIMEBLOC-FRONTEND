'use client';

import { useState } from 'react';
import { 
  Image, Video, Smile, MapPin, Tag, 
  Globe, Lock, Calendar, X, Send,
  Clock, Users, Eye, EyeOff
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function CreatePage() {
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [scheduledDate, setScheduledDate] = useState('');
  const [audience, setAudience] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const postData = {
        user_id: user.user.id,
        content,
        privacy,
        scheduled_for: scheduledDate || null,
        audience: audience.length > 0 ? audience : null,
        hashtags,
        media_urls: attachments,
        published_at: scheduledDate ? null : new Date().toISOString()
      };

      const { error } = await supabase
        .from('posts')
        .insert([postData]);

      if (error) throw error;

      alert(scheduledDate ? 'Post scheduled!' : 'Post published!');
      setContent('');
      setAttachments([]);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to publish');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHashtag = () => {
    const tag = prompt('Enter hashtag (without #):');
    if (tag && !hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-dark-800 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-dark-700">
            <h1 className="text-2xl font-bold">Create Post</h1>
            <p className="text-gray-400">Share your thoughts with the world</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Text Area */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full h-48 p-4 bg-dark-900 border border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="text-right text-gray-400 text-sm mt-2">
              {content.length}/5000
            </div>

            {/* Privacy Options */}
            <div className="mt-6">
              <h3 className="font-bold mb-3">Privacy Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => setPrivacy('public')}
                  className={`p-4 rounded-xl border-2 text-left ${privacy === 'public' ? 'border-blue-500 bg-blue-500/10' : 'border-dark-700'}`}
                >
                  <Globe className="w-5 h-5 mb-2" />
                  <div className="font-bold">Public</div>
                  <div className="text-sm text-gray-400">Anyone can see</div>
                </button>
                
                <button
                  onClick={() => setPrivacy('private')}
                  className={`p-4 rounded-xl border-2 text-left ${privacy === 'private' ? 'border-blue-500 bg-blue-500/10' : 'border-dark-700'}`}
                >
                  <Lock className="w-5 h-5 mb-2" />
                  <div className="font-bold">Private</div>
                  <div className="text-sm text-gray-400">Only you</div>
                </button>
                
                <button
                  onClick={() => setPrivacy('scheduled')}
                  className={`p-4 rounded-xl border-2 text-left ${privacy === 'scheduled' ? 'border-blue-500 bg-blue-500/10' : 'border-dark-700'}`}
                >
                  <Calendar className="w-5 h-5 mb-2" />
                  <div className="font-bold">Scheduled</div>
                  <div className="text-sm text-gray-400">Auto-publish later</div>
                </button>
              </div>
            </div>

            {/* Schedule Date */}
            {privacy === 'scheduled' && (
              <div className="mt-6">
                <label className="block font-bold mb-2">Schedule Date & Time</label>
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full p-3 bg-dark-900 border border-dark-700 rounded-xl"
                />
              </div>
            )}

            {/* Hashtags */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">Hashtags</h3>
                <button
                  onClick={handleAddHashtag}
                  className="text-blue-400 hover:text-blue-300"
                >
                  + Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                    #{tag}
                    <button onClick={() => setHashtags(hashtags.filter(t => t !== tag))}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-3">
                <button className="p-3 rounded-lg hover:bg-dark-700">
                  <Image className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-lg hover:bg-dark-700">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-lg hover:bg-dark-700">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              
              <button
                onClick={handlePublish}
                disabled={!content.trim() || loading}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold ${content.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 cursor-not-allowed'}`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {privacy === 'scheduled' ? 'Schedule' : 'Publish'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}