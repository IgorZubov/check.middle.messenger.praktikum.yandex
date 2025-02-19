import { Block } from '@/services/base-component';
import changePasswordFormTemplate from './change-password-form.hbs?raw';

import './change-password-form.pcss';
import Input from '@/components/Input';
import { IProps } from '@/types';
import { onblur } from '@/utils/events';

export interface IChangePasswordForm extends IProps {
    formName?: string;
    items: Input[];
}

export default class ChangePasswordForm extends Block<IChangePasswordForm> {
    public items;

    constructor(props: IChangePasswordForm) {
        super('form', {
            attrs: {
                class: 'form',
            },
            settings: {
                isSimple: true,
            },
            ...props,
            '@blur': (evt: MouseEvent) => onblur(evt, props.items),
        });

        this.items = props.items;
    }

    render() {
        return this.compile(changePasswordFormTemplate);
    }
}
