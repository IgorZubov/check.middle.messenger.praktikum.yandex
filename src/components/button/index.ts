import { Block } from '@/services/base-component';
import './button.pcss';
import buttonTeplate from './button.hbs?raw';
import { IProps } from '@/types';

type TButtonModifier = 'button--primary' | 'button--tertary' | 'button--icon' | string;

interface IButtonProps extends IProps {
    id?: string;
    class?: TButtonModifier;
    disabled?: boolean;
    type?: 'button' | 'submit';
    text?: Block | string;
}

export default class Button extends Block {
    constructor(_: string, props: IButtonProps) {
        super('button', {
            ...props,
            type: props?.type ?? 'button',
            class: props?.class ?? 'button--primary',
        });
    }
    render() {
        return this.compile(buttonTeplate);
    }
}
