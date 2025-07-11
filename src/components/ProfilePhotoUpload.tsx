
import React, { useRef, useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ProfilePhotoUpload = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      
      // Create a FileReader to convert the image to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target?.result as string;
        
        // Update user avatar in localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        userData.avatar = base64Image;
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update registered users data
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userIndex = registeredUsers.findIndex((u: any) => u.id === user?.id);
        if (userIndex !== -1) {
          registeredUsers[userIndex].avatar = base64Image;
          localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        }
        
        // Refresh the page to show the new avatar
        window.location.reload();
      };
      
      reader.readAsDataURL(file);
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="relative group">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=400&fit=crop&crop=face'}
          alt={user?.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100 cursor-pointer transition-opacity group-hover:opacity-80"
          onClick={triggerFileInput}
        />
        
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={triggerFileInput}
        >
          {uploading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
          ) : (
            <Camera size={24} className="text-white" />
          )}
        </div>
      </div>
      
      <button
        onClick={triggerFileInput}
        className="absolute -bottom-2 -right-2 bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 transition-colors shadow-lg"
        title="Change profile photo"
      >
        <Upload size={16} />
      </button>
    </div>
  );
};

export default ProfilePhotoUpload;
