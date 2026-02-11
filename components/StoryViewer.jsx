'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Heart, MessageSquare, Share2, Play, Pause } from 'lucide-react';

export default function StoryViewer({ stories, currentUser, currentStory, onNext, onPrev, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeLeft, setTimeLeft] = useState(100);
  const timerRef = useRef(null);

  const currentStories = stories.filter(s => s.user_id === stories[currentUser]?.user_id);
  const story = currentStories[currentStory];

  useEffect(() => {
    if (isPlaying && story) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            onNext();
            return 100;
          }
          return prev - 1;
        });
      }, 50); // 5 seconds total
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying, story, onNext]);

  if (!story) return null;

  return (
    <div className="relative h-full w-full">
      {/* Story Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50" />
      
      {/* Progress Bars */}
      <div className="absolute top-4 left-4 right-4 flex gap-1">
        {currentStories.map((_, idx) => (
          <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-white ${idx === currentStory && isPlaying ? 'animate-shrink' : ''}`}
              style={{ 
                width: idx === currentStory ? `${timeLeft}%` : idx < currentStory ? '100%' : '0%',
                animationDuration: '5s'
              }}
            />
          </div>
        ))}
      </div>

      {/* Story Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-md w-full text-white p-4">
          {/* User Info */}
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full border-2 border-white mr-3" />
            <div>
              <div className="font-bold">{story.user?.username}</div>
              <div className="text-sm text-white/70">2 hours ago</div>
            </div>
          </div>

          {/* Story Caption */}
          {story.caption && (
            <div className="mb-6">
              <p className="text-lg">{story.caption}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center space-x-6">
            <button className="p-3 bg-white/20 backdrop-blur-lg rounded-full">
              <Heart className="w-6 h-6" />
            </button>
            <button className="p-3 bg-white/20 backdrop-blur-lg rounded-full">
              <MessageSquare className="w-6 h-6" />
            </button>
            <button className="p-3 bg-white/20 backdrop-blur-lg rounded-full">
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation & Controls */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white"
      >
        <X className="w-6 h-6" />
      </button>
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-3 bg-white/20 backdrop-blur-lg rounded-full text-white"
      >
        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
      </button>

      {/* Previous/Next */}
      <div className="absolute inset-y-0 left-0 w-1/3" onClick={onPrev} />
      <div className="absolute inset-y-0 right-0 w-1/3" onClick={onNext} />
    </div>
  );
}