import { IRequestResult } from '@/types';

export interface IChatsApi {
    getChats(data: IChatParams): Promise<IRequestResult>;
    addChat(data: IChatCreate): Promise<IRequestResult>;
    deleteChat(data: IChatDelete): Promise<IRequestResult>;
    getChatUsers(data: IChatUserParams): Promise<IRequestResult>;
    addUser(data: IChatUserPut): Promise<IRequestResult>;
    deleteUser(data: IChatUserPut): Promise<IRequestResult>;
    getToken(chatId: number): Promise<IRequestResult>;
    getChatMessagesCount(chatId: number): Promise<IRequestResult>;
}

export interface IChatParams {
    offset?: number;
    limit?: number;
    title?: string;
}

export interface IChatCreate {
    title: string;
}

export interface IChatDelete {
    chatId: number;
}

export interface IChatUserParams extends Omit<IChatParams, 'title'> {
    id: number;
    name?: string;
    email?: string;
}

export interface IChatUserPut {
    users: number[];
    chatId: number;
}
