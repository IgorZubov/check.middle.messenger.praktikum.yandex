import { IRequestResult } from '@/types';

export interface IUserApi {
    putProfile(data: IProfileData): Promise<IRequestResult>;
    putAvatar(data: IUserAvatar): Promise<IRequestResult>;
    putPassword(data: IUserChangePassword): Promise<IRequestResult>;
    postSearch(data: IUserSearch): Promise<IRequestResult>;
}

export interface IUserSearch {
    login: string;
}

export interface IProfileData extends FormData {
    first_name: string;
    second_name: string;
    display_name: string;
    login: string;
    email: string;
    phone: string;
}

export interface IUserAvatar extends FormData {
    avatar: File;
}

export interface IUserChangePassword extends FormData {
    oldPassword: string;
    newPassword: string;
}
