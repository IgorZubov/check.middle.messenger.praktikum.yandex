import { Block } from '@/services/base-component';
import { IRouter } from './router';

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

export enum Events {
    CLICK = 'click',
}

export type EventKeys = keyof Events;

export type EventHandler<K extends EventKeys> = (event: Events[K]) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TCallback = (...args: any[]) => void;
export type TCallbackEmpty = () => void;

export enum EPages {
    loginPage = 'loginPage',
    registerPage = 'registerPage',
    chatsPage = 'chatsPage',
    profilePage = 'profilePage',
    profileEditPage = 'profileEditPage',
    notFoundPage = 'notFoundPage',
    serverErrorPage = 'serverErrorPage',
}

export enum LoginFormInputs {
    login = 'login',
    password = 'password',
}

export enum Event {
    INIT = 'init',
    MOUNTED = 'mounted',
    UPDATED = 'updated',
    RENDER = 'render',
}

export interface IProps extends Record<string, unknown> {
    settings?: {
        withInternalId?: boolean;
        isSimple?: boolean;
    };
    attrs?: object;
    router?: IRouter;
}

export type TProps = {
    [key: string]: unknown;
    settings?: {
        withInternalId?: boolean;
        isSimple?: boolean;
    };
    attrs?: object;
};

export type TIterableObject = {
    [index: string]: unknown;
};

export type Indexed<T = unknown> = {
    [key in string | symbol]: T;
};

export type TChildren = Record<string, Block>;

export type TMeta = {
    tagName: string;
    props: TProps;
};

export type TEvents = Record<string, TCallback>;

export interface IRequestResult {
    ok: boolean;
    status: number;
    statusText: string;
    data: string;
    json: <T>() => T | null;
    headers: string;
}

export function isWindow(element: unknown): element is Window {
    return element instanceof Window;
}
