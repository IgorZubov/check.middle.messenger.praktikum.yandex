import { IChatDTO } from '@/api/chats/chats.model';
import AvatarMini from '@/components/AvatarMini';
import ContextMenu from '@/components/ContextMenu';
import { Block } from '@/services/base-component';
import { IProps } from '@/types';
import chatHeaderTemplate from './chat-header.hbs?raw';
import { firstCharUpper } from '@/utils';

import './chat-header.pcss';

export interface IChatHeaderProps extends IProps {
    currentChat: IChatDTO | null;
    userContextMenu: ContextMenu;
}

export default class ChatHeader extends Block<IChatHeaderProps> {
    constructor(props: IChatHeaderProps) {
        super('header', {
            settings: {
                isSimple: true,
            },
            avatarMini: new AvatarMini('div', {}),
            title: '',
            ...props,
        });
    }

    updateChat(currentChat: IChatDTO | null) {
        if (currentChat) {
            const { avatar, title, last_message } = currentChat;
            const chatHeaderProps = {
                avatarMini: new AvatarMini('div', {
                    class: 'chat-header__avatar',
                    settings: {
                        isSimple: true,
                    },
                    avatarSrc: avatar,
                    userNameChar: firstCharUpper(last_message?.user.first_name || title),
                }),
                title,
            };
            this.setProps({ ...chatHeaderProps });
        }
    }

    hasUpdated(): boolean {
        return true;
    }

    render() {
        return this.compile(chatHeaderTemplate);
    }
}
