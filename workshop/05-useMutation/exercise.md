# 05 - useMutation

Learn how to use useMutation to modify GraphQL data

## Exercise

- run `yarn get-token` to get an user token, put the token on Authorization header on Network Layer
- Create a PostLike mutation to like a Post

## Extras

- [x] implement PostUnLike mutation
- [x] add optimistic response to provide a fast feedback to user

## Code Helpers

PostLikeMutation
```
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
```