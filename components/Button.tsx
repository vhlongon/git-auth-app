import React from 'react';

const Button: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = ({ children, className, ...props }) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center mr-4 last:mr-0 disabled:bg-gray-500 disabled:cursor-not-allowed"
      {...props}>
      {children}
    </button>
  );
};

export default Button;
