import React from 'react';

interface Props {
  disabled: boolean;
}
const SendIcon = ({ disabled }: Props) => {
  return (
    <svg className="focus:outline-none" tabIndex={-1} viewBox="0 0 24 24">
      <path
        fill={disabled ? 'gray' : 'currentColor'}
        d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
    </svg>
  );
};

export default SendIcon;
