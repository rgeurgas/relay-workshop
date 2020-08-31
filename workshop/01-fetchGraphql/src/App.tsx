import React, { useState, useEffect, useCallback } from 'react';


import { Flex, Text } from 'rebass';
import { Card, Content, Button } from '@workshop/ui';

import config from './config';

// Type for easier query return
type Post = {
  id: string;
  content: string;
};

// Arguments of the GraphQL query
type Variables = {
  first: number | null;
  after: string | null;
  before: string | null;
  last: number | null;
};

type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
};

// Fetch a GraphQL query passing arguments
async function fetchGraphQL(query: string, variables: object = {}) {
  const response = await fetch(config.GRAPHQL_URL!!, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  return await response.json();
}

const App = () => {
  const [posts, setPosts] = useState<Array<Post> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  // State used to fetch next or previous page
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  // Used for retry on error
  const [next, setNext] = useState<boolean>(true);

  const fetchPosts = useCallback(
    async (pageInfo?: PageInfo, next = true) => {
      try {
        // If no pageInfo passed it is a new page, so fetch only the first 3 elements
        let variables: Variables = { first: 3, after: null, before: null, last: null };
        if (pageInfo !== undefined) {
          // Fetch next 3 elements or 3 previous elements based on next passed
          if (next) {
            variables = { first: 3, after: pageInfo.endCursor, before: null, last: null };
          } else {
            variables = { first: null, after: null, before: pageInfo.startCursor, last: 3 };
          }
        }

        const response = await fetchGraphQL(
          `
        query PostsQuery($first: Int, $after: String, $before: String, $last: Int) {
          posts(first: $first, after: $after, before: $before, last: $last) {
            edges {
              node {
                id
                content
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }          
        }`,
          variables,
        );

        // throw new Error("testando erros")
        setNext(next);
        setPageInfo(response.data.posts.pageInfo as PageInfo);
        setPosts(
          response.data.posts.edges.map((p: { node: Post }) => {
            return { id: p.node.id, content: p.node.content } as Post;
          }),
        );
      } catch (e) {
        console.log(e);
        setError(e);
      }
    },
    [setPageInfo, setNext, setPosts, setError],
  );

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Check for errors
  if (error) {
    return (
      <Content>
        <Text>Error: {error.message}</Text>
        <Button
          mt='10px'
          onClick={() => {
            if (pageInfo) {
              fetchPosts(pageInfo, next);
            } else {
              fetchPosts();
            }
          }}
        >
          retry
        </Button>
      </Content>
    );
  }

  // If pageInfo or posts is null page is loading
  if (!pageInfo || !posts) {
    return (
      <Content>
        <div>Loading...</div>
      </Content>
    );
  }

  return (
    <Content>
      <Flex flexDirection='column'>
        <Text>Posts</Text>
        <Flex flexDirection='column'>
          {posts.map(post => (
            <Card key={post.id} mt='10px' flexDirection='column' p='10px'>
              <Text>id: {post.id}</Text>
              <Text>content: {post.content}</Text>
            </Card>
          ))}
        </Flex>
      </Flex>
      <Button
        disabled={!pageInfo?.hasPreviousPage}
        onClick={() => {
          fetchPosts(pageInfo, false);
        }}
      >
        Prev
      </Button>
      <Button
        disabled={!pageInfo?.hasNextPage}
        onClick={() => {
          fetchPosts(pageInfo, true);
        }}
      >
        Next
      </Button>
    </Content>
  );
};

export default App;
