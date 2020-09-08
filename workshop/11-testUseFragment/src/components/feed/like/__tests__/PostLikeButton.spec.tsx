import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import { MockPayloadGenerator } from 'relay-test-utils';
import { usePreloadedQuery, graphql, preloadQuery } from 'react-relay/hooks';

import { Environment } from '../../../../relay';
import PostLikeButton from '../PostLikeButton';

import { withProviders } from '../../../../../test/withProviders';

import { PostLikeButtonSpecQuery } from './__generated__/PostLikeButtonSpecQuery.graphql';

export const getRoot = ({ preloadedQuery }) => {
  const UseQueryWrapper = () => {
    const data = usePreloadedQuery<PostLikeButtonSpecQuery>(
      graphql`
        query PostLikeButtonSpecQuery($id: ID!) @relay_test_operation {
          post: node(id: $id) {
            ...PostLikeButton_post
          }
        }
      `,
      preloadedQuery,
    );

    if (data.post !== null) {
      return <PostLikeButton post={data.post} />;
    } else {
      throw Error('Post not found');
    }
  };

  return withProviders({
    Component: UseQueryWrapper,
  });
};

it('should render post like button and likes count', async () => {
  const PostLikeButtonSpecQuery = require('./__generated__/PostLikeButtonSpecQuery.graphql');

  const postId = 'postId';
  const query = PostLikeButtonSpecQuery;
  const variables = {
    id: postId,
  };

  const customMockResolvers = {
    Post: () => ({
      id: postId,
      likesCount: 10,
      meHasLiked: false,
    }),
  };

  Environment.mock.queuePendingOperation(query, variables);

  Environment.mock.queueOperationResolver(op => MockPayloadGenerator.generate(op, customMockResolvers));

  const preloadedQuery = preloadQuery(Environment, PostLikeButtonSpecQuery, {
    id: postId,
  });

  const Root = getRoot({
    Component: PostLikeButton,
    preloadedQuery,
  });

  const { getByText } = render(<Root />);

  expect(getByText('10')).toBeTruthy();
});

it('should render post like button but no likes count', async () => {
  const PostLikeButtonSpecQuery = require('./__generated__/PostLikeButtonSpecQuery.graphql');

  const postId = 'postId';
  const query = PostLikeButtonSpecQuery;
  const variables = {
    id: postId,
  };

  const customMockResolvers = {
    Post: () => ({
      id: postId,
      likesCount: 0,
      meHasLiked: false,
    }),
  };

  Environment.mock.queuePendingOperation(query, variables);

  Environment.mock.queueOperationResolver(op => MockPayloadGenerator.generate(op, customMockResolvers));

  const preloadedQuery = preloadQuery(Environment, PostLikeButtonSpecQuery, {
    id: postId,
  });

  const Root = getRoot({
    Component: PostLikeButton,
    preloadedQuery,
  });

  const { queryByTestId } = render(<Root />);

  expect(queryByTestId('likesCount')).toBeNull();
});
