import Modal, { IModalProps } from '@/components/Modal';
import { EModalType } from '..';
import Input from '@/components/Input';
import { ErrorText, regExpLogin, regExpMessage } from '@/constants/validate';
import Button from '@/components/Button';

export interface IComposableSubminBtnModalProps {
    '@click': () => Promise<void>;
}

export const useChatPage = () => {
    const initModalProps = (props?: IModalProps<EModalType>) => {
        if (!props) {
            props = {
                title: '',
                type: EModalType.addUser,
            };
        }

        return {
            isShowModal: true,
            modal: new Modal<EModalType>(props),
        };
    };

    const getModalCreateChatProps = (props: IComposableSubminBtnModalProps) => {
        return {
            settings: {
                isSimple: true,
            },
            title: 'Создать чат',
            body: new Input('div', {
                attrs: {
                    class: 'input',
                },
                id: 'chat-title',
                label: 'Название чата',
                type: 'text',
                name: 'title',
                required: true,
                rule: regExpMessage,
                errText: ErrorText.message,
            }),
            type: EModalType.createChat,
            submitBtn: new Button('button', {
                settings: {
                    isSimple: true,
                },
                id: 'button-send-create-chat',
                class: 'button--primary',
                text: 'Создать',
                ...props,
            }),
        };
    };

    const getModalAddUserProps = (props: IComposableSubminBtnModalProps) => {
        return {
            settings: {
                isSimple: true,
            },
            title: 'Добавить пользователя',
            body: new Input('div', {
                attrs: {
                    class: 'input',
                },
                id: 'login',
                label: 'Логин',
                type: 'text',
                name: 'login',
                required: true,
                rule: regExpLogin,
                errText: ErrorText.login,
            }),
            type: EModalType.addUser,
            submitBtn: new Button('button', {
                settings: {
                    isSimple: true,
                },
                id: 'button-send-add-user',
                class: 'button--primary',
                text: 'Добавить',
                ...props,
            }),
        };
    };

    const getModalAttachMediaFileProps = (props: IComposableSubminBtnModalProps) => {
        return {
            settings: {
                isSimple: true,
            },
            title: 'Добавить фото/видео',
            body: new Input('div', {
                attrs: {
                    class: 'input',
                },
                id: 'login',
                label: 'Фото/видео файл',
                type: 'file',
                name: 'file',
                required: true,
            }),
            type: EModalType.attachMedia,
            submitBtn: new Button('button', {
                settings: {
                    isSimple: true,
                },
                id: 'button-send-add-user',
                class: 'button--primary',
                text: 'Добавить',
                ...props,
            }),
        };
    };

    const getModalRemoveUserProps = (props: IComposableSubminBtnModalProps) => {
        return {
            settings: {
                isSimple: true,
            },
            title: 'Удалить пользователя',
            body: new Input('div', {
                attrs: {
                    class: 'input',
                },
                id: 'login',
                label: 'Логин',
                type: 'text',
                name: 'login',
                required: true,
                rule: regExpLogin,
                errText: ErrorText.login,
            }),
            type: EModalType.removeUser,
            submitBtn: new Button('button', {
                settings: {
                    isSimple: true,
                },
                id: 'button-send-remove-user',
                class: 'button--primary',
                text: 'Удалить',
                ...props,
            }),
        };
    };

    const getModalRemoveChatProps = (props: IComposableSubminBtnModalProps) => {
        return {
            settings: {
                isSimple: true,
            },
            title: 'Удалить чат?',
            type: EModalType.removeChat,
            submitBtn: new Button('button', {
                settings: {
                    isSimple: true,
                },
                id: 'button-send-remove-user',
                class: 'button--primary',
                text: 'Удалить',
                ...props,
            }),
        };
    };

    return {
        initModalProps,
        getModalCreateChatProps,
        getModalAddUserProps,
        getModalAttachMediaFileProps,
        getModalRemoveUserProps,
        getModalRemoveChatProps,
    };
};
