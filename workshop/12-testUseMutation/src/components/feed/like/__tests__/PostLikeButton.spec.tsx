import { render, fireEvent, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { MockPayloadGenerator } from 'relay-test-utils';
import { act } from 'react-dom/test-utils';

import { usePreloadedQuery, graphql, preloadQuery } from 'react-relay/hooks';

import { getMutationOperationVariables } from '@workshop/test';

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

    return <PostLikeButton post={data.post} />;
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

  Environment.mock.queueOperationResolver(operation => MockPayloadGenerator.generate(operation, customMockResolvers));

  const preloadedQuery = preloadQuery(
    Environment,
    PostLikeButtonSpecQuery,
    {
      id: postId,
    },
    {
      fetchPolicy: 'store-or-network',
    },
  );

  const Root = getRoot({
    Component: PostLikeButton,
    preloadedQuery,
  });

  const { getByText, getByTestId } = render(<Root />);

  expect(getByText('10')).toBeTruthy();

  const likeButton = getByTestId('likeButton');

  act(() => {
    fireEvent.click(likeButton);
  });

  await Environment.mock.getMostRecentOperation();
  const mutationOp = Environment.mock.getMostRecentOperation();

  expect(getMutationOperationVariables(mutationOp).input).toEqual({
    post: postId,
  });

  const customMockMutationResolvers = {
    Post: () => ({
      id: postId,
      likesCount: 11,
      meHasLiked: true,
    }),
  };

  act(() => {
    Environment.mock.resolve(mutationOp, MockPayloadGenerator.generate(mutationOp, customMockMutationResolvers));
  });

  expect(getByText('11')).toBeTruthy();
});
