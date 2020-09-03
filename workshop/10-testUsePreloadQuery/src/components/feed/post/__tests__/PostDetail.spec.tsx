import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { MockPayloadGenerator, createMockEnvironment } from 'relay-test-utils';

import { preloadQuery } from 'react-relay/hooks';

import { JSResource } from '@workshop/route';

import PostDetail from '../PostDetail';

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
      content: 'Welcome to React Europe'
    }),
  };

  /**
   * TODO
   * queue a pending operation, this would be a preloadQuery call
   */
  const environment = createMockEnvironment()
  environment.mock.queueOperationResolver(operation => MockPayloadGenerator.g)
  Environment.queuePendingOperation

  /**
   * TODO
   * mock a queued operation
   */

  const Root = withProviders({
    routes,
    initialEntries,
    Component: PostDetail,
  });

  const prepared = {
    /**
     * TODO
     * preload query
     */
    postDetailQuery: {},
  };

  const { debug, getByText } = render(<Root prepared={prepared} />);

  debug();

  expect(getByText('Welcome to React Europe')).toBeTruthy();
});
