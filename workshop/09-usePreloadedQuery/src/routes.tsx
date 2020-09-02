import { preloadQuery } from 'react-relay/hooks';

import { JSResource } from '@workshop/route';

import { Environment } from './relay';

export const routes = [
  {
    component: JSResource('App', () => import('./App')),
    path: '/',
    exact: true,
    prepare: () => {
      const AppQuery = require('./__generated__/AppQuery.graphql');

      return {
        appQuery: preloadQuery(Environment, AppQuery, {}),
      };
    },
  },
  {
    path: '/post/:id',
    exact: true,
    component: JSResource('PostDetail', () => import('./components/feed/post/PostDetail')),
    prepare: (params: { id: string }) => {
      const PostDetailQuery = require('./components/feed/post/__generated__/PostDetailQuery.graphql');

      return {
        postDetailQuery: preloadQuery(Environment, PostDetailQuery, {
          id: params.id,
        }),
      };
    },
  },
];
