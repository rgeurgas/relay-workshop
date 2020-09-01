import React, { useCallback } from 'react';
import { useFragment, graphql } from 'react-relay/hooks';
import { Text } from 'rebass';
import { Card, CardActions, theme } from '@workshop/ui';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import IconButton from '@material-ui/core/IconButton';

import { useMutation } from '@workshop/relay';

import { Post_post$key } from './__generated__/Post_post.graphql';
import { PostLikeMutation } from './__generated__/PostLikeMutation.graphql';
import { PostUnLikeMutation } from './__generated__/PostUnLikeMutation.graphql';
import { PostLike, postLikeOptimisticResponse } from './PostLikeMutation';
import { PostUnLike, postUnLikeOptimisticResponse } from './PostUnLikeMutation';

type Props = {
  post: Post_post$key;
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
      }
    `,
    props.post,
  );

  const [postLike] = useMutation<PostLikeMutation>(PostLike);
  const [postUnLike] = useMutation<PostUnLikeMutation>(PostUnLike);

  const Icon = post.meHasLiked ? FavoriteIcon : FavoriteBorderIcon;

  const handleLike = useCallback(() => {
    const config = {
      variables: {
        input: {
          post: post.id,
        },
      },
      optimisticResponse: post.meHasLiked ? postUnLikeOptimisticResponse(post) : postLikeOptimisticResponse(post),
    };

    if (post.meHasLiked) {
      postUnLike(config);
    } else {
      postLike(config);
    }
  }, [post]);

  return (
    <Card mt='10px' flexDirection='column' p='10px'>
      <Text>id: {post.id}</Text>
      <Text>content: {post.content}</Text>
      <Text>Author: {post.author!!.name}</Text>
      <CardActions>
        <IconButton onClick={handleLike}>
          <Icon style={{ color: theme.relayDark }} />
        </IconButton>
        {post.likesCount > 0 ? <Text>{post.likesCount}</Text> : null}
      </CardActions>
    </Card>
  );
};

export default Post;
