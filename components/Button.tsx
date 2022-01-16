import React from 'react';

const Button: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = ({ children, className, ...props }) => {
  return (
    <button
      className={
        'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex' +
        (className ? ' ' + className : '')
      }
      {...props}>
      {children}
    </button>
  );
};

export default Button;
