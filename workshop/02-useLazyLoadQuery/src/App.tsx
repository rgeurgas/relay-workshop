import React from 'react';

import { Flex, Text } from 'rebass';
import { Card, Content } from '@workshop/ui';
import { graphql, useLazyLoadQuery } from 'react-relay/hooks'
import { AppQuery, AppQueryVariables } from './__generated__/AppQuery.graphql'

const App = () => {
  // Added variables but there was nothing to change then on the default website don't know if 
  // there needs to be one, previous assignment shows how to use then better
  const variables: AppQueryVariables = { first: 10 }

  const { posts } = useLazyLoadQuery<AppQuery>(
    graphql`
    query AppQuery($first: Int) {
      posts(first: $first) {
        edges {
          node {
            id
            content
          }
        }
      }          
    }
    `,
    variables
  )

  return (
    <Content>
      <Flex flexDirection='column'>
        <Text>Posts</Text>
        <Flex flexDirection='column'>
          {posts.edges.filter((el) => { return el !== null && el.node !== null }).map((el) => (
            <Card key={el!!.node!!.id} mt='10px' flexDirection='column' p='10px'>
              <Text>id: {el!!.node!!.id}</Text>
              <Text>content: {el!!.node!!.content}</Text>
            </Card>
          ))}
        </Flex>
      </Flex>
    </Content>
  );
};

export default App;
