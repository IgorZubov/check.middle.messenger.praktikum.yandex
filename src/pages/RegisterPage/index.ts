import AuthFormTemplate from '@/components/AuthForm/auth-form.hbs?raw';
import { Block } from '@/services/base-component';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Link from '@/components/Link';
import PageTitle from '@/components/PageTitle';
import { onblur, prepareSubmitForm, withRouter } from '@/utils/events';
import { IProps, RequiredKeys } from '@/types';
import { ERouter } from '@/constants/router';
import * as apiServiceAuth from '@/services/apiServices/auth';
import { IUserRegistration } from '@/api/auth/types';
import { ErrorText, InputRegExp } from '@/constants/validate';

import '@/components/AuthForm/auth-form.pcss';

const inputs = [
    new Input('div', {
        attrs: {
            class: 'input',
        },
        id: 'email',
        label: 'Почта',
        type: 'email',
        name: 'email',
        required: true,
        rule: InputRegExp.email,
        errText: ErrorText.email,
    }),
    new Input('div', {
        attrs: {
            class: 'input',
        },
        id: 'first_name',
        label: 'Имя',
        type: 'text',
        name: 'first_name',
        required: true,
        rule: InputRegExp.first_name,
        errText: ErrorText.first_name,
    }),
    new Input('div', {
        attrs: {
            class: 'input',
        },
        id: 'second_name',
        label: 'Фамилия',
        type: 'text',
        name: 'second_name',
        required: true,
        rule: InputRegExp.second_name,
        errText: ErrorText.second_name,
    }),
    new Input('div', {
        attrs: {
            class: 'input',
        },
        id: 'phone',
        label: 'Телефон',
        type: 'tel',
        name: 'phone',
        required: true,
        rule: InputRegExp.phone,
        errText: ErrorText.phone,
    }),
    new Input('div', {
        attrs: {
            class: 'input',
        },
        id: 'login',
        label: 'Логин',
        type: 'text',
        name: 'login',
        required: true,
        rule: InputRegExp.login,
        errText: ErrorText.login,
    }),
    new Input('div', {
        attrs: {
            class: 'input',
        },
        id: 'password',
        label: 'Пароль',
        type: 'password',
        name: 'password',
        required: true,
        rule: InputRegExp.password,
        errText: ErrorText.password,
    }),
    new Input('div', {
        attrs: {
            class: 'input',
        },
        id: 'password-repeat',
        label: 'Пароль еще раз',
        type: 'password',
        name: 'newPassword',
        required: true,
        rule: InputRegExp.newPassword,
        errText: ErrorText.newPassword,
    }),
];

class RegisterPage extends Block {
    constructor(props = {} as RequiredKeys<IProps, 'router'>) {
        super('div', {
            ...props,
            ...{
                attrs: {
                    class: 'page page-center',
                },
                formName: 'registerForm',
                pageTitle: new PageTitle('h1', {
                    settings: {
                        isSimple: true,
                    },
                    title: 'Регистрация',
                }),
                items: inputs,
                button: new Button('button', {
                    settings: {
                        isSimple: true,
                    },
                    id: 'register-btn',
                    type: 'submit',
                    class: 'button button--primary auth-form__submit-btn',
                    text: 'Зарегистрироваться',
                    '@click': (evt: MouseEvent) => this.onRegister(evt, inputs),
                }),
                link: new Link('a', {
                    settings: {
                        isSimple: true,
                    },
                    href: '#',
                    linkName: 'Войти',
                    '@click': () => props.router.go(ERouter.LOGIN),
                }),
                '@blur': (evt: MouseEvent) => onblur(evt, inputs),
            },
        });
    }

    async onRegister(evt: MouseEvent, inputs: Input[]) {
        evt.preventDefault();
        const $form = document.getElementById('form') as HTMLFormElement | null;

        if (!$form) {
            return;
        }

        const registerForm = prepareSubmitForm($form, inputs);
        if (registerForm) {
            const entries = Object.entries(registerForm).filter(([key, _]) => key !== 'newPassword');
            const preparedRegisterForm = Object.fromEntries(entries) as unknown as IUserRegistration;
            await apiServiceAuth.register(preparedRegisterForm);
        }
    }

    render() {
        return this.compile(AuthFormTemplate);
    }
}

export default withRouter(RegisterPage as typeof Block);
