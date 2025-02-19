import { HTTPTransport } from '@/services/httpTransport';
import { IAuthApi, IUserLogin, IUserRegistration } from './types';

const httpApi = new HTTPTransport('/auth');

const options = {
    mode: 'cors',
    headers: {
        Accept: 'application/json',
    },
};

export default class AuthApi implements IAuthApi {
    async login(data: IUserLogin) {
        return httpApi.post('/signin', { ...options, data });
    }
    async registration(data: IUserRegistration) {
        return httpApi.post('/signup', { ...options, data });
    }
    async me() {
        return httpApi.get('/user', options);
    }
    async logout() {
        return httpApi.post('/logout', options);
    }
}
