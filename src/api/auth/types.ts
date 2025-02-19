import { IRequestResult } from '@/types';

export interface IAuthApi {
    login(data: IUserLogin): Promise<IRequestResult>;
    registration(data: IUserRegistration): Promise<IRequestResult>;
    me(): Promise<IRequestResult>;
    logout(): Promise<IRequestResult>;
}

export interface IUserRegistration extends FormData {
    first_name: string;
    second_name: string;
    login: string;
    email: string;
    password: string;
    phone: string;
}

export interface IUserLogin extends FormData {
    login: string;
    password: string;
}
