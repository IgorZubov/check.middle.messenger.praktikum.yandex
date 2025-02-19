export interface IChatDTO {
    id: number;
    title: string;
    avatar: string | null;
    created_by: number;
    unread_count: number;
    last_message: {
        user: IChatUser;
        time: string;
        content: string;
    } | null;
}

export interface IChatCreateDTO {
    id: number;
}

export interface IChatDeleteDTO {
    chatId: number;
}

export interface IChatUserDTO {
    id: number;
    first_name: string;
    second_name: string;
    display_name: string | null;
    login: string;
    avatar: File | null;
    role: string;
}

export interface IChatUser extends Omit<IChatUserDTO, 'id | display_name | role'> {
    email: string;
    phone: string;
}

export interface IToken {
    token: string;
}

export interface IChatNewMessagesConut {
    unread_count: number;
}
