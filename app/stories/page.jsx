'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, X, 
  Heart, MessageSquare, Share2, 
  MoreVertical, Play, Pause 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import StoryViewer from '@/components/StoryViewer';

export default function StoriesPage() {
  const [stories, setStories] = useState([]);
  const [currentStory, setCurrentStory] = useState(0);
  const [currentUser, setCurrentUser] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    const { data: follows } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', (await supabase.auth.getUser()).data.user?.id);

    const followingIds = follows?.map(f => f.following_id) || [];
    
    if (followingIds.length > 0) {
      const { data } = await supabase
        .from('stories')
        .select('*, user:users(id, username, avatar_url)')
        .in('user_id', followingIds)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });
      
      setStories(data || []);
    }
  };

  const handleNext = () => {
    if (currentStory < stories.length - 1) {
      setCurrentStory(currentStory + 1);
    } else if (currentUser < stories.length - 1) {
      setCurrentUser(currentUser + 1);
      setCurrentStory(0);
    }
  };

  const handlePrev = () => {
    if (currentStory > 0) {
      setCurrentStory(currentStory - 1);
    } else if (currentUser > 0) {
      setCurrentUser(currentUser - 1);
      setCurrentStory(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      {stories.length > 0 ? (
        <StoryViewer
          stories={stories}
          currentUser={currentUser}
          currentStory={currentStory}
          onNext={handleNext}
          onPrev={handlePrev}
          onClose={() => window.history.back()}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-6xl mb-4">📱</div>
            <h2 className="text-2xl font-bold mb-2">No Stories Available</h2>
            <p className="text-gray-400">Follow users to see their stories</p>
          </div>
        </div>
      )}
    </div>
  );
}