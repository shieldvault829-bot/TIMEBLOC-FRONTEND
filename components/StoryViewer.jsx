'use client';

import { useState, useEffect } from 'react';
import { X, Heart, MessageSquare, Share2, Play, Pause } from 'lucide-react';

export default function StoryViewer({ stories, currentUser, currentStory, onNext, onPrev, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          onNext();
          return 0;
        }
        return p + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, onNext]);

  const story = stories[currentUser];
  if (!story) return null;

  return (
    <div className="relative h-full">
      <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
        {stories.map((_, i) => (
          <div key={i} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white transition-all duration-100" style={{ width: i === currentUser ? `${progress}%` : i < currentUser ? '100%' : '0%' }} />
          </div>
        ))}
      </div>

      <div className="absolute top-4 left-4 flex items-center gap-3 z-10">
        <div className="w-10 h-10 rounded-full border-2 border-white" />
        <div>
          <div className="font-bold">{story.user?.username}</div>
          <div className="text-sm text-white/70">2h ago</div>
        </div>
      </div>

      <button onClick={onClose} className="absolute top-4 right-4 p-2 z-10">
        <X className="w-6 h-6" />
      </button>

      <button onClick={() => setIsPlaying(!isPlaying)} className="absolute bottom-4 left-1/2 -translate-x-1/2 p-3 bg-white/20 backdrop-blur rounded-full">
        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
      </button>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6">
        <button className="p-3 bg-white/20 backdrop-blur rounded-full"><Heart className="w-6 h-6" /></button>
        <button className="p-3 bg-white/20 backdrop-blur rounded-full"><MessageSquare className="w-6 h-6" /></button>
        <button className="p-3 bg-white/20 backdrop-blur rounded-full"><Share2 className="w-6 h-6" /></button>
      </div>

      <div className="absolute inset-y-0 left-0 w-1/3" onClick={onPrev} />
      <div className="absolute inset-y-0 right-0 w-1/3" onClick={onNext} />
    </div>
  );
}