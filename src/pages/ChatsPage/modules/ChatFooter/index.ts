import { Block } from '@/services/base-component';
import chatFooterTemplate from './chat-footer.hbs?raw';
import { IProps } from '@/types';
import Button from '@/components/Button';
import Input from '@/components/Input';
import ContextMenu from '@/components/ContextMenu';

import './chat-footer.pcss';

export interface IChatFooterProps extends IProps {
    attachContextMenu: ContextMenu;
    buttonSubmit: Button;
}

export default class ChatFooter extends Block {
    constructor(props: IChatFooterProps) {
        super('form', {
            attrs: {
                class: 'chat-footer',
            },
            settings: {
                isSimple: true,
            },
            ...props,
        });
    }

    init() {
        return {
            inputSendMessage: new Input('div', {
                attrs: {
                    class: 'chat-footer__input input',
                },
                id: 'input-message',
                inputClass: 'input__send-input',
                type: 'text',
                name: 'message',
                required: true,
                '@input': (evt: InputEvent) => this._onChangeInputSend(evt),
            }),
        };
    }

    toggleDisabledSendButton(isDisabled = true) {
        const sendButton = this.getChildren().buttonSubmit as Button;
        const $btn = sendButton.getContent() as HTMLButtonElement;
        $btn.setAttribute('disabled', isDisabled.toString());

        if (isDisabled) {
            $btn.classList.add('disabled');
        } else {
            $btn.classList.remove('disabled');
            $btn.removeAttribute('disabled');
        }
        this.setProps({});
    }

    private _onChangeInputSend(evt: InputEvent) {
        const target = evt.target as HTMLInputElement;
        window.store.setState({ hasSendMessageDidabled: !target.value.trim() });
    }

    clearSend() {
        const input = this.getChildren().inputSendMessage as Input;
        input.clear();
    }

    getSendValue() {
        const input = this.getChildren().inputSendMessage as Input;
        return input.getValue();
    }

    mounted() {
        window.store.setState({ hasSendMessageDidabled: true });
    }

    render() {
        return this.compile(chatFooterTemplate);
    }
}
