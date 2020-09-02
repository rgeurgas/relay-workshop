import { graphql } from 'react-relay';
import { SelectorStoreUpdater, RecordSourceSelectorProxy, ConnectionHandler } from 'relay-runtime';

import { PostCommentCreateInput } from './__generated__/PostCommentCreateMutation.graphql';
import { PostCommentComposer_me } from './__generated__/PostCommentComposer_me.graphql';

export const PostCommentCreate = graphql`
  mutation PostCommentCreateMutation($input: PostCommentCreateInput!) {
    PostCommentCreate(input: $input) {
      success
      error
      post {
        commentsCount
      }
      commentEdge {
        node {
          id
          body
          user {
            id
            name
          }
        }
      }
    }
  }
`;

export const updater = (parentId: string): SelectorStoreUpdater => (store: RecordSourceSelectorProxy) => {
  const payload = store.getRootField('PostCommentCreate')!!;
  const comment = payload.getLinkedRecord('commentEdge')!!;

  const parentProxy = store.get(parentId)!!;
  const conn = ConnectionHandler.getConnection(parentProxy, 'PostComments_comments')!!;
  const commentsCount = conn.getValue('count')!! as number;
  conn.setValue(commentsCount + 1, 'count');
  ConnectionHandler.insertEdgeBefore(conn, comment);
};

let tempID = 0;

export const optimisticUpdater = (input: PostCommentCreateInput, me: PostCommentComposer_me) => (
  store: RecordSourceSelectorProxy,
) => {
  const id = 'client:newComment:' + tempID++;

  const node = store.create(id, 'Comment');

  const meProxy = store.get(me.id)!!;

  node.setValue(id, 'id');
  node.setValue(input.body, 'body');
  node.setLinkedRecord(meProxy, 'user');

  const newEdge = store.create('client:newEdge:' + tempID++, 'CommentEdge');
  newEdge.setLinkedRecord(node, 'node');

  const parentProxy = store.get(input.post)!!;
  const conn = ConnectionHandler.getConnection(parentProxy, 'PostComments_comments')!!;
  const commentsCount = conn.getValue('count')!! as number;
  conn.setValue(commentsCount + 1, 'count');
  ConnectionHandler.insertEdgeBefore(conn, newEdge);
};
