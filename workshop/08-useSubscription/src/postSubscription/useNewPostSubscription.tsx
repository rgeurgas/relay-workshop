import React, { useMemo } from 'react';
import Button from '@material-ui/core/Button';

import { useSnackbar } from 'notistack';

import { useSubscription } from '@workshop/relay';

import { GraphQLSubscriptionConfig } from 'relay-runtime';

import { AppQueryResponse } from '../__generated__/AppQuery.graphql';

import { PostNew, updater } from './PostNewSubscription';
import { PostNewSubscription } from './__generated__/PostNewSubscription.graphql';

type Me = AppQueryResponse['me'];

export const useNewPostSubscription = (me: Me) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const postNewConfig = useMemo<GraphQLSubscriptionConfig<PostNewSubscription>>(
    () => ({
      subscription: PostNew,
      variables: {
        input: {},
      },
      onCompleted: (...args) => {
        console.log('onCompleted: ', args);
      },
      onError: (...args) => {
        console.log('onError: ', args);
      },
      onNext: response => {
        const author = response!!.response!!.PostNew!!.post!!.author!!;

        if (author.id !== me!!.id) {
          const action = (key: string) => {
            <Button
              onClick={() => {
                closeSnackbar(key);
              }}
            >
              Close
            </Button>;
          };

          enqueueSnackbar(`New Post from ${author.name}`, {
            variant: 'success',
            action,
          });
        }
      },
      updater,
    }),
    [],
  );

  useSubscription(postNewConfig);
};
