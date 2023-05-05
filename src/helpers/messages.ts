type MessagesType = Record<string, string>

export const messages: MessagesType = {
  'auth/email-already-in-use':
    'The email address is already in use by another account.',
  'auth/invalid-email': 'The email address is not valid.',
  'auth/operation-not-allowed':
    'Email/password accounts are not enabled. Enable them in the Firebase Console, under the Auth tab.',
  'auth/weak-password':
    'The password is not strong enough. It should be at least 6 characters long.',
  'user-created':
    'Congratulations! Your account has been successfully created.',
  'loading-message': 'Please wait...'
}

export enum Messages {
  'USER_CREATED' = 'user-created',
  'LOADING' = 'loading-message',
}
