import { Block } from '@/services/base-component';
import modalTemplate from './modal.hbs?raw';

import './modal.pcss';
import { IProps } from '@/types';

export interface IModalProps<ModalType> extends IProps {
    title: string;
    userList?: Array<{
        display: string;
        login: string;
        isMe: boolean;
    }>;
    isShow?: boolean;
    body?: unknown | string;
    type: ModalType;
    submitBtn?: Block;
    cancelBtn?: Block;
    isShowCancel?: boolean;
}

export default class Modal<T> extends Block<IModalProps<T>> {
    constructor(props: IModalProps<T>) {
        super('div', props);

        this._initClickEvent();
    }

    private _initClickEvent() {
        window.addEventListener('click', this._onClickWindow.bind(this));
    }

    private _onClickWindow(evt: MouseEvent) {
        const target = evt.target as HTMLElement | null;
        const isClickOnModal = target?.classList.contains('modal-container');
        const $modal = this.getContent();

        if ($modal && isClickOnModal) {
            this.hide();
        }
    }

    show() {
        const $modal = this.getContent();

        if ($modal) {
            $modal.classList.add('show');
        }
    }

    hide() {
        const $modal = this.getContent();

        if ($modal) {
            $modal?.classList.remove('show');
        }
    }

    hasUpdated() {
        return true;
    }

    render() {
        return this.compile(modalTemplate);
    }
}
