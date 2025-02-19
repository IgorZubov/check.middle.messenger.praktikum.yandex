import { UserModel } from "../models/User";

export interface ChangePasswordRequest {
  newPassword: string;
  oldPassword: string;
}

export type profileRequest = Omit<UserModel, "id" | "avatar">;
export type profileResponse = UserModel;

export type avatarResponse = UserModel;
