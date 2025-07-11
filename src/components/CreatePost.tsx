
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Image, Send, X } from 'lucide-react';

interface CreatePostProps {
  onPostCreated: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    setLoading(true);

    try {
      const newPost = {
        id: Date.now().toString(),
        userId: user?.id || '',
        userName: user?.name || 'Anonymous',
        userAvatar: user?.avatar || 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=400&fit=crop&crop=face',
        content: content.trim(),
        image: image || undefined,
        timestamp: new Date().toISOString(),
        likes: []
      };

      const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      existingPosts.unshift(newPost);
      localStorage.setItem('posts', JSON.stringify(existingPosts));

      setContent('');
      setImage(null);
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
    }

    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6">
      <div className="flex items-start space-x-4">
        <img
          src={user.avatar || 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=400&fit=crop&crop=face'}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        
        <form onSubmit={handleSubmit} className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full resize-none border-none focus:ring-0 text-lg placeholder-gray-500 bg-transparent"
            rows={3}
          />
          
          {image && (
            <div className="relative mt-4">
              <img
                src={image}
                alt="Upload preview"
                className="max-h-64 rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 bg-gray-900/50 text-white rounded-full p-1 hover:bg-gray-900/70 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 cursor-pointer transition-colors">
                <Image size={20} />
                <span className="text-sm font-medium">Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            
            <button
              type="submit"
              disabled={(!content.trim() && !image) || loading}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send size={16} />
              )}
              <span className="font-medium">Post</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
