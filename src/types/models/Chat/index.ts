import { UserModel } from "../User";

export interface ChatModel {
  id: number;
  title: string;
  avatar: string;
  unread_count: number;
  last_message: {
    user: UserModel;
    time: string | Date;
    content: string;
  };
}

export interface ChatUserModel {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  avatar: string;
  role: string;
}
