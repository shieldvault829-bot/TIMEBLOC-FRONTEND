'use client';

import { useState, useEffect, useRef } from 'react';
import { Heart, MessageSquare, Share2, Volume2, VolumeX, Play, Pause } from 'lucide-react';
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
      .order('created_at', { ascending: false });
    setReels(data || []);
  };

  useEffect(() => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.play() : videoRef.current.pause();
    }
  }, [isPlaying, currentIndex]);

  const handleNext = () => setCurrentIndex((currentIndex + 1) % reels.length);
  const handlePrev = () => setCurrentIndex((currentIndex - 1 + reels.length) % reels.length);

  return (
    <div className="h-screen bg-black overflow-hidden relative">
      {reels.map((reel, i) => i === currentIndex && (
        <div key={reel.id} className="absolute inset-0">
          <video
            ref={videoRef}
            src={reel.video_url}
            loop
            muted={isMuted}
            className="w-full h-full object-cover"
          />

          <div className="absolute bottom-20 left-4 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-orange-500" />
              <span className="font-bold">@{reel.user?.username}</span>
              <button className="text-sm bg-white/20 px-3 py-1 rounded-full">Follow</button>
            </div>
            <p>{reel.content}</p>
          </div>

          <div className="absolute bottom-20 right-4 flex flex-col gap-4">
            <button onClick={() => setLiked([...liked, reel.id])}>
              <Heart className={`w-8 h-8 ${liked.includes(reel.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </button>
            <button><MessageSquare className="w-8 h-8 text-white" /></button>
            <button><Share2 className="w-8 h-8 text-white" /></button>
            <button onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX className="w-8 h-8 text-white" /> : <Volume2 className="w-8 h-8 text-white" />}
            </button>
          </div>

          <div className="absolute top-1/2 left-4 transform -translate-y-1/2" onClick={handlePrev}>
            <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center">↑</div>
          </div>
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2" onClick={handleNext}>
            <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center">↓</div>
          </div>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1">
            {reels.map((_, i) => (
              <div key={i} className={`w-1 h-1 rounded-full ${i === currentIndex ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}