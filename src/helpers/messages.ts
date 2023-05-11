type MessagesType = Record<string, string>;

export const messages: MessagesType = {
  "auth/email-already-in-use":
    "The email address is already in use by another account.",
  "auth/invalid-email": "The email address is not valid.",
  "auth/operation-not-allowed":
    "Email/password accounts are not enabled. Enable them in the Firebase Console, under the Auth tab.",
  "auth/weak-password":
    "The password is not strong enough. It should be at least 6 characters long.",
  "auth/user-disabled": "This user account has been disabled.",
  "auth/wrong-password": "The email address or password is not valid.",
  "auth/user-not-found": "The email address or password is not valid.",
  "user-created":
    "Congratulations! Your account has been successfully created.",
  "user-logged": "Welcome.",
  "loading-message": "Please wait...",
};

export enum Messages {
  "USER_CREATED" = "user-created",
  "USER_LOGGED" = "user-logged",
  "LOADING" = "loading-message",
}
