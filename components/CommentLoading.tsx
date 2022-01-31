import React from 'react';
import classes from './commentLoading.module.css';

const CommentLoading = () => {
  return (
    <div className={classes.ellipsis}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default CommentLoading;
