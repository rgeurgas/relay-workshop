import React, { useCallback } from 'react';

import { Flex } from 'rebass';

import { graphql, usePaginationFragment } from 'react-relay/hooks';

import InfiniteScroll from 'react-infinite-scroller';

import Post from './Post';

import { Feed_query$key } from './__generated__/Feed_query.graphql';

import Loading from './Loading';

type Props = {
  query: Feed_query$key;
};

const Feed = (props: Props) => {
  const { data, hasNext, loadNext, isLoadingNext } = usePaginationFragment(
    graphql`
      fragment Feed_query on Query
        @argumentDefinitions(count: { type: "Int", defaultValue: 3 }, cursor: { type: "String" })
        @refetchable(queryName: "FeedPaginationQuery") {
        posts(first: $count, after: $cursor) @connection(key: "Feed_posts") {
          edges {
            node {
              id
              ...Post_post
            }
          }
        }
      }
    `,
    props.query,
  );

  const loadMore = useCallback(() => {
    if (!isLoadingNext) loadNext(3);
  }, [isLoadingNext, loadNext]);

  return (
    <Flex flexDirection='column'>
      <InfiniteScroll pageStart={0} loadMore={loadMore} hasMore={hasNext} loader={<Loading />} useWindow>
        {data.posts.edges
          .filter(el => {
            return el !== null && el.node !== null;
          })
          .map(el => (
            <Post key={el!!.node!!.id} post={el!!.node!!} />
          ))}
      </InfiniteScroll>
    </Flex>
  );
};

export default Feed;
