import React, { useState } from 'react';
import { useCreateCommentMutation } from '../graphql/generated/graphql-types';
import SendIcon from './SendIcon';

interface Props {
  repoName: string;
  issueNumber: number;
  onCommentCreated: () => void;
}
const CommentInput = ({ issueNumber, repoName, onCommentCreated }: Props) => {
  const [value, setValue] = useState('');
  const [createComment, { loading }] = useCreateCommentMutation({
    refetchQueries: ['getComments'],
    onCompleted: () => {
      setValue('');
      setTimeout(onCommentCreated, 1000);
    },
  });
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && value.trim()) {
      e.preventDefault();
      createComment({
        variables: {
          repoName,
          issueNumber,
          body: value,
        },
      });
    }
  };

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = e => {
    setValue(e.target.value);
  };

  const handleOnClick = () => {
    if (value) {
      createComment({
        variables: {
          body: value,
          issueNumber,
          repoName,
        },
      });
    }
  };

  return (
    <div className="bg-amber-50 sticky w-full bottom-0 left-0 py-2">
      <div className="flex items-center relative">
        <textarea
          onKeyDown={onKeyDown}
          value={value}
          onChange={handleChange}
          className="resize-none box-border max-h-11 overflow-hidden flex items-center pr-11 pl-2 transition rounded-full py-2  w-full border-2 bg-amber-50 focus:border-amber-300 placeholder:text-gray-400 text-gray-600 focus:outline-none"
          placeholder="Write a comment"
        />
        <button
          onClick={handleOnClick}
          className="outline-none active:outline-none focus:outline-none w-6 h-6 text-blue-500 -ml-10 z-10">
          <SendIcon disabled={!value} />
        </button>
      </div>
    </div>
  );
};

export default CommentInput;
