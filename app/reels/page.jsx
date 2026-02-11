'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Heart, MessageSquare, Share2, Music, 
  Volume2, VolumeX, Play, Pause,
  ChevronUp, ChevronDown, MoreVertical 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ReelsPage() {
  const [reels, setReels] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState([]);
  const videoRef = useRef(null);

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, user:users(username, avatar_url)')
      .eq('type', 'reel')
      .eq('privacy', 'public')
      .order('created_at', { ascending: false });
    
    setReels(data || []);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reels.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length);
    setIsPlaying(true);
  };

  const toggleLike = () => {
    const newLiked = [...liked];
    newLiked[currentIndex] = !newLiked[currentIndex];
    setLiked(newLiked);
  };

  return (
    <div className="h-screen bg-black overflow-hidden relative">
      {/* Video Container */}
      <div className="relative h-full w-full flex items-center justify-center">
        {/* Simulated Video Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-purple-900/30" />
        
        {/* Reel Content */}
        <div className="relative z-10 max-w-md w-full">
          {/* User Info */}
          <div className="absolute top-4 left-4 text-white">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 mr-3"></div>
              <div>
                <div className="font-bold">@{reels[currentIndex]?.user?.username || 'user'}</div>
                <button className="text-sm bg-white/20 px-3 py-1 rounded-full mt-1">
                  Follow
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6">
            <button onClick={toggleLike} className="flex flex-col items-center">
              <div className="p-3 bg-black/50 rounded-full mb-1">
                <Heart className={`w-6 h-6 ${liked[currentIndex] ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              </div>
              <span className="text-white text-xs">1.2K</span>
            </button>

            <button className="flex flex-col items-center">
              <div className="p-3 bg-black/50 rounded-full mb-1">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xs">245</span>
            </button>

            <button className="flex flex-col items-center">
              <div className="p-3 bg-black/50 rounded-full mb-1">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xs">89</span>
            </button>
          </div>

          {/* Navigation */}
          <button 
            onClick={handlePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 rounded-full text-white"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 rounded-full text-white"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}