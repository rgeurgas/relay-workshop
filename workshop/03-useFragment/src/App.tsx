import React from 'react';

import { Flex, Text } from 'rebass';
import { Content } from '@workshop/ui';

import { useLazyLoadQuery, graphql } from 'react-relay/hooks';

import Post from './Post';


import { AppQuery } from './__generated__/AppQuery.graphql';

const App = () => {
  const response = useLazyLoadQuery<AppQuery>(
    graphql`
      query AppQuery {
        posts(first: 10) {
          edges {
            node {
              id
              ...PostQuery
            }
          }
        }
      }
    `,
    {},
    {
      fetchPolicy: 'network-only',
    },
  );

  const { posts } = response;

  return (
    <Content>
      <Flex flexDirection='column'>
        <Text>Posts</Text>
        <Flex flexDirection='column'>
          {posts.edges
            .filter(el => {
              return el !== null && el.node !== null;
            })
            .map(el => (
              <Post key={el!!.node!!.id} post={el!!.node!!} />
            ))}
        </Flex>
      </Flex>
    </Content>
  );
};

export default App;
