import React from 'react';

const CommentInput = () => {
  return (
    <div className="bg-amber-50 sticky w-full bottom-0 left-0 py-2">
      <input
        className="transition rounded-full p-2 w-full border-2 bg-amber-50 focus:border-amber-300 placeholder:text-gray-400 text-gray-600 focus:outline-none"
        placeholder="Write a comment"
      />
    </div>
  );
};

export default CommentInput;
