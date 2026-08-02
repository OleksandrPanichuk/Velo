// @ts-nocheck

import * as Operations from './types';
import * as ApolloReactCommon from '@apollo/client/react';
import * as ApolloReactHooks from '@apollo/client/react';
const defaultOptions = {} as const;


/**
 * __useSignInMutation__
 *
 * To run a mutation, you first call `useSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInMutation, { data, loading, error }] = useSignInMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSignInMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Operations.SignInMutation, Operations.SignInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Operations.SignInMutation, Operations.SignInMutationVariables>(Operations.SignIn, options);
      }
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>;
export type SignInMutationResult = ApolloReactCommon.MutationResult<Operations.SignInMutation>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Operations.SignUpMutation, Operations.SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Operations.SignUpMutation, Operations.SignUpMutationVariables>(Operations.SignUp, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = ApolloReactCommon.MutationResult<Operations.SignUpMutation>;

/**
 * __useRefreshMutation__
 *
 * To run a mutation, you first call `useRefreshMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshMutation, { data, loading, error }] = useRefreshMutation({
 *   variables: {
 *   },
 * });
 */
export function useRefreshMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Operations.RefreshMutation, Operations.RefreshMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Operations.RefreshMutation, Operations.RefreshMutationVariables>(Operations.Refresh, options);
      }
export type RefreshMutationHookResult = ReturnType<typeof useRefreshMutation>;
export type RefreshMutationResult = ApolloReactCommon.MutationResult<Operations.RefreshMutation>;

/**
 * __useSignOutMutation__
 *
 * To run a mutation, you first call `useSignOutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignOutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signOutMutation, { data, loading, error }] = useSignOutMutation({
 *   variables: {
 *   },
 * });
 */
export function useSignOutMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Operations.SignOutMutation, Operations.SignOutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Operations.SignOutMutation, Operations.SignOutMutationVariables>(Operations.SignOut, options);
      }
export type SignOutMutationHookResult = ReturnType<typeof useSignOutMutation>;
export type SignOutMutationResult = ApolloReactCommon.MutationResult<Operations.SignOutMutation>;

/**
 * __useVerifyEmailMutation__
 *
 * To run a mutation, you first call `useVerifyEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyEmailMutation, { data, loading, error }] = useVerifyEmailMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useVerifyEmailMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Operations.VerifyEmailMutation, Operations.VerifyEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Operations.VerifyEmailMutation, Operations.VerifyEmailMutationVariables>(Operations.VerifyEmail, options);
      }
export type VerifyEmailMutationHookResult = ReturnType<typeof useVerifyEmailMutation>;
export type VerifyEmailMutationResult = ApolloReactCommon.MutationResult<Operations.VerifyEmailMutation>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Operations.ForgotPasswordMutation, Operations.ForgotPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Operations.ForgotPasswordMutation, Operations.ForgotPasswordMutationVariables>(Operations.ForgotPassword, options);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = ApolloReactCommon.MutationResult<Operations.ForgotPasswordMutation>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Operations.ResetPasswordMutation, Operations.ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Operations.ResetPasswordMutation, Operations.ResetPasswordMutationVariables>(Operations.ResetPassword, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = ApolloReactCommon.MutationResult<Operations.ResetPasswordMutation>;

/**
 * __useInviteMemberMutation__
 *
 * To run a mutation, you first call `useInviteMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInviteMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [inviteMemberMutation, { data, loading, error }] = useInviteMemberMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useInviteMemberMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Operations.InviteMemberMutation, Operations.InviteMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Operations.InviteMemberMutation, Operations.InviteMemberMutationVariables>(Operations.InviteMember, options);
      }
export type InviteMemberMutationHookResult = ReturnType<typeof useInviteMemberMutation>;
export type InviteMemberMutationResult = ApolloReactCommon.MutationResult<Operations.InviteMemberMutation>;

/**
 * __useRevokeInviteMutation__
 *
 * To run a mutation, you first call `useRevokeInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRevokeInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [revokeInviteMutation, { data, loading, error }] = useRevokeInviteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRevokeInviteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Operations.RevokeInviteMutation, Operations.RevokeInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Operations.RevokeInviteMutation, Operations.RevokeInviteMutationVariables>(Operations.RevokeInvite, options);
      }
export type RevokeInviteMutationHookResult = ReturnType<typeof useRevokeInviteMutation>;
export type RevokeInviteMutationResult = ApolloReactCommon.MutationResult<Operations.RevokeInviteMutation>;

/**
 * __useAcceptInviteMutation__
 *
 * To run a mutation, you first call `useAcceptInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptInviteMutation, { data, loading, error }] = useAcceptInviteMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useAcceptInviteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Operations.AcceptInviteMutation, Operations.AcceptInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Operations.AcceptInviteMutation, Operations.AcceptInviteMutationVariables>(Operations.AcceptInvite, options);
      }
export type AcceptInviteMutationHookResult = ReturnType<typeof useAcceptInviteMutation>;
export type AcceptInviteMutationResult = ApolloReactCommon.MutationResult<Operations.AcceptInviteMutation>;

/**
 * __useGetPendingInvitesQuery__
 *
 * To run a query within a React component, call `useGetPendingInvitesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPendingInvitesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPendingInvitesQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetPendingInvitesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Operations.GetPendingInvitesQuery, Operations.GetPendingInvitesQueryVariables> & ({ variables: Operations.GetPendingInvitesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Operations.GetPendingInvitesQuery, Operations.GetPendingInvitesQueryVariables>(Operations.GetPendingInvites, options);
      }
export function useGetPendingInvitesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Operations.GetPendingInvitesQuery, Operations.GetPendingInvitesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Operations.GetPendingInvitesQuery, Operations.GetPendingInvitesQueryVariables>(Operations.GetPendingInvites, options);
        }
// @ts-ignore
export function useGetPendingInvitesSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetPendingInvitesQuery, Operations.GetPendingInvitesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<Operations.GetPendingInvitesQuery, Operations.GetPendingInvitesQueryVariables>;
export function useGetPendingInvitesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetPendingInvitesQuery, Operations.GetPendingInvitesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<Operations.GetPendingInvitesQuery | undefined, Operations.GetPendingInvitesQueryVariables>;
export function useGetPendingInvitesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetPendingInvitesQuery, Operations.GetPendingInvitesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<Operations.GetPendingInvitesQuery, Operations.GetPendingInvitesQueryVariables>(Operations.GetPendingInvites, options);
        }
export type GetPendingInvitesQueryHookResult = ReturnType<typeof useGetPendingInvitesQuery>;
export type GetPendingInvitesLazyQueryHookResult = ReturnType<typeof useGetPendingInvitesLazyQuery>;
export type GetPendingInvitesSuspenseQueryHookResult = ReturnType<typeof useGetPendingInvitesSuspenseQuery>;
export type GetPendingInvitesQueryResult = ApolloReactCommon.QueryResult<Operations.GetPendingInvitesQuery, Operations.GetPendingInvitesQueryVariables>;

/**
 * __useMarkNotificationAsReadMutation__
 *
 * To run a mutation, you first call `useMarkNotificationAsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkNotificationAsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markNotificationAsReadMutation, { data, loading, error }] = useMarkNotificationAsReadMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMarkNotificationAsReadMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Operations.MarkNotificationAsReadMutation, Operations.MarkNotificationAsReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Operations.MarkNotificationAsReadMutation, Operations.MarkNotificationAsReadMutationVariables>(Operations.MarkNotificationAsRead, options);
      }
export type MarkNotificationAsReadMutationHookResult = ReturnType<typeof useMarkNotificationAsReadMutation>;
export type MarkNotificationAsReadMutationResult = ApolloReactCommon.MutationResult<Operations.MarkNotificationAsReadMutation>;

/**
 * __useMarkAllNotificationsAsReadMutation__
 *
 * To run a mutation, you first call `useMarkAllNotificationsAsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkAllNotificationsAsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markAllNotificationsAsReadMutation, { data, loading, error }] = useMarkAllNotificationsAsReadMutation({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useMarkAllNotificationsAsReadMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Operations.MarkAllNotificationsAsReadMutation, Operations.MarkAllNotificationsAsReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Operations.MarkAllNotificationsAsReadMutation, Operations.MarkAllNotificationsAsReadMutationVariables>(Operations.MarkAllNotificationsAsRead, options);
      }
export type MarkAllNotificationsAsReadMutationHookResult = ReturnType<typeof useMarkAllNotificationsAsReadMutation>;
export type MarkAllNotificationsAsReadMutationResult = ApolloReactCommon.MutationResult<Operations.MarkAllNotificationsAsReadMutation>;

/**
 * __useGetNotificationsQuery__
 *
 * To run a query within a React component, call `useGetNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNotificationsQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetNotificationsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Operations.GetNotificationsQuery, Operations.GetNotificationsQueryVariables> & ({ variables: Operations.GetNotificationsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Operations.GetNotificationsQuery, Operations.GetNotificationsQueryVariables>(Operations.GetNotifications, options);
      }
export function useGetNotificationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Operations.GetNotificationsQuery, Operations.GetNotificationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Operations.GetNotificationsQuery, Operations.GetNotificationsQueryVariables>(Operations.GetNotifications, options);
        }
// @ts-ignore
export function useGetNotificationsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetNotificationsQuery, Operations.GetNotificationsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<Operations.GetNotificationsQuery, Operations.GetNotificationsQueryVariables>;
export function useGetNotificationsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetNotificationsQuery, Operations.GetNotificationsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<Operations.GetNotificationsQuery | undefined, Operations.GetNotificationsQueryVariables>;
export function useGetNotificationsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetNotificationsQuery, Operations.GetNotificationsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<Operations.GetNotificationsQuery, Operations.GetNotificationsQueryVariables>(Operations.GetNotifications, options);
        }
export type GetNotificationsQueryHookResult = ReturnType<typeof useGetNotificationsQuery>;
export type GetNotificationsLazyQueryHookResult = ReturnType<typeof useGetNotificationsLazyQuery>;
export type GetNotificationsSuspenseQueryHookResult = ReturnType<typeof useGetNotificationsSuspenseQuery>;
export type GetNotificationsQueryResult = ApolloReactCommon.QueryResult<Operations.GetNotificationsQuery, Operations.GetNotificationsQueryVariables>;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Operations.GetUsersQuery, Operations.GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Operations.GetUsersQuery, Operations.GetUsersQueryVariables>(Operations.GetUsers, options);
      }
export function useGetUsersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Operations.GetUsersQuery, Operations.GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Operations.GetUsersQuery, Operations.GetUsersQueryVariables>(Operations.GetUsers, options);
        }
// @ts-ignore
export function useGetUsersSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetUsersQuery, Operations.GetUsersQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<Operations.GetUsersQuery, Operations.GetUsersQueryVariables>;
export function useGetUsersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetUsersQuery, Operations.GetUsersQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<Operations.GetUsersQuery | undefined, Operations.GetUsersQueryVariables>;
export function useGetUsersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetUsersQuery, Operations.GetUsersQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<Operations.GetUsersQuery, Operations.GetUsersQueryVariables>(Operations.GetUsers, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersSuspenseQueryHookResult = ReturnType<typeof useGetUsersSuspenseQuery>;
export type GetUsersQueryResult = ApolloReactCommon.QueryResult<Operations.GetUsersQuery, Operations.GetUsersQueryVariables>;

/**
 * __useGetUserByIdQuery__
 *
 * To run a query within a React component, call `useGetUserByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserByIdQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Operations.GetUserByIdQuery, Operations.GetUserByIdQueryVariables> & ({ variables: Operations.GetUserByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Operations.GetUserByIdQuery, Operations.GetUserByIdQueryVariables>(Operations.GetUserById, options);
      }
export function useGetUserByIdLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Operations.GetUserByIdQuery, Operations.GetUserByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Operations.GetUserByIdQuery, Operations.GetUserByIdQueryVariables>(Operations.GetUserById, options);
        }
// @ts-ignore
export function useGetUserByIdSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetUserByIdQuery, Operations.GetUserByIdQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<Operations.GetUserByIdQuery, Operations.GetUserByIdQueryVariables>;
export function useGetUserByIdSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetUserByIdQuery, Operations.GetUserByIdQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<Operations.GetUserByIdQuery | undefined, Operations.GetUserByIdQueryVariables>;
export function useGetUserByIdSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetUserByIdQuery, Operations.GetUserByIdQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<Operations.GetUserByIdQuery, Operations.GetUserByIdQueryVariables>(Operations.GetUserById, options);
        }
export type GetUserByIdQueryHookResult = ReturnType<typeof useGetUserByIdQuery>;
export type GetUserByIdLazyQueryHookResult = ReturnType<typeof useGetUserByIdLazyQuery>;
export type GetUserByIdSuspenseQueryHookResult = ReturnType<typeof useGetUserByIdSuspenseQuery>;
export type GetUserByIdQueryResult = ApolloReactCommon.QueryResult<Operations.GetUserByIdQuery, Operations.GetUserByIdQueryVariables>;

/**
 * __useGetCurrentUserQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUserQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Operations.GetCurrentUserQuery, Operations.GetCurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Operations.GetCurrentUserQuery, Operations.GetCurrentUserQueryVariables>(Operations.GetCurrentUser, options);
      }
export function useGetCurrentUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Operations.GetCurrentUserQuery, Operations.GetCurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Operations.GetCurrentUserQuery, Operations.GetCurrentUserQueryVariables>(Operations.GetCurrentUser, options);
        }
// @ts-ignore
export function useGetCurrentUserSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetCurrentUserQuery, Operations.GetCurrentUserQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<Operations.GetCurrentUserQuery, Operations.GetCurrentUserQueryVariables>;
export function useGetCurrentUserSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetCurrentUserQuery, Operations.GetCurrentUserQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<Operations.GetCurrentUserQuery | undefined, Operations.GetCurrentUserQueryVariables>;
export function useGetCurrentUserSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetCurrentUserQuery, Operations.GetCurrentUserQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<Operations.GetCurrentUserQuery, Operations.GetCurrentUserQueryVariables>(Operations.GetCurrentUser, options);
        }
export type GetCurrentUserQueryHookResult = ReturnType<typeof useGetCurrentUserQuery>;
export type GetCurrentUserLazyQueryHookResult = ReturnType<typeof useGetCurrentUserLazyQuery>;
export type GetCurrentUserSuspenseQueryHookResult = ReturnType<typeof useGetCurrentUserSuspenseQuery>;
export type GetCurrentUserQueryResult = ApolloReactCommon.QueryResult<Operations.GetCurrentUserQuery, Operations.GetCurrentUserQueryVariables>;

/**
 * __useCreateWorkspaceMutation__
 *
 * To run a mutation, you first call `useCreateWorkspaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateWorkspaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createWorkspaceMutation, { data, loading, error }] = useCreateWorkspaceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateWorkspaceMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Operations.CreateWorkspaceMutation, Operations.CreateWorkspaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<Operations.CreateWorkspaceMutation, Operations.CreateWorkspaceMutationVariables>(Operations.CreateWorkspace, options);
      }
export type CreateWorkspaceMutationHookResult = ReturnType<typeof useCreateWorkspaceMutation>;
export type CreateWorkspaceMutationResult = ApolloReactCommon.MutationResult<Operations.CreateWorkspaceMutation>;

/**
 * __useGetWorkspacesQuery__
 *
 * To run a query within a React component, call `useGetWorkspacesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspacesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspacesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetWorkspacesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Operations.GetWorkspacesQuery, Operations.GetWorkspacesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Operations.GetWorkspacesQuery, Operations.GetWorkspacesQueryVariables>(Operations.GetWorkspaces, options);
      }
export function useGetWorkspacesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Operations.GetWorkspacesQuery, Operations.GetWorkspacesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Operations.GetWorkspacesQuery, Operations.GetWorkspacesQueryVariables>(Operations.GetWorkspaces, options);
        }
// @ts-ignore
export function useGetWorkspacesSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetWorkspacesQuery, Operations.GetWorkspacesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<Operations.GetWorkspacesQuery, Operations.GetWorkspacesQueryVariables>;
export function useGetWorkspacesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetWorkspacesQuery, Operations.GetWorkspacesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<Operations.GetWorkspacesQuery | undefined, Operations.GetWorkspacesQueryVariables>;
export function useGetWorkspacesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetWorkspacesQuery, Operations.GetWorkspacesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<Operations.GetWorkspacesQuery, Operations.GetWorkspacesQueryVariables>(Operations.GetWorkspaces, options);
        }
export type GetWorkspacesQueryHookResult = ReturnType<typeof useGetWorkspacesQuery>;
export type GetWorkspacesLazyQueryHookResult = ReturnType<typeof useGetWorkspacesLazyQuery>;
export type GetWorkspacesSuspenseQueryHookResult = ReturnType<typeof useGetWorkspacesSuspenseQuery>;
export type GetWorkspacesQueryResult = ApolloReactCommon.QueryResult<Operations.GetWorkspacesQuery, Operations.GetWorkspacesQueryVariables>;

/**
 * __useGetWorkspaceBySlugQuery__
 *
 * To run a query within a React component, call `useGetWorkspaceBySlugQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspaceBySlugQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspaceBySlugQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetWorkspaceBySlugQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Operations.GetWorkspaceBySlugQuery, Operations.GetWorkspaceBySlugQueryVariables> & ({ variables: Operations.GetWorkspaceBySlugQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Operations.GetWorkspaceBySlugQuery, Operations.GetWorkspaceBySlugQueryVariables>(Operations.GetWorkspaceBySlug, options);
      }
export function useGetWorkspaceBySlugLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Operations.GetWorkspaceBySlugQuery, Operations.GetWorkspaceBySlugQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Operations.GetWorkspaceBySlugQuery, Operations.GetWorkspaceBySlugQueryVariables>(Operations.GetWorkspaceBySlug, options);
        }
// @ts-ignore
export function useGetWorkspaceBySlugSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetWorkspaceBySlugQuery, Operations.GetWorkspaceBySlugQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<Operations.GetWorkspaceBySlugQuery, Operations.GetWorkspaceBySlugQueryVariables>;
export function useGetWorkspaceBySlugSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetWorkspaceBySlugQuery, Operations.GetWorkspaceBySlugQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<Operations.GetWorkspaceBySlugQuery | undefined, Operations.GetWorkspaceBySlugQueryVariables>;
export function useGetWorkspaceBySlugSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetWorkspaceBySlugQuery, Operations.GetWorkspaceBySlugQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<Operations.GetWorkspaceBySlugQuery, Operations.GetWorkspaceBySlugQueryVariables>(Operations.GetWorkspaceBySlug, options);
        }
export type GetWorkspaceBySlugQueryHookResult = ReturnType<typeof useGetWorkspaceBySlugQuery>;
export type GetWorkspaceBySlugLazyQueryHookResult = ReturnType<typeof useGetWorkspaceBySlugLazyQuery>;
export type GetWorkspaceBySlugSuspenseQueryHookResult = ReturnType<typeof useGetWorkspaceBySlugSuspenseQuery>;
export type GetWorkspaceBySlugQueryResult = ApolloReactCommon.QueryResult<Operations.GetWorkspaceBySlugQuery, Operations.GetWorkspaceBySlugQueryVariables>;

/**
 * __useGetMembersQuery__
 *
 * To run a query within a React component, call `useGetMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMembersQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetMembersQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Operations.GetMembersQuery, Operations.GetMembersQueryVariables> & ({ variables: Operations.GetMembersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Operations.GetMembersQuery, Operations.GetMembersQueryVariables>(Operations.GetMembers, options);
      }
export function useGetMembersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Operations.GetMembersQuery, Operations.GetMembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Operations.GetMembersQuery, Operations.GetMembersQueryVariables>(Operations.GetMembers, options);
        }
// @ts-ignore
export function useGetMembersSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetMembersQuery, Operations.GetMembersQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<Operations.GetMembersQuery, Operations.GetMembersQueryVariables>;
export function useGetMembersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetMembersQuery, Operations.GetMembersQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<Operations.GetMembersQuery | undefined, Operations.GetMembersQueryVariables>;
export function useGetMembersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetMembersQuery, Operations.GetMembersQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<Operations.GetMembersQuery, Operations.GetMembersQueryVariables>(Operations.GetMembers, options);
        }
export type GetMembersQueryHookResult = ReturnType<typeof useGetMembersQuery>;
export type GetMembersLazyQueryHookResult = ReturnType<typeof useGetMembersLazyQuery>;
export type GetMembersSuspenseQueryHookResult = ReturnType<typeof useGetMembersSuspenseQuery>;
export type GetMembersQueryResult = ApolloReactCommon.QueryResult<Operations.GetMembersQuery, Operations.GetMembersQueryVariables>;

/**
 * __useGetWorkspaceDetailsQuery__
 *
 * To run a query within a React component, call `useGetWorkspaceDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspaceDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspaceDetailsQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetWorkspaceDetailsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<Operations.GetWorkspaceDetailsQuery, Operations.GetWorkspaceDetailsQueryVariables> & ({ variables: Operations.GetWorkspaceDetailsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<Operations.GetWorkspaceDetailsQuery, Operations.GetWorkspaceDetailsQueryVariables>(Operations.GetWorkspaceDetails, options);
      }
export function useGetWorkspaceDetailsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Operations.GetWorkspaceDetailsQuery, Operations.GetWorkspaceDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<Operations.GetWorkspaceDetailsQuery, Operations.GetWorkspaceDetailsQueryVariables>(Operations.GetWorkspaceDetails, options);
        }
// @ts-ignore
export function useGetWorkspaceDetailsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetWorkspaceDetailsQuery, Operations.GetWorkspaceDetailsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<Operations.GetWorkspaceDetailsQuery, Operations.GetWorkspaceDetailsQueryVariables>;
export function useGetWorkspaceDetailsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetWorkspaceDetailsQuery, Operations.GetWorkspaceDetailsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<Operations.GetWorkspaceDetailsQuery | undefined, Operations.GetWorkspaceDetailsQueryVariables>;
export function useGetWorkspaceDetailsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<Operations.GetWorkspaceDetailsQuery, Operations.GetWorkspaceDetailsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<Operations.GetWorkspaceDetailsQuery, Operations.GetWorkspaceDetailsQueryVariables>(Operations.GetWorkspaceDetails, options);
        }
export type GetWorkspaceDetailsQueryHookResult = ReturnType<typeof useGetWorkspaceDetailsQuery>;
export type GetWorkspaceDetailsLazyQueryHookResult = ReturnType<typeof useGetWorkspaceDetailsLazyQuery>;
export type GetWorkspaceDetailsSuspenseQueryHookResult = ReturnType<typeof useGetWorkspaceDetailsSuspenseQuery>;
export type GetWorkspaceDetailsQueryResult = ApolloReactCommon.QueryResult<Operations.GetWorkspaceDetailsQuery, Operations.GetWorkspaceDetailsQueryVariables>;