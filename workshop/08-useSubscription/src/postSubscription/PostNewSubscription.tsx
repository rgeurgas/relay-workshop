import { graphql } from 'react-relay';
import { ConnectionHandler, RecordSourceSelectorProxy, ROOT_ID } from 'relay-runtime';

import { connectionUpdater } from '@workshop/relay';

export const PostNew = graphql`
  subscription PostNewSubscription($input: PostNewInput!) {
    PostNew(input: $input) {
      post {
        id
        content
        author {
          id
          name
        }
        meHasLiked
        likesCount
        ...PostComments_post
      }
    }
  }
`;

export const updater = (store: RecordSourceSelectorProxy) => {
  const post = store.getRootField('PostNew')!!.getLinkedRecord('post')!!;

  const postId = post.getValue('id') as string;

  const postStore = store.get(postId);

  if (!postStore) {
    const postConnection = ConnectionHandler.getConnection(store.getRoot(), 'Feed_posts')!!;

    const postEdge = ConnectionHandler.createEdge(store, postConnection, post, 'PostEdge');

    connectionUpdater({
      store,
      parentId: ROOT_ID,
      connectionName: 'Feed_posts',
      edge: postEdge,
      before: true,
    });
  }
};
