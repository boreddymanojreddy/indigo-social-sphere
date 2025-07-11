
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PostCard from '@/components/PostCard';
import CreatePost from '@/components/CreatePost';
import { Users, TrendingUp } from 'lucide-react';

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: string[];
}

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllPosts();
  }, []);

  const loadAllPosts = () => {
    try {
      const allPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      const sortedPosts = allPosts.sort((a: Post, b: Post) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
    setLoading(false);
  };

  const handlePostCreated = () => {
    loadAllPosts();
  };

  const handlePostUpdated = () => {
    loadAllPosts();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <TrendingUp className="text-indigo-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">Monsters Hub</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover what all the monsters are sharing. Join the conversation and connect with our monster community.
        </p>
      </div>

      {/* Create Post (only for logged-in users) */}
      {user && (
        <div className="mb-8">
          <CreatePost onPostCreated={handlePostCreated} />
        </div>
      )}

      {/* Posts */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
              <Users size={40} className="text-indigo-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-4">Be the first monster to share something amazing!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={user?.id || ''}
              onPostUpdated={handlePostUpdated}
              showActions={false}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
