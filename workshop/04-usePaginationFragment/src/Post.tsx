import React from 'react';
import { useFragment, graphql } from 'react-relay/hooks';
import { Text } from 'rebass';
import { Card } from '@workshop/ui';

import { Post_post$key } from './__generated__/Post_post.graphql';

type Props = {
  post: Post_post$key;
};

const Post = (props: Props) => {
  const post = useFragment<Post_post$key>(
    graphql`
      fragment Post_post on Post {
        id
        content
        likesCount
        commentsCount
        author {
          name
          email
          createdAt
          updatedAt
        }
      }
    `,
    props.post,
  );

  return (
    <Card mt='10px' flexDirection='column' p='10px'>
      <Text>id: {post.id}</Text>
      <Text>content: {post.content}</Text>
      <Text>likes: {post.likesCount}</Text>
      <Text>comments: {post.commentsCount}</Text>
      <Text>Author name: {post.author!!.name}</Text>
      <Text>Author email: {post.author!!.email}</Text>
      <Text>Author createdAt: {post.author!!.createdAt}</Text>
      <Text>Author updatedAt: {post.author!!.updatedAt}</Text>
    </Card>
  );
};

export default Post;
