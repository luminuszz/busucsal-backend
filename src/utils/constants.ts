export const trialAlertCountLimit = 4;

export type EitherResponse<error extends Error, Result = unknown> =
  | {
      result: Result;
      error: null;
    }
  | {
      result: null;
      error: error;
    };

export enum AlertType {
  bussBroken = "bussBroken",
  bussLate = "bussLate",
  bussOnTime = "bussOnTime",
}
