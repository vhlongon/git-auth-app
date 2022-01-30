import Image from 'next/image';
import React, { ReactNode } from 'react';
import {
  GetCommentsQuery,
  Reactions,
} from '../graphql/generated/graphql-types';

type ReactionsProps = Omit<Reactions, 'totalCount' | 'url'>;

const emojis: Record<keyof ReactionsProps | string, ReactNode> = {
  confused: <span>🤔</span>,
  downVote: <span>👎</span>,
  eyes: <span>👀</span>,
  heart: <span>❤️</span>,
  hooray: <span>🎉</span>,
  laugh: <span>😂</span>,
  rocket: <span>🚀</span>,
  upVote: <span>👍</span>,
};

const Reactions = (props: ReactionsProps) => {
  return (
    <div className="flex gap-1">
      {Object.entries(props).map(([reaction, count]) =>
        count ? (
          <span
            className="inline-flex items-center rounded-full bg-amber-200 px-1.5 py-0.5"
            key={reaction}>
            {emojis[reaction]}
            <span className="ml-1 text-gray-500 text-xs">{count}</span>
          </span>
        ) : undefined,
      )}
    </div>
  );
};

const Comments = ({ comments }: GetCommentsQuery) => {
  const today = new Date().getDay();
  return (
    <ul>
      {comments?.map(comment => {
        const isMe = comment.authorAssociation === 'OWNER';
        const commentDate = new Date(comment.createdAt);
        const isToday = commentDate.getDay() === today;

        const styles = isMe
          ? 'text-gray-400 bg-gray-200 border-gray-200'
          : 'text-gray-500 bg-none border-gray-400';

        return (
          <li
            key={comment.id}
            className={`flex flex-col my-4 ${
              isMe ? 'items-end' : 'items-start'
            }`}>
            <div className="text-gray-400 text-xs mt-0.5">
              <span className="mr-1">
                {!isToday ? commentDate.toLocaleDateString() : 'Today'}
              </span>
              {commentDate.toLocaleTimeString()}
            </div>
            <div className="flex items-center">
              <span className="w-[30px] h-[30px]">
                <Image
                  alt={comment.user.login}
                  className="rounded-full"
                  src={comment.user.avatarUrl || '/user-placeholder.png'}
                  width={30}
                  height={30}
                />
              </span>
              <span
                className={`rounded-lg flex-1 border-2 ml-2 mb-1 px-2 py-1 ${styles}`}>
                {comment.body}
              </span>
            </div>
            {comment.reactions && <Reactions {...comment.reactions} />}
          </li>
        );
      })}
    </ul>
  );
};

export default Comments;
