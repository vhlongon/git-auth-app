import React from 'react';
import { useGetReposQuery } from '../graphql/generated/graphql-types';

const Repos = () => {
  const { data } = useGetReposQuery();

  console.log(data);

  return <div>Repos</div>;
};

export default Repos;
