import { Block } from '@/services/base-component';
import chatTemplate from './chat.hbs?raw';
import AvatarMini from '../../../../components/AvatarMini';
import { IChatDTO } from '@/api/chats/chats.model';
import { IProps } from '@/types';

import './chat.pcss';

export interface IChatProps extends IProps {
    avatarMini: AvatarMini;
    link: string;
    chat: IChatDTO;
}

export default class Chat extends Block<IChatProps> {
    private props: IChatProps;

    constructor(props: IChatProps) {
        super('li', {
            attrs: {
                id: props.chat.id,
                class: 'chat',
            },
            ...props,
        });

        this.props = props;
    }

    getId() {
        return String(this.props.chat.id);
    }

    select() {
        const chat = this.getContent();
        chat?.classList.toggle('select');
    }

    render() {
        return this.compile(chatTemplate);
    }
}
