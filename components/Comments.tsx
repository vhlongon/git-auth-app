import Image from 'next/image';
import React, { ReactNode } from 'react';
import {
  GetCommentsQuery,
  Reactions,
  useDeleteCommentMutation,
} from '../graphql/generated/graphql-types';
import DeleteIcon from './DeleteIcon';
import DeleteLoading from './DeleteLoading';

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

interface Props extends GetCommentsQuery {
  repoName: string;
}
const Comments = ({ comments, repoName }: Props) => {
  const today = new Date().getDay();
  const [deleteComment, { loading }] = useDeleteCommentMutation({
    refetchQueries: ['getComments'],
    fetchPolicy: 'network-only',
  });
  const [deleting, setDeleting] = React.useState<number | null>(null);

  const handleDelete = (id: number) => () => {
    setDeleting(id);
    deleteComment({
      variables: {
        id,
        repoName,
      },
      onCompleted: () => {
        setDeleting(null);
      },
      onError: () => {
        setDeleting(null);
      },
    });
  };

  const hasComments = comments && comments.length > 0;
  return (
    <div
      className={`min-h-[400px] flex justify-center ${
        hasComments ? 'items-start' : 'items-center'
      }`}>
      {hasComments ? (
        <ul className="p-0 w-full">
          {comments.map(comment => {
            const isMe = comment.authorAssociation === 'OWNER';
            const commentDate = new Date(comment.createdAt);
            const isToday = commentDate.getDay() === today;

            const styles = isMe
              ? 'text-gray-400 bg-gray-200 border-gray-200'
              : 'text-gray-500 bg-none border-gray-400';

            return (
              <li
                key={comment.id}
                className={`flex flex-col first:mt-2 my-4 ${
                  isMe ? 'items-end' : 'items-start'
                }`}>
                <div
                  className={`flex items-center text-gray-400 text-xs mt-0.5 ${
                    isMe ? 'justify-end' : 'justify-start'
                  }`}>
                  <span className="mr-1">
                    {!isToday ? commentDate.toLocaleDateString() : 'Today'}
                  </span>
                  {commentDate.toLocaleTimeString()}
                  <button
                    onClick={handleDelete(comment.id)}
                    className="ml-2 mb-0.5 outline-none active:outline-none focus:outline-none w-4 h-4 text-gray-400 hover:text-gray-600 z-10">
                    {deleting === comment.id ? (
                      <DeleteLoading />
                    ) : (
                      <DeleteIcon />
                    )}
                  </button>
                </div>
                <div className="flex items-center">
                  <span className="grow-1 shrink-0 basis-[30px]">
                    <Image
                      alt={comment.user.login}
                      className="rounded-full"
                      src={comment.user.avatarUrl || '/user-placeholder.png'}
                      width={30}
                      height={30}
                    />
                  </span>
                  <span
                    className={`rounded-lg grow-1 shrink-1 border-2 ml-2 mb-1 px-2 py-1 ${styles}`}>
                    {comment.body}
                  </span>
                </div>
                {comment.reactions && <Reactions {...comment.reactions} />}
              </li>
            );
          })}
        </ul>
      ) : (
        <h2 className="text-gray-400 font-semibold text-center">
          No comments yet
        </h2>
      )}
    </div>
  );
};

export default Comments;
