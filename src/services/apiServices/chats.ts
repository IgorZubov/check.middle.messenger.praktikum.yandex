import ChatsApi from '@/api/chats/chats.api';
import * as ChatDTO from '@/api/chats/chats.model';
import * as ChatTypes from '@/api/chats/types';
import { IMG_BASE_URL } from '@/constants';
import { ERouter } from '@/constants/router';

const chatsApi = new ChatsApi();

export const getChats = async (): Promise<ChatDTO.IChatDTO[]> => {
    window.store.setState({ isLoading: true });
    try {
        const xhr = await chatsApi.getChats();
        if (xhr.ok) {
            const chats = xhr.json<ChatDTO.IChatDTO[]>() || [];
            const adapterChats = chats.map((chat) => ({
                ...chat,
                avatar: chat?.avatar ? `${IMG_BASE_URL}${chat?.avatar}` : null,
            }));
            window.store.setState({ chats: adapterChats });
            return adapterChats;
        } else if (xhr.status === 401) {
            window.store.clearState();
            window.router.go(ERouter.LOGIN);
        }
        return [];
    } catch (responsError: unknown) {
        console.error(responsError);
        console.error('getChatUsers response error', responsError);
        window.store.clearState();
        window.router.go(ERouter.LOGIN);
        return [];
    } finally {
        window.store.setState({ isLoading: false });
    }
};

export const addChat = async (form: ChatTypes.IChatCreate): Promise<ChatDTO.IChatCreateDTO | null> => {
    window.store.setState({ isLoading: true });
    try {
        const xhr = await chatsApi.addChat(form);
        if (xhr.ok) {
            const chat = xhr.json<ChatDTO.IChatCreateDTO>();
            return chat;
        }
        return null;
    } catch (responsError: unknown) {
        console.error(responsError);
        return null;
    } finally {
        window.store.setState({ isLoading: false });
    }
};

export const deleteChat = async (form: ChatTypes.IChatDelete): Promise<ChatDTO.IChatDeleteDTO | null> => {
    window.store.setState({ isLoading: true });
    try {
        const xhr = await chatsApi.deleteChat(form);
        if (xhr.ok) {
            return xhr.json<ChatDTO.IChatDeleteDTO>();
        }
        return null;
    } catch (responsError: unknown) {
        console.error(responsError);
        return null;
    } finally {
        window.store.setState({ isLoading: false });
    }
};

export const getChatUsers = async (form: ChatTypes.IChatUserParams): Promise<ChatDTO.IChatUserDTO[]> => {
    window.store.setState({ isLoading: true });
    try {
        const xhr = await chatsApi.getChatUsers(form);
        if (xhr.ok) {
            return xhr.json<ChatDTO.IChatUserDTO[]>() || [];
        }
        return [];
    } catch (responsError: unknown) {
        console.error(responsError);
        return [];
    } finally {
        window.store.setState({ isLoading: false });
    }
};

export const addUser = async (form: ChatTypes.IChatUserPut): Promise<void> => {
    window.store.setState({ isLoading: true });
    try {
        await chatsApi.addUser(form);
    } catch (responsError: unknown) {
        console.error(responsError);
    } finally {
        window.store.setState({ isLoading: false });
    }
};

export const deleteUser = async (form: ChatTypes.IChatUserPut): Promise<void> => {
    window.store.setState({ isLoading: true });
    try {
        await chatsApi.deleteUser(form);
    } catch (responsError: unknown) {
        console.error(responsError);
    } finally {
        window.store.setState({ isLoading: false });
    }
};

export const getChatToken = async (chatId: number): Promise<string | null> => {
    try {
        const xhr = await chatsApi.getToken(chatId);
        const data = xhr.json<ChatDTO.IToken>();
        window.store.setState({ token: data?.token || null });
        return data?.token ?? null;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getChatNewMessagesCount = async (chatId: number): Promise<number> => {
    try {
        const xhr = await chatsApi.getChatMessagesCount(chatId);
        const data = xhr.json<ChatDTO.IChatNewMessagesConut>();
        window.store.setState({ newMessagesCount: data?.unread_count ?? 0 });
        return data?.unread_count ?? 0;
    } catch (error) {
        console.log(error);
        return 0;
    }
};
