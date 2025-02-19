import { validate } from '@/utils';
import Input from '@/components/Input';
import { ErrorText, InputRegExp, TInputName } from '@/constants/validate';
import { IProps, RequiredKeys } from '@/types';
import { validateWithMessage } from '.';
import { Block } from '@/services/base-component';
import { ERouter } from '@/constants/router';

export const prepareSubmitForm = (form: HTMLFormElement, inputs: Input[]): Record<string, string | File> | null => {
    const formData = new FormData(form);
    const rules = getFormRules(formData, inputs);

    setFormErrors(formData, rules, inputs);

    return validate(rules) ? Object.fromEntries(formData) : null;
};

const getFormRules = (formData: FormData, inputs: Input[]) => {
    const rules: Record<string, string | true> = {};

    for (const [key, value] of formData.entries()) {
        const inputComponent = inputs.find((input) => input.getName() === key);
        const isRequired = inputComponent?.getProps()?.required;
        const val = inputComponent?.getValue();

        if (!isRequired && !val) {
            rules[key] = true;
            continue;
        }

        if (!InputRegExp[key as TInputName]) {
            rules[key] = 'Ошибка валидации';
            continue;
        }

        rules[key] = validateWithMessage(value, InputRegExp[key as TInputName], ErrorText[key as TInputName]);
    }

    return rules;
};

const setFormErrors = (formData: FormData, rules: Record<string, string | true> = {}, inputs: Input[]): void => {
    Object.keys(rules).forEach((key) => {
        const inputComponent = inputs.find((input) => input.getName() === key);

        if (!inputComponent) {
            return;
        }

        const isRequired = inputComponent.getProps()?.required;

        if (!isRequired && !inputComponent.getValue()) {
            inputComponent.setProps({ value: '', errText: '' });
            return;
        }

        const inputValue = (formData.get(key) as string) || '';
        const errText = typeof rules[key] === 'string' ? rules[key] : '';
        inputComponent.setProps({ value: inputValue, errText });
        inputComponent.validate();
    });
};

export const onblur = (evt: MouseEvent, inputs: Input[]) => {
    if ((evt.target as HTMLElement).tagName === 'INPUT') {
        const target = evt.target as HTMLInputElement;
        const inputComponent = inputs.find((input) => input.getName() === target.name);

        if (inputComponent) {
            const isRequired = inputComponent.getProps()?.required;

            if (!isRequired && !target.value) {
                inputComponent.setProps({ value: '', errText: '' });
                return;
            }

            inputComponent.setProps({ value: target.value });
            inputComponent.validate();
        }
    }
};

export const onLinkClick = (evt: Event, props: RequiredKeys<IProps, 'router'>) => {
    evt.preventDefault();
    props.router.go(ERouter.LOGIN);
};

export const withRouter = <Cls extends typeof Block>(SomeBlock: Cls) => {
    // @ts-expect-error is ok typeClass
    return class extends SomeBlock {
        constructor(props: IProps) {
            // @ts-expect-error props extended
            super({ ...props, router: window.router });
        }
    };
};
