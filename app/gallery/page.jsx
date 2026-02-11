'use client';

import { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, Video, Music, File, 
  Upload, Grid, List, Filter, Search,
  Lock, Globe, Users, Download,
  Trash2, Eye, EyeOff, MoreVertical
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function GalleryPage() {
  const [files, setFiles] = useState([]);
  const [view, setView] = useState('grid');
  const [selectedPrivacy, setSelectedPrivacy] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    const { data } = await supabase
      .from('user_gallery')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    setFiles(data || []);
  };

  const filteredFiles = files.filter(file => {
    if (selectedPrivacy !== 'all' && file.privacy !== selectedPrivacy) return false;
    if (selectedType !== 'all' && file.file_type !== selectedType) return false;
    return true;
  });

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const { data: user } = await supabase.auth.getUser();
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('user-gallery')
      .upload(`${user.user.id}/${Date.now()}-${file.name}`, file);

    if (error) {
      console.error('Upload error:', error);
      return;
    }

    // Save to gallery table
    await supabase.from('user_gallery').insert([{
      user_id: user.user.id,
      file_name: file.name,
      file_url: data.path,
      file_type: file.type.split('/')[0],
      file_size: file.size,
      privacy: 'private'
    }]);

    fetchFiles(); // Refresh list
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gallery</h1>
            <p className="text-gray-400">Your private storage space</p>
          </div>
          
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700">
            <Upload className="w-4 h-4" />
            Upload File
            <input type="file" className="hidden" onChange={handleUpload} />
          </label>
        </div>

        {/* Filters */}
        <div className="bg-dark-800 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded ${view === 'grid' ? 'bg-blue-600' : 'bg-dark-700'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded ${view === 'list' ? 'bg-blue-600' : 'bg-dark-700'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Privacy Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPrivacy('all')}
                className={`px-3 py-1 rounded ${selectedPrivacy === 'all' ? 'bg-blue-600' : 'bg-dark-700'}`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedPrivacy('private')}
                className={`px-3 py-1 rounded flex items-center gap-2 ${selectedPrivacy === 'private' ? 'bg-blue-600' : 'bg-dark-700'}`}
              >
                <Lock className="w-3 h-3" /> Private
              </button>
              <button
                onClick={() => setSelectedPrivacy('public')}
                className={`px-3 py-1 rounded flex items-center gap-2 ${selectedPrivacy === 'public' ? 'bg-blue-600' : 'bg-dark-700'}`}
              >
                <Globe className="w-3 h-3" /> Public
              </button>
            </div>

            {/* Type Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-3 py-1 rounded ${selectedType === 'all' ? 'bg-blue-600' : 'bg-dark-700'}`}
              >
                All Types
              </button>
              <button
                onClick={() => setSelectedType('image')}
                className={`px-3 py-1 rounded flex items-center gap-2 ${selectedType === 'image' ? 'bg-blue-600' : 'bg-dark-700'}`}
              >
                <ImageIcon className="w-3 h-3" /> Images
              </button>
              <button
                onClick={() => setSelectedType('video')}
                className={`px-3 py-1 rounded flex items-center gap-2 ${selectedType === 'video' ? 'bg-blue-600' : 'bg-dark-700'}`}
              >
                <Video className="w-3 h-3" /> Videos
              </button>
            </div>
          </div>
        </div>

        {/* Files Grid */}
        {view === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredFiles.map((file) => (
              <div key={file.id} className="bg-dark-800 rounded-xl overflow-hidden group relative">
                <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  {file.file_type === 'image' && <ImageIcon className="w-8 h-8 text-gray-400" />}
                  {file.file_type === 'video' && <Video className="w-8 h-8 text-gray-400" />}
                  {file.file_type === 'audio' && <Music className="w-8 h-8 text-gray-400" />}
                  {file.file_type === 'document' && <File className="w-8 h-8 text-gray-400" />}
                </div>
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button className="p-2 bg-blue-600 rounded-full">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-green-600 rounded-full">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-red-600 rounded-full">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-3">
                  <div className="text-sm truncate">{file.file_name}</div>
                  <div className="text-xs text-gray-400">
                    {file.privacy === 'private' ? '🔒 Private' : '🌍 Public'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-dark-800 rounded-2xl overflow-hidden">
            {filteredFiles.map((file) => (
              <div key={file.id} className="p-4 border-b border-dark-700 hover:bg-dark-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    {file.file_type === 'image' && <ImageIcon className="w-6 h-6" />}
                    {file.file_type === 'video' && <Video className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{file.file_name}</div>
                    <div className="text-sm text-gray-400">
                      {file.file_type} • {Math.round(file.file_size / 1024)}KB • {new Date(file.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${file.privacy === 'private' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                      {file.privacy}
                    </span>
                    <button className="p-2 hover:bg-dark-600 rounded">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {files.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-2xl font-bold mb-2">Your gallery is empty</h3>
            <p className="text-gray-400 mb-6">Upload your first file to get started</p>
            <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-lg cursor-pointer">
              <Upload className="w-5 h-5" />
              Upload Files
              <input type="file" multiple className="hidden" onChange={handleUpload} />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}