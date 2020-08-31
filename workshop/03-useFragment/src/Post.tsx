import React from 'react';
import { Text } from 'rebass';
import { Card } from '@workshop/ui';
import { graphql, useFragment } from 'react-relay/hooks';

import { PostQuery$key } from './__generated__/PostQuery.graphql';

type Props = {
  post: PostQuery$key;
};

const Post = ({ post }: Props) => {
  const data = useFragment(
    graphql`
      fragment PostQuery on Post {
        id
        content
        author {
          name
        }
      }
    `,
    post,
  );

  return (
    <Card mt='10px' flexDirection='column' p='10px'>
      <Text>id: {data.id}</Text>
      <Text>content: {data.content}</Text>
      <Text>author name: {data.author?.name}</Text>
    </Card>
  );
};

export default Post;
