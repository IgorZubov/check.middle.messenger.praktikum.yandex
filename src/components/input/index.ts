import { Block } from '@/services/base-component';
import inputTemplate from './input.hbs?raw';
import './input.pcss';
import {
    IProps,
    // TProps,
} from '@/types';

interface IInputProps extends IProps {
    id: string;
    type: string;
    name: string;
    inputClass?: string;
    label?: string;
    required: boolean;
    disabled?: boolean;
    error?: string;
    value?: string | File;
    rule?: RegExp;
    errText?: string;
}

export default class Input extends Block<IInputProps> {
    constructor(tagName: string, props: IInputProps) {
        super(tagName, {
            ...props,
            value: props?.value ?? '',
            disabled: Boolean(props?.disabled),
            inputClass: props?.inputClass ?? '',
            label: props?.label ?? '',
            error: props?.error ?? '',
            errText: props?.errText ?? '',
        });
    }

    getValue() {
        const inp = this.getContent()?.querySelector('.input__input') as HTMLInputElement | undefined;
        return inp?.value ?? '';
    }

    setValue(value: string) {
        this.setProps({ value });
    }

    getName() {
        return this.getProps().name;
    }

    validate() {
        const regexp = this.getProps()?.rule as RegExp | undefined;
        const errText = this.getProps()?.errText as string;
        const value = this.getValue();

        if (!regexp || !errText) {
            return true;
        }

        const isValid = regexp.test(value);

        if (!isValid) {
            this.setError(errText);
        } else {
            this.setError('');
        }

        return isValid;
    }

    setError(msg: string) {
        const value = this.getValue();
        this.setProps({ value, error: msg });
    }

    clear() {
        this.setProps({ value: '', error: '' }, true);
    }

    render() {
        return this.compile(inputTemplate);
    }

    // oldProps: TProps, newProps: TProps
    hasUpdated(): boolean {
        // return oldProps['error'] !== newProps['error'];
        return true;
    }
}
