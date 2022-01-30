import React from 'react';
import classes from './spinner.module.css';

interface Props {
  color?: string;
  size?: string;
}
const Loading = ({ color = '#3b82f6', size = '80px' }: Props) => {
  return (
    <div
      className={classes.ripple}
      style={
        {
          '--spinner-color': color,
          '--spinner-size': size,
        } as React.CSSProperties
      }
      aria-label="loading">
      <div></div>
      <div></div>
    </div>
  );
};

export default Loading;
