import { Block } from '@/services/base-component';
import AuthFormTemplate from '@/components/AuthForm/auth-form.hbs?raw';
import Input from '@/components/Input';
import PageTitle from '@/components/PageTitle';
import Button from '@/components/Button';
import { onblur, prepareSubmitForm, withRouter } from '@/utils/events';
import Link from '@/components/Link';
import { ERouter } from '@/constants/router';
import { IProps, RequiredKeys } from '@/types';
import { IUserLogin } from '@/api/auth/types';
import * as serviceAuth from '@/services/apiServices/auth';
import { ErrorText, InputRegExp } from '@/constants/validate';

import '@/components/AuthForm/auth-form.pcss';
import { logout } from '@/composables/events';

const inputs = [
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
];

class LoginPage extends Block {
    constructor(props = {} as RequiredKeys<IProps, 'router'>) {
        super('div', {
            ...props,
            ...{
                attrs: {
                    class: 'page page-center',
                },
                formName: 'loginForm',
                pageTitle: new PageTitle('h1', {
                    settings: {
                        isSimple: true,
                    },
                    title: 'Вход',
                }),
                items: inputs,
                button: new Button('button', {
                    settings: {
                        isSimple: true,
                    },
                    id: 'login-btn',
                    type: 'submit',
                    class: 'button--primary auth-form__submit-btn',
                    text: 'Войти',
                    '@click': (evt: MouseEvent) => this.onLogin(evt, inputs),
                }),
                link: new Link('a', {
                    settings: {
                        isSimple: true,
                    },
                    href: '#',
                    linkName: 'Зарегистрироваться',
                    '@click': () => props.router.go(ERouter.REGISTRATION),
                }),
                '@blur': (evt: MouseEvent) => onblur(evt, inputs),
            },
        });
    }

    render() {
        return this.compile(AuthFormTemplate);
    }

    async onLogin(evt: MouseEvent, inputs: Input[]) {
        evt.preventDefault();
        const $form = document.getElementById('form') as HTMLFormElement | null;

        if (!$form) {
            return;
        }

        const loginForm = prepareSubmitForm($form, inputs);

        if (loginForm) {
            await serviceAuth.login(loginForm as unknown as IUserLogin);
        }
    }

    mounted() {
        const { authUser = null } = window.store.getState();

        if (authUser) {
            logout();
        }
    }
}

export default withRouter(LoginPage as typeof Block);
