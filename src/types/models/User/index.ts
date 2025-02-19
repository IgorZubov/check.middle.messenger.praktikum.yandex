export interface UserModel {
  id: number;
  first_name: string;
  second_name: string;
  display_name?: string;
  login: string;
  avatar?: string;
  phone?: string;
  email?: string;
}
