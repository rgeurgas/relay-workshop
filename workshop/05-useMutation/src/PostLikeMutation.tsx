import { graphql } from 'react-relay';

import { Post_post } from './__generated__/Post_post.graphql';

export const PostLike = graphql`
  mutation PostLikeMutation($input: PostLikeInput!) {
    PostLike(input: $input) {
      success
      error
      post {
        meHasLiked
        likesCount
      }
    }
  }
`;

export const postLikeOptimisticResponse = (post: Post_post) => ({
  PostLike: {
    success: '',
    error: null,
    post: {
      id: post.id,
      meHasLiked: post.meHasLiked,
      likesCount: post.likesCount + 1,
    },
  },
});
