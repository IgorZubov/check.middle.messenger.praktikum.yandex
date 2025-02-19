import { IUserDTO } from '@/api/user/user.model';
import Input from '@/components/Input';
import { ErrorText, InputRegExp } from '@/constants/validate';

export * from './header-props';

const BASE_WSS_URL = 'wss://ya-praktikum.tech/ws/chats';
const BASE_URL = 'https://ya-praktikum.tech/api/v2';
const IMG_BASE_URL = 'https://ya-praktikum.tech/api/v2/resources';

const PROFILE_INPUTS = [
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
        id: 'display',
        label: 'Имя в чате',
        type: 'text',
        name: 'display_name',
        required: true,
        rule: InputRegExp.display_name,
        errText: ErrorText.display_name,
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
];

const EDIT_PASSWORD_INPUTS = [
    new Input('div', {
        attrs: {
            class: 'input',
        },
        id: 'old-password',
        label: 'Старый пароль',
        type: 'password',
        name: 'oldPassword',
        required: true,
        rule: InputRegExp.oldPassword,
        errText: ErrorText.oldPassword,
    }),
    new Input('div', {
        attrs: {
            class: 'input',
        },
        id: 'new-password',
        label: 'Новый пароль',
        type: 'password',
        name: 'newPassword',
        required: true,
        rule: InputRegExp.newPassword,
        errText: ErrorText.newPassword,
    }),
    new Input('div', {
        attrs: {
            class: 'input',
        },
        id: 'new-password-repeat',
        label: 'Повторите новый пароль',
        type: 'password',
        name: 'password',
        required: true,
        rule: InputRegExp.password,
        errText: ErrorText.password,
    }),
];

const PROFILE_FIELDS: Array<{
    title: string;
    name: keyof IUserDTO;
    value: string;
}> = [
    {
        title: 'Почта',
        name: 'email',
        value: '-',
    },
    {
        title: 'Логин',
        name: 'login',
        value: '-',
    },
    {
        title: 'Имя',
        name: 'first_name',
        value: '-',
    },
    {
        title: 'Фамилия',
        name: 'second_name',
        value: '-',
    },
    {
        title: 'Имя в чате',
        name: 'display_name',
        value: '-',
    },
    {
        title: 'Телефон',
        name: 'phone',
        value: '-',
    },
];

export { BASE_WSS_URL, BASE_URL, IMG_BASE_URL, PROFILE_INPUTS, EDIT_PASSWORD_INPUTS, PROFILE_FIELDS };
