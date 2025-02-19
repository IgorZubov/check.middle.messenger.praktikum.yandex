export enum Routes {
  Home = "/",
  Register = "/sign-up",
  Chats = "/messenger",
  EditPassword = "/edit-password",
  EditProfile = "/edit-profile",
  Profile = "/settings",
  Error = "/500",
  NotFound = "/404",
}

export type { AuthSignupRequest, AuthSignupResponse, AuthSignInRequest } from "./Auth/Auth.dto";
