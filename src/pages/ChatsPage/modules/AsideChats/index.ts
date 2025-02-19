import { Block } from '@/services/base-component';
import asideChatsTemplate from './aside-chat.hbs?raw';
import { IProps } from '@/types';
import { Chat } from '@/pages/ChatsPage/modules';
import Button from '@/components/Button';
import Link from '@/components/Link';
import AvatarMini from '@/components/AvatarMini';
import { ERouter } from '@/constants/router';
import { IChatDTO } from '@/api/chats/chats.model';
import { useAsideChats } from '../../composables/aside-chats';

import './aside-chat.pcss';

interface IAsideChatsProps extends IProps {
    addChat: Button;
    profileLink: Link;
    avatarMini: AvatarMini;
    chats: Chat[];
}

export interface IAsideChatsPropsExternal {
    addChat: Button;
    chats: Chat[];
}

const { adapterChatsPropsToChatsComponent } = useAsideChats();

export default class AsideChats extends Block<IAsideChatsProps> {
    constructor(props: IAsideChatsPropsExternal) {
        super('div', {
            settings: {
                isSimple: true,
            },
            profileLink: new Link('a', {
                settings: {
                    isSimple: true,
                },
                href: '#',
                linkName: 'Профиль',
                '@click': () => window.router?.go(ERouter.SETTINGS),
            }),
            avatarMini: new AvatarMini('div', {
                settings: {
                    isSimple: true,
                },
                class: 'aside-chats__header-avatar',
            }),
            currentChatId: '-1',
            ...props,
            '@click': (evt: MouseEvent) => this.onChatSelect(evt),
        });
    }

    updateChats(chatList: IChatDTO[]) {
        if (chatList.length === 0) {
            return;
        }

        const chats = adapterChatsPropsToChatsComponent(chatList);
        chats[0].select();
        this.setProps({ chats });

        window.store.setCurrentChat(String(chatList[0].id));
    }

    private _selectChat(chat: HTMLElement, currentChatId: string) {
        const $chatList = document.querySelector('.aside-chats__list');

        if ($chatList?.children) {
            for (const $chat of $chatList.children) {
                const id = $chat.getAttribute('id') || '';
                if (id !== String(currentChatId)) {
                    $chat.classList.remove('select');
                }
            }
        }

        if (chat) {
            chat.classList.add('select');
        }
    }

    onChatSelect(evt: MouseEvent) {
        evt.preventDefault();
        const target = evt.target as HTMLElement | null;
        const chat = target?.closest('.aside-chats__chat') as HTMLElement | null;

        if (!chat) {
            return;
        }

        const chatId = chat.getAttribute('id') || '';
        if (chatId) {
            this._selectChat(chat, chatId);
            this.setProps({ currentChatId: chatId });

            window.store.clearCurrentChat();
            window.store.setCurrentChat(chatId);
        }

        // router.go(`${ERouter.MESSENGER}/${chatId}`, true);
    }

    hasUpdated(oldProps: IAsideChatsProps, newProps: IAsideChatsProps) {
        if (oldProps.currentChatId !== newProps.currentChatId) {
            return false;
        }

        return true;
    }

    render() {
        return this.compile(asideChatsTemplate);
    }
}
