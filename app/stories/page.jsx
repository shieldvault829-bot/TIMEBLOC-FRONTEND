'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import StoryViewer from '@/components/StoryViewer';

export default function StoriesPage() {
  const [stories, setStories] = useState([]);
  const [currentUser, setCurrentUser] = useState(0);
  const [currentStory, setCurrentStory] = useState(0);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    const { data: follows } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', (await supabase.auth.getUser()).data.user?.id);

    if (follows?.length) {
      const { data } = await supabase
        .from('stories')
        .select('*, user:users(username, avatar_url)')
        .in('user_id', follows.map(f => f.following_id))
        .gt('expires_at', new Date().toISOString());

      setStories(data || []);
    }
  };

  const handleNext = () => {
    if (currentStory < stories.length - 1) setCurrentStory(currentStory + 1);
    else if (currentUser < stories.length - 1) {
      setCurrentUser(currentUser + 1);
      setCurrentStory(0);
    }
  };

  const handlePrev = () => {
    if (currentStory > 0) setCurrentStory(currentStory - 1);
    else if (currentUser > 0) {
      setCurrentUser(currentUser - 1);
      setCurrentStory(0);
    }
  };

  if (!stories.length) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <p className="text-gray-400">No stories available</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      <StoryViewer
        stories={stories}
        currentUser={currentUser}
        currentStory={currentStory}
        onNext={handleNext}
        onPrev={handlePrev}
        onClose={() => window.history.back()}
      />
    </div>
  );
}