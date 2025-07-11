
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PostCard from '@/components/PostCard';
import CreatePost from '@/components/CreatePost';
import { User, Calendar } from 'lucide-react';

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

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserPosts();
  }, [user]);

  const loadUserPosts = () => {
    try {
      const allPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      const userPosts = allPosts
        .filter((post: Post) => post.userId === user?.id)
        .sort((a: Post, b: Post) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setPosts(userPosts);
    } catch (error) {
      console.error('Error loading user posts:', error);
    }
    setLoading(false);
  };

  const handlePostCreated = () => {
    loadUserPosts();
  };

  const handlePostDeleted = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handlePostUpdated = () => {
    loadUserPosts();
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
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6 mb-8">
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=400&fit=crop&crop=face'}
            alt={user?.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-600 flex items-center space-x-1 mt-1">
              <User size={16} />
              <span>{user?.email}</span>
            </p>
            <p className="text-sm text-indigo-600 flex items-center space-x-1 mt-2">
              <Calendar size={16} />
              <span>{posts.length} posts shared</span>
            </p>
          </div>
        </div>
      </div>

      {/* Create Post */}
      <div className="mb-8">
        <CreatePost onPostCreated={handlePostCreated} />
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
              <User size={40} className="text-indigo-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-4">Share your first post with the world!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={user?.id || ''}
              onPostDeleted={handlePostDeleted}
              onPostUpdated={handlePostUpdated}
              showActions={true}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
