type MessagesType = Record<string, string>;

export const messages: MessagesType = {
  "auth/email-already-in-use":
    "The email address is already in use by another account. Please use a different email address.",
  "auth/invalid-email":
    "The email address you entered is not valid. Please enter a valid email address.",
  "auth/operation-not-allowed":
    "Email/password accounts are not enabled. Please contact support for assistance.",
  "auth/weak-password":
    "The password you entered is not strong enough. It should be at least 6 characters long.",
  "auth/user-disabled":
    "This user account has been disabled. Please contact support for assistance.",
  "auth/wrong-password":
    "The email address or password you entered is not valid. Please try again.",
  "auth/user-not-found":
    "The email address or password you entered is not valid. Please try again.",
  "user-created":
    "Congratulations! Your account has been successfully created.",
  "tournament-created":
    "Congratulations! Your tournament has been successfully created.",
  "tournament-updated": "Tournament Updated",
  "match-created": "Congratulations! Your match has been successfully created.",
  "match-updated": "Match Updated",
  "score-created": "Congratulations! Your score has been successfully created.",
  "user-logged": "Welcome.",
  "loading-message": "Please wait...",
  ok: "Operation successful.",
  cancelled: "The operation was cancelled.",
  unknown: "An unknown error occurred. Please try again later.",
  "invalid-argument":
    "An invalid argument was provided. Please check your input and try again.",
  "deadline-exceeded":
    "The operation took too long to complete. Please try again.",
  "not-found": "The requested resource was not found.",
  "already-exists": "The resource already exists.",
  "permission-denied": "You do not have permission to perform this operation.",
  "resource-exhausted":
    "The resource has been exhausted. Please try again later.",
  "failed-precondition":
    "The operation failed due to a precondition. Please try again later.",
  aborted: "The operation was aborted. Please try again.",
  "out-of-range":
    "The operation is out of range. Please check your input and try again.",
  unimplemented: "The operation is not implemented or not supported.",
  internal: "An internal error occurred. Please try again later.",
  unavailable: "The service is currently unavailable. Please try again later.",
  "data-loss": "An unrecoverable data loss or corruption occurred.",
  unauthenticated: "You are not authenticated to perform this operation.",
};

export enum Messages {
  "USER_CREATED" = "user-created",
  "USER_LOGGED" = "user-logged",
  "LOADING" = "loading-message",
  "TOURNAMENT_CREATED" = "tournament-created",
  "TOURNAMENT_UPDATED" = "tournament-updated",
  "MATCH_CREATED" = "match-created",
  "MATCH_UPDATED" = "match-updated",
  "SCORE_CREATED" = "score-created",
}
