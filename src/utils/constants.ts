export const trialAlertCountLimit = 4;

export type ResponseType<error extends Error, Result = unknown> =
  | {
      result: Result;
      error: null;
    }
  | {
      result: null;
      error: error;
    };
