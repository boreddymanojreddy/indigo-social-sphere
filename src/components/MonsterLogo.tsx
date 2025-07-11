
import React from 'react';

const MonsterLogo = () => {
  return (
    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center relative shadow-lg">
      {/* Monster eyes */}
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-white rounded-full relative">
          <div className="w-1 h-1 bg-purple-800 rounded-full absolute top-0.5 left-0.5"></div>
        </div>
        <div className="w-2 h-2 bg-white rounded-full relative">
          <div className="w-1 h-1 bg-purple-800 rounded-full absolute top-0.5 left-0.5"></div>
        </div>
      </div>
      
      {/* Monster mouth */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
        <div className="w-4 h-1 bg-white rounded-full opacity-80"></div>
        {/* Teeth */}
        <div className="flex justify-center space-x-0.5 -mt-0.5">
          <div className="w-0.5 h-1 bg-white rounded-sm"></div>
          <div className="w-0.5 h-1 bg-white rounded-sm"></div>
          <div className="w-0.5 h-1 bg-white rounded-sm"></div>
        </div>
      </div>
      
      {/* Monster horns */}
      <div className="absolute -top-1 left-1">
        <div className="w-1 h-2 bg-purple-400 rounded-t-full transform rotate-12"></div>
      </div>
      <div className="absolute -top-1 right-1">
        <div className="w-1 h-2 bg-purple-400 rounded-t-full transform -rotate-12"></div>
      </div>
    </div>
  );
};

export default MonsterLogo;
