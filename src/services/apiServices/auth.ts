import AuthApi from '@/api/auth/auth.api';
import { IUserLogin, IUserRegistration } from '@/api/auth/types';
import { IUserDTO } from '@/api/user/user.model';
import { ERouter } from '@/constants/router';
import { Indexed } from '@/types';

const authApi = new AuthApi();

export const login = async (loginForm: IUserLogin): Promise<void> => {
    window.store.setState({ isLoading: true });
    try {
        const xhr = await authApi.login(loginForm);
        if (xhr.ok) {
            await me();
            window.router.go(ERouter.MESSENGER);
        } else if (xhr.status === 400 && xhr.data) {
            const errData = JSON.parse(xhr.data);

            if (errData?.reason === 'User already in system') {
                await me();
                window.router.go(ERouter.MESSENGER);
            }
        } else if (xhr.status >= 500) {
            window.router.go(ERouter.SERVER_ERROR);
        }
    } catch (responsError: unknown) {
        if ((responsError as Indexed)?.reason === 'User already in system') {
            window.router.go(ERouter.MESSENGER);
        }
        console.error(responsError);
    } finally {
        window.store.setState({ isLoading: false });
    }
};

export const register = async (registerForm: IUserRegistration): Promise<void> => {
    window.store.setState({ isLoading: true });
    try {
        const xhr = await authApi.registration(registerForm);

        if (xhr.ok) {
            window.router.go(ERouter.MESSENGER);
        } else if (xhr.status === 400 && xhr.data) {
            const errData = JSON.parse(xhr.data);
            if (errData?.reason === 'User already in system') {
                window.router.go(ERouter.MESSENGER);
            }
        } else if (xhr.status >= 500) {
            window.router.go(ERouter.SERVER_ERROR);
        }
    } catch (responsError: unknown) {
        console.error(responsError);
        if ((responsError as Indexed)?.reason === 'User already in system') {
            window.router.go(ERouter.MESSENGER);
        }
    } finally {
        window.store.setState({ isLoading: false });
    }
};

export const me = async (): Promise<IUserDTO | null> => {
    window.store.setState({ isLoading: true });
    try {
        const xhr = await authApi.me();
        if (xhr.ok) {
            const data = xhr.json<IUserDTO>();
            window.store.setState({ authUser: data });
            return data;
        }
        return null;
    } catch (responsError: unknown) {
        console.error(responsError);
        return null;
    } finally {
        window.store.setState({ isLoading: false });
    }
};

export const logout = async () => {
    window.store.setState({ isLoading: true });
    try {
        const xhr = await authApi.logout();
        if (xhr.ok) {
            window.store.clearState();
        } else if (xhr.status >= 500) {
            window.router.go(ERouter.SERVER_ERROR);
        }
    } catch (responsError: unknown) {
        console.error(responsError);
        window.router.go(ERouter.SERVER_ERROR);
    } finally {
        window.store.setState({ isLoading: false });
    }
};
