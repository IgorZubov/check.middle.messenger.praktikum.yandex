import { ChatHeader, ChatFooter } from '@/pages/ChatsPage/modules';
import { Block } from '@/services/base-component';
import { IProps } from '@/types';
import messagerTemplate from './messager.hbs?raw';
import { IconAttach, IconBlueArrowRight, IconDots } from '@/assets/icons';
import { EModalType } from '../..';
import Button from '@/components/Button';
import Bubble from '@/components/Bubble';
import ContextMenu from '@/components/ContextMenu';

import './messager.pcss';
import MessagesAPI from '@/api/messages/messages.api';
import { IMessage } from '@/api/messages/types';
import { IChatDTO } from '@/api/chats/chats.model';

export interface IMessagerProps extends IProps {
    isCurrentChat: boolean;
    messages: Array<{
        groupName: string;
        bubbles: Bubble[];
    }>;
    chatHeader: ChatHeader;
    chatFooter: ChatFooter;
    socket: MessagesAPI | null;
}

export default class Messager extends Block {
    private _socket: MessagesAPI | null = null;

    constructor(props = {}) {
        super('section', {
            settings: {
                isSimple: true,
            },
            ...props,
        });
    }

    init() {
        return {
            isCurrentChat: true,
            messages: null,
            chatHeader: new ChatHeader({
                ...this.initUserContextMenu(),
                currentChat: null,
            }),
            chatFooter: new ChatFooter({
                ...this.initAttachContextMenu(),
                buttonSubmit: new Button('button', {
                    settings: {
                        isSimple: true,
                    },
                    type: 'button',
                    id: 'button-send-message',
                    class: 'button--icon button-send-message disabled',
                    text: IconBlueArrowRight,
                    disabled: true,
                    '@click': (evt: Event) => this.onSendMessage(evt),
                }),
                '@submit': (evt: Event) => this.onSendMessage(evt),
            }),
        };
    }

    initAttachContextMenu() {
        return {
            attachContextMenu: new ContextMenu({
                settings: {
                    isSimple: true,
                },
                Activator: new Button('button', {
                    settings: {
                        isSimple: true,
                    },
                    id: 'attach-context-menu-activator',
                    class: 'button--icon',
                    text: IconAttach,
                    '@click': () => this.onOpenAttachContextMenu(),
                }),
                isShowMenu: false,
                position: ['top', 'left'],
                menuList: [
                    new Button('button', {
                        settings: {
                            isSimple: true,
                        },
                        id: 'context-menu-video',
                        class: 'button--tertary flex',
                        text: 'Фото/Видео',
                        '@click': (evt: MouseEvent) => this.onOpenModal(evt, EModalType.attachMedia),
                    }),
                    new Button('button', {
                        settings: {
                            isSimple: true,
                        },
                        id: 'context-menu-file',
                        class: 'button--tertary',
                        text: 'Файл',
                        '@click': (evt: MouseEvent) => this.onOpenModal(evt, EModalType.attachFile),
                    }),
                    new Button('button', {
                        settings: {
                            isSimple: true,
                        },
                        id: 'context-menu-location',
                        class: 'button--tertary',
                        text: 'Локация',
                        '@click': (evt: MouseEvent) => this.onOpenModal(evt, EModalType.attachLocation),
                    }),
                ],
            }),
        };
    }

    initUserContextMenu() {
        return {
            userContextMenu: new ContextMenu({
                settings: {
                    isSimple: true,
                },
                Activator: new Button('button', {
                    settings: {
                        isSimple: true,
                    },
                    id: 'user-context-menu-activator',
                    class: 'button--icon',
                    text: IconDots,
                    '@click': () => this.onOpenUserContextMenu(),
                }),
                isShowMenu: false,
                position: ['bottom', 'right'],
                menuList: [
                    new Button('button', {
                        settings: {
                            isSimple: true,
                        },
                        id: 'context-menu-add-user',
                        class: 'button--tertary',
                        text: 'Добавить пользователя',
                        '@click': (evt: MouseEvent) => this.onOpenModal(evt, EModalType.addUser),
                    }),
                    new Button('button', {
                        settings: {
                            isSimple: true,
                        },
                        id: 'context-menu-remove-user',
                        class: 'button--tertary',
                        text: 'Удалить пользователя',
                        '@click': (evt: MouseEvent) => this.onOpenModal(evt, EModalType.removeUser),
                    }),
                    new Button('button', {
                        settings: {
                            isSimple: true,
                        },
                        id: 'context-menu-remove-user',
                        class: 'button--tertary',
                        text: 'Удалить чат',
                        '@click': (evt: MouseEvent) => this.onOpenModal(evt, EModalType.removeChat),
                    }),
                ],
            }),
        };
    }

    onOpenUserContextMenu() {
        const chatHeader = this.getChildren().chatHeader as ChatHeader;
        const userContextMenu = chatHeader.getChildren().userContextMenu as ContextMenu;
        userContextMenu.show();

        this.setProps({ chatHeader: chatHeader });
    }

    onOpenAttachContextMenu() {
        const chatFooter = this.getChildren().chatFooter as ChatFooter;
        const attachContextMenu = chatFooter.getChildren().attachContextMenu as ContextMenu;
        attachContextMenu.show();

        this.setProps({ chatFooter: chatFooter });
    }

    onOpenModal(evt: MouseEvent, type: EModalType) {
        evt.stopPropagation();
        const modal = {
            type,
        };
        window.store.setState({ modal });
    }

    onSendMessage(evt: Event) {
        evt.preventDefault();
        const chatFooter = this.getChildren().chatFooter as ChatFooter;
        const value = chatFooter.getSendValue();

        if (!this._socket || !value.trim()) {
            return;
        }

        this._socket.sendMessage(value);
    }

    updateCurrentChat(currentChat: IChatDTO | null = null) {
        const header = this.getChildren().chatHeader as ChatHeader;
        header.updateChat(currentChat);
        this.setProps({ header, currentChat, isCurrentChat: !!currentChat }, true);
    }

    updateMessages(messageList: IMessage[] | null, isRerender = true) {
        const newMessages = Array.isArray(messageList) && messageList.length === 0 ? null : messageList;
        this.setProps({ isCurrentChat: true, messages: newMessages }, isRerender);
    }

    hasUpdated(_: IMessagerProps, newProps: IMessagerProps): boolean {
        if (newProps) {
            if (newProps?.socket?.wssTransport) {
                this._socket = newProps?.socket;
            }
        }

        return true;
    }

    render() {
        return this.compile(messagerTemplate);
    }
}
