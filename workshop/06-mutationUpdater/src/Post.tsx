import React from 'react';
import { useFragment, graphql } from 'react-relay/hooks';
import { Text } from 'rebass';
import { Card, CardActions } from '@workshop/ui';

import { Post_post, Post_post$key } from './__generated__/Post_post.graphql';
import PostCommentComposer from './comment/PostCommentComposer';
import PostLikeButton from './like/PostLikeButton';
import { Post_me, Post_me$key } from './__generated__/Post_me.graphql';
import PostComments from './comment/PostComments';

type Props = {
  post: Post_post$key;
  me: Post_me$key;
};
const Post = (props: Props) => {
  const post = useFragment<Post_post$key>(
    graphql`
      fragment Post_post on Post {
        id
        content
        author {
          name
        }
        meHasLiked
        likesCount
        ...PostLikeButton_post
        ...PostCommentComposer_post
        ...PostComments_post
      }
    `,
    props.post,
  );

  const me = useFragment<Post_me$key>(
    graphql`
      fragment Post_me on User {
        ...PostCommentComposer_me
        ...PostCommentComposer_me
      }
    `,
    props.me,
  );

  return (
    <Card mt='10px' flexDirection='column' p='10px'>
      <Text>id: {post.id}</Text>
      <Text>content: {post.content}</Text>
      <Text>Author: {post.author!!.name}</Text>
      <CardActions>
        <PostLikeButton post={post} />
      </CardActions>
      <PostCommentComposer post={post} me={me} />
      <PostComments post={post} />
    </Card>
  );
};

export default Post;
