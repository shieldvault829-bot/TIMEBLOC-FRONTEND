'use client';

import { useState, useEffect } from 'react';
import { Image, Video, Upload, Lock, Globe, Grid, List, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function GalleryPage() {
  const [files, setFiles] = useState([]);
  const [view, setView] = useState('grid');
  const [privacy, setPrivacy] = useState('all');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const { data: user } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('user_gallery')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });
    setFiles(data || []);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const { data: user } = await supabase.auth.getUser();
    const { data } = await supabase.storage
      .from('gallery')
      .upload(`${user.user.id}/${Date.now()}-${file.name}`, file);
    await supabase.from('user_gallery').insert([{
      user_id: user.user.id,
      file_name: file.name,
      file_url: data.path,
      file_type: file.type.split('/')[0],
      file_size: file.size,
      privacy: 'private'
    }]);
    fetchFiles();
  };

  const filteredFiles = files.filter(f => privacy === 'all' || f.privacy === privacy);

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gallery</h1>
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg cursor-pointer">
            <Upload className="w-4 h-4" /> Upload
            <input type="file" className="hidden" onChange={handleUpload} />
          </label>
        </div>

        <div className="bg-dark-800 rounded-xl p-4 mb-6 flex gap-4">
          <button onClick={() => setView('grid')} className={`p-2 rounded ${view === 'grid' ? 'bg-blue-600' : 'bg-dark-700'}`}>
            <Grid className="w-5 h-5" />
          </button>
          <button onClick={() => setView('list')} className={`p-2 rounded ${view === 'list' ? 'bg-blue-600' : 'bg-dark-700'}`}>
            <List className="w-5 h-5" />
          </button>
          <select onChange={(e) => setPrivacy(e.target.value)} className="ml-auto px-3 py-1 bg-dark-700 rounded">
            <option value="all">All</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        {view === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredFiles.map((file) => (
              <div key={file.id} className="bg-dark-800 rounded-xl overflow-hidden group relative">
                <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  {file.file_type === 'image' && <Image className="w-8 h-8 text-gray-400" />}
                  {file.file_type === 'video' && <Video className="w-8 h-8 text-gray-400" />}
                </div>
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button className="p-2 bg-red-600 rounded-full"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="p-3">
                  <p className="text-sm truncate">{file.file_name}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    {file.privacy === 'private' ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                    {file.privacy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-dark-800 rounded-xl">
            {filteredFiles.map((file) => (
              <div key={file.id} className="p-4 border-b border-dark-700 flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                  {file.file_type === 'image' ? <Image className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{file.file_name}</p>
                  <p className="text-sm text-gray-400">{Math.round(file.file_size / 1024)}KB</p>
                </div>
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  {file.privacy === 'private' ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}