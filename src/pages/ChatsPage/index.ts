import chatsPageTemplate from './chats.hbs?raw';
import { Block } from '@/services/base-component';
import { Indexed, IProps } from '@/types';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { AsideChats, ChatFooter } from '@/pages/ChatsPage/modules';
import { withRouter } from '@/utils/events';
import * as serviceChats from '@/services/apiServices/chats';
import * as serviceUser from '@/services/apiServices/user';
import Modal from '@/components/Modal';
import { EStoreEvents, IStore } from '@/services/Store';
import Messager from './modules/Messager';
import MessagesApi from '@/api/messages/messages.api';
import { IChatDTO } from '@/api/chats/chats.model';
import { useChatPage } from './composables/chat-page';
import { IMessage } from '@/api/messages/types';

import './chats.pcss';
import { WSTransportEvents } from '@/services/wsTransport';

export enum EModalType {
    createChat = 'createChat',
    addUser = 'addUser',
    removeUser = 'removeUser',
    removeChat = 'removeChat',
    loadMedia = 'loadMedia',
    loadFile = 'loadFile',
    loadLocation = 'loadLocation',
    attachMedia = 'attachMedia',
    attachFile = 'attachFile',
    attachLocation = 'attachLocation',
}

interface IChatPageProps extends IProps {
    asideChats: AsideChats;
    messager: Messager;
}

// eslint-disable-next-line prettier/prettier
const {
    initModalProps,
    getModalCreateChatProps,
    getModalAddUserProps,
    getModalAttachMediaFileProps,
    getModalRemoveUserProps,
    getModalRemoveChatProps,
} = useChatPage();

class ChatsPage extends Block<IChatPageProps> {
    private _socket: MessagesApi | null = null;

    constructor(props = {} as IChatPageProps) {
        super('div', {
            attrs: {
                class: 'chats-page',
            },
            ...props,
        });
    }

    init() {
        return {
            asideChats: new AsideChats({
                addChat: new Button('button', {
                    settings: {
                        isSimple: true,
                    },
                    id: 'button-create-chat',
                    class: 'button--primary aside-chats__add-chat-btn',
                    text: 'Создать чат',
                    '@click': () => this.onOpenModal(EModalType.createChat),
                }),
                chats: [],
            }),
            messager: new Messager({}),
            ...initModalProps(),
        };
    }

    async onOpenModal(type: EModalType) {
        let props;

        if (type === EModalType.createChat) {
            props = getModalCreateChatProps({
                '@click': () => this.onModalSend(EModalType.createChat),
            });
        } else if (type === EModalType.addUser) {
            props = getModalAddUserProps({
                '@click': () => this.onModalSend(EModalType.addUser),
            });
        } else if (type === EModalType.removeUser) {
            props = getModalRemoveUserProps({
                '@click': () => this.onModalSend(EModalType.removeUser),
            });
        } else if (type === EModalType.removeChat) {
            props = getModalRemoveChatProps({
                '@click': () => this.onModalSend(EModalType.removeChat),
            });
        } else if (type === EModalType.attachMedia) {
            props = getModalAttachMediaFileProps({
                '@click': () => this.onModalSend(EModalType.attachMedia),
            });
        }

        if (!props) {
            return;
        }

        const newModal = initModalProps(props).modal;

        if (type === EModalType.removeUser) {
            const { authUser } = window.store.getState();
            const chatUsers = await this.loadChatUsers();
            const formattedUsers = chatUsers.map((u) => ({
                display: u.display_name ?? `${u.first_name} ${u.second_name}`,
                login: u.login,
                isMe: u.id === authUser?.id,
            }));
            newModal.setProps({ userList: formattedUsers });
        }

        newModal.show();
        this.setProps({ modal: newModal });
    }

    async onModalSend(modalType: EModalType) {
        const modal = this.getChildren().modal as Modal<EModalType>;
        const input = this.getChildren().modal.getChildren().body as Input;
        const isValid = input?.validate();

        if (modalType === EModalType.removeChat) {
            await this.controllerRemoveChat();
            modal.hide();
            return;
        }

        if (!Input || !isValid) {
            return;
        }

        const value = input.getValue();

        if (modalType === EModalType.createChat) {
            await this.controllerCreateChat(value);
        } else if (modalType === EModalType.addUser) {
            await this.controllerUserToChat(value, 'add');
        } else if (modalType === EModalType.removeUser) {
            await this.controllerUserToChat(value, 'remove');
        } else if (modalType === EModalType.attachMedia) {
            console.log('emulate fetch load photo/video file');
        }
        //TODO дописать методы для прикрепления файла и стикеров

        modal.hide();
        input.clear();
    }

    async loadChats() {
        const chatList = await serviceChats.getChats();
        this.updateChats(chatList);
    }

    async loadChatUsers() {
        const { currentChat, authUser } = window.store.getState();
        const chatUsersForm = {
            id: Number(currentChat!.id),
            email: authUser?.email,
        };
        return await serviceChats.getChatUsers(chatUsersForm);
    }

    async controllerCreateChat(value: string) {
        const form = {
            title: value,
        };
        await serviceChats.addChat(form);
        await this.loadChats();
        window.store.clearCurrentChat();
    }

    async controllerRemoveChat() {
        const { currentChat, currentSocket } = window.store.getState();

        const chatDeleteForm = {
            chatId: Number(currentChat!.id),
        };

        if (currentSocket && currentSocket instanceof MessagesApi) {
            await currentSocket.disconnectFromChat();
        }

        await serviceChats.deleteChat(chatDeleteForm);
        window.store.clearCurrentChat();
        await this.loadChats();
    }

    async controllerUserToChat(value: string, type: 'add' | 'remove') {
        const { currentChat = null } = window.store.getState();
        const users = await serviceUser.search({ login: value });

        if (!Array.isArray(users) || users.length === 0 || !currentChat) {
            return;
        }

        const chatId = currentChat.id;
        const chatUserId = users[0].id;
        const userform = {
            users: [chatUserId],
            chatId: Number(chatId),
        };

        if (type === 'add') {
            await serviceChats.addUser(userform);
        } else {
            await serviceChats.deleteUser(userform);
        }
        this.chatController(currentChat);
    }

    async chatController(currentChat: IChatDTO) {
        const { authUser } = window.store.getState();
        const token = await serviceChats.getChatToken(currentChat.id);

        if (!token || !authUser) {
            return;
        }

        if (this._socket?.wssTransport) {
            await this._socket.disconnectFromChat();
        }

        this._socket = new MessagesApi();
        await this._socket.getWSSTransport(authUser.id, currentChat.id, token);

        if (this._socket.wssTransport) {
            this._socket.wssTransport.on(WSTransportEvents.Message, (data: Indexed[]) => {
                window.store.addMessages(data);
            });

            this._socket.connectToChat().then(() => {
                if (this._socket) {
                    this._socket.getMessages();
                }
            });
        }

        window.store.setState({ currentSocket: this._socket });
    }

    updateChats(chatList: IChatDTO[], isRerender = true) {
        const asideChats = this.getChildren().asideChats as AsideChats;
        asideChats.updateChats(chatList);
        this.setProps({ asideChats: asideChats }, isRerender);
    }

    updateMessages(messages: IMessage[] | null, isRerender = true) {
        const localMessages = messages?.length === 0 ? null : messages;
        const messager = this.getChildren().messager as Messager;
        messager.updateMessages(localMessages);
        this.setProps({ messager }, isRerender);
    }

    updateCurrentChat(currentChat: IChatDTO, isRerender = true) {
        const messager = this.getChildren().messager as Messager;
        messager.updateCurrentChat(currentChat);
        messager.setProps(
            {
                socket: this._socket,
            },
            true,
        );
        this.setProps({ messager: messager }, isRerender);
    }

    clearSendInput(isRerender = true) {
        const messager = this.getChildren().messager as Messager;
        const chatFooter = messager.getChildren().chatFooter as ChatFooter;
        chatFooter.clearSend();

        this.setProps({ messager: messager }, isRerender);
    }

    updateSendMessageBtn(isDisabled: boolean, isRerender = true) {
        const messager = this.getChildren().messager as Messager;
        const chatFooter = messager.getChildren().chatFooter as ChatFooter;
        chatFooter.toggleDisabledSendButton(isDisabled);
        this.setProps({ messager: messager }, isRerender);
    }

    render() {
        return this.compile(chatsPageTemplate);
    }

    mounted() {
        this.loadChats();

        window.store.on(EStoreEvents.Updated, async (oldState: IStore, nextState: IStore) => {
            const { modal = null, currentChat = null, messages = null, message = null, hasSendMessageDidabled } = nextState;

            if (modal?.type) {
                this.onOpenModal(modal.type);
            }

            if (currentChat !== null) {
                await this.chatController(currentChat);
                this.updateCurrentChat(currentChat);
            }

            if (messages && oldState.messages !== messages) {
                this.updateMessages(messages);
            }

            if (message && oldState?.message?.id !== message.id) {
                this.clearSendInput();
            }

            if (typeof hasSendMessageDidabled !== 'undefined') {
                this.updateSendMessageBtn(hasSendMessageDidabled);
                const sendMessageInput = document.getElementById('input-message');
                if (sendMessageInput) {
                    sendMessageInput.focus();
                }
            }
        });
    }
}

export default withRouter(ChatsPage as typeof Block);
