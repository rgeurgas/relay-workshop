import { graphql } from 'react-relay';

import { Post_post } from './__generated__/Post_post.graphql';

export const PostUnLike = graphql`
  mutation PostUnLikeMutation($input: PostUnLikeInput!) {
    PostUnLike(input: $input) {
      success
      error
      post {
        meHasLiked
        likesCount
      }
    }
  }
`;

export const postUnLikeOptimisticResponse = (post: Post_post) => ({
  PostUnLike: {
    success: '',
    error: null,
    post: {
      id: post.id,
      meHasLiked: post.meHasLiked,
      likesCount: post.likesCount - 1,
    },
  },
});
