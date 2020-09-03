import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { MockPayloadGenerator } from 'relay-test-utils';

import { preloadQuery } from 'react-relay/hooks';

import { JSResource } from '@workshop/route';

import PostDetail from '../PostDetail';
import { Environment } from '../../../../relay';

import { withProviders } from '../../../../../test/withProviders';

it('should render post like button', async () => {
  const postId = 'postId';

  const routes = [
    {
      component: JSResource('Component', () => new Promise(resolve => resolve(PostDetail))),
      path: '/post/:id',
    },
  ];

  const initialEntries = [`/post/${postId}`];

  const PostDetailQuery = require('../__generated__/PostDetailQuery.graphql');

  const query = PostDetailQuery;
  const variables = {
    id: postId,
  };

  const customMockResolvers = {
    Post: () => ({
      content: 'Welcome to React Europe',
    }),
  };

  Environment.mock.queuePendingOperation(query, variables);

  Environment.mock.queueOperationResolver(op => MockPayloadGenerator.generate(op, customMockResolvers));

  const Root = withProviders({
    routes,
    initialEntries,
    Component: PostDetail,
  });

  const prepared = {
    postDetailQuery: preloadQuery(Environment, PostDetailQuery, variables, { fetchPolicy: 'store-or-network' }),
  };

  const { debug, getByText } = render(<Root prepared={prepared} />);

  expect(getByText('Welcome to React Europe')).toBeTruthy();
});

it('should not find post', async () => {
  const postId = 'postId';

  const routes = [
    {
      component: JSResource('Component', () => new Promise(resolve => resolve(PostDetail))),
      path: '/post/:id',
    },
  ];

  const initialEntries = [`/post/${postId}`];

  const PostDetailQuery = require('../__generated__/PostDetailQuery.graphql');

  const query = PostDetailQuery;
  const variables = {
    id: postId,
  };

  const customMockResolvers = {
    Post: () => ({
      content: 'Welcome to React Europe',
    }),
  };

  Environment.mock.queuePendingOperation(query, variables);

  Environment.mock.queueOperationResolver(op => MockPayloadGenerator.generate(op, customMockResolvers));

  const Root = withProviders({
    routes,
    initialEntries,
    Component: PostDetail,
  });

  const prepared = {
    postDetailQuery: preloadQuery(Environment, PostDetailQuery, variables, { fetchPolicy: 'store-or-network' }),
  };

  const { debug, queryByText } = render(<Root prepared={prepared} />);

  expect(queryByText('Not valid post')).toBeNull();
});
