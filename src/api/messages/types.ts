export interface IMessageOld {
    id: number;
    chat_id: number;
    user_id: string;
    type: 'message' | 'file';
    time: string;
    content: string;
    file: IMessageFile | null;
    is_read: boolean;
}

export interface IMessageDTO {
    id: string;
    user_id: string;
    type: 'message' | 'file';
    time: string;
    content: string;
    file?: IMessageFile;
}

export interface IMessage extends IMessageDTO {
    localTime: string;
    date: string;
    typeMessage: 'me' | 'incomer';
    isMe: boolean;
}

export interface IMessageFile {
    id: number;
    user_id: number;
    path: 'string';
    filename: 'string';
    content_type: 'string';
    content_size: number;
    upload_date: 'string';
}
