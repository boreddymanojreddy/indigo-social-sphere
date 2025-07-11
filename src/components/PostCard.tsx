
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, MessageCircle, Share2, Edit, Trash2, Save, X } from 'lucide-react';

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

interface PostCardProps {
  post: Post;
  currentUserId: string;
  onPostDeleted?: (postId: string) => void;
  onPostUpdated?: () => void;
  showActions?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  currentUserId, 
  onPostDeleted, 
  onPostUpdated,
  showActions = false 
}) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUserId));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    
    return date.toLocaleDateString();
  };

  const handleLike = async () => {
    if (!user) return;

    try {
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      const postIndex = posts.findIndex((p: Post) => p.id === post.id);
      
      if (postIndex !== -1) {
        const updatedPost = { ...posts[postIndex] };
        
        if (isLiked) {
          updatedPost.likes = updatedPost.likes.filter((id: string) => id !== currentUserId);
          setLikesCount(prev => prev - 1);
          setIsLiked(false);
        } else {
          updatedPost.likes.push(currentUserId);
          setLikesCount(prev => prev + 1);
          setIsLiked(true);
        }
        
        posts[postIndex] = updatedPost;
        localStorage.setItem('posts', JSON.stringify(posts));
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      const filteredPosts = posts.filter((p: Post) => p.id !== post.id);
      localStorage.setItem('posts', JSON.stringify(filteredPosts));
      
      if (onPostDeleted) {
        onPostDeleted(post.id);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;

    try {
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      const postIndex = posts.findIndex((p: Post) => p.id === post.id);
      
      if (postIndex !== -1) {
        posts[postIndex].content = editContent.trim();
        localStorage.setItem('posts', JSON.stringify(posts));
        setIsEditing(false);
        
        if (onPostUpdated) {
          onPostUpdated();
        }
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(post.content);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.userAvatar}
            alt={post.userName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{post.userName}</h3>
            <p className="text-sm text-gray-500">{formatTimestamp(post.timestamp)}</p>
          </div>
        </div>
        
        {showActions && post.userId === currentUserId && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-indigo-600 transition-colors"
              title="Edit post"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-500 hover:text-red-600 transition-colors"
              title="Delete post"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="mb-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={3}
          />
          <div className="flex items-center justify-end space-x-2 mt-2">
            <button
              onClick={handleCancelEdit}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 px-3 py-1 rounded transition-colors"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSaveEdit}
              className="flex items-center space-x-1 bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-1 rounded transition-colors"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-gray-900 leading-relaxed">{post.content}</p>
        </div>
      )}

      {/* Image */}
      {post.image && (
        <div className="mb-4">
          <img
            src={post.image}
            alt="Post content"
            className="w-full max-h-96 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors ${
              isLiked
                ? 'text-red-500 hover:text-red-600'
                : 'text-gray-500 hover:text-red-500'
            }`}
            disabled={!user}
          >
            <Heart size={20} className={isLiked ? 'fill-current' : ''} />
            <span className="font-medium">{likesCount}</span>
          </button>
          
          <button className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition-colors">
            <MessageCircle size={20} />
            <span className="font-medium">Comment</span>
          </button>
          
          <button className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition-colors">
            <Share2 size={20} />
            <span className="font-medium">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
