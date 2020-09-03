import React, { useTransition } from 'react';
import { graphql, useRefetchableFragment } from 'react-relay/hooks';
import { Flex, Text } from 'rebass';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { theme } from '@workshop/ui';

import UserAvatar from './UserAvatar';

import { PostComments_post$key } from './__generated__/PostComments_post.graphql';
import { PostCommentsRefetchQuery } from './__generated__/PostCommentsRefetchQuery.graphql';

type Props = {
  post: PostComments_post$key;
};
const PostComments = (props: Props) => {
  const [startTransitionOlder, isPendingOlder] = useTransition();
  const [startTransitionNewer, isPendingNewer] = useTransition();

  const [post, refetch] = useRefetchableFragment<PostCommentsRefetchQuery, PostComments_post$key>(
    graphql`
      fragment PostComments_post on Post
        @argumentDefinitions(
          first: { type: Int }
          after: { type: String }
          last: { type: Int }
          before: { type: String }
        )
        @refetchable(queryName: "PostCommentsRefetchQuery") {
        id
        comments(first: $first, after: $after, last: $last, before: $before)
          @connection(key: "PostComments_comments", filters: []) {
          endCursorOffset
          startCursorOffset
          count
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          edges {
            cursor
            node {
              id
              body
              user {
                id
                name
                ...UserAvatar_user
              }
            }
          }
        }
      }
    `,
    props.post,
  );

  const { comments } = post!!;
  const { edges, pageInfo } = comments;

  if (edges.length === 0) {
    return null;
  }

  const loadMoreOlder = () => {
    startTransitionOlder(() => {
      refetch({
        id: post!!.id,
        first: 3,
        after: pageInfo.endCursor,
      }, { fetchPolicy: 'store-and-network' });
    });
  };

  const loadMoreNewer = () => {
    console.log(post!!.id)
    console.log(pageInfo.startCursor)
    startTransitionNewer(() => {
      refetch({
        id: post!!.id,
        last: 3,
        before: pageInfo.startCursor,
      }, { fetchPolicy: 'store-and-network' });
    });
  };

  const isDisabledOlder = !pageInfo.hasNextPage;

  return (
    <Flex flex={1} p='16px' flexDirection='column'>
      {comments.edges.map(({ node }) => {
        return (
          <Flex mt='10px' key={node.id}>
            <UserAvatar showName={false} user={node.user} />
            <Flex backgroundColor='#F2F3F5' borderRadius={10} p='10px' ml='10px'>
              <Text fontWeight='600px' color={theme.relayDark}>
                {node.user.name}
              </Text>
              <Text ml='10px'>{node.body}</Text>
            </Flex>
          </Flex>
        );
      })}
      {(isPendingOlder || isPendingNewer) && (
        <Flex mt='10px' justifyContent='center'>
          <CircularProgress />
        </Flex>
      )}
      <Flex flex={1} justifyContent='flex-end' mt='10px'>
        <Button variant='contained' color='primary' onClick={loadMoreNewer}>
          Show newer
        </Button>
        <Button variant='contained' color='primary' onClick={loadMoreOlder} disabled={isDisabledOlder}>
          Show older
        </Button>
      </Flex>
    </Flex>
  );
};

export default PostComments;
