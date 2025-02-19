import Link from '@/components/Link';

export const headerProps = {
    attrs: {
        class: 'header',
    },
    items: [
        new Link('a', {
            settings: {
                isSimple: true,
            },
            href: '/login',
            dataPage: 'loginPage',
            linkName: 'Вход',
        }),
        new Link('a', {
            settings: {
                isSimple: true,
            },
            href: '/register',
            dataPage: 'registerPage',
            linkName: 'Регистрация',
        }),
        new Link('a', {
            settings: {
                isSimple: true,
            },
            href: '/chats',
            dataPage: 'chatsPage',
            linkName: 'Чаты',
        }),
        new Link('a', {
            settings: {
                isSimple: true,
            },
            href: '/profile',
            dataPage: 'profilePage',
            linkName: 'Профиль',
        }),
        new Link('a', {
            settings: {
                isSimple: true,
            },
            href: '/profile-edit',
            dataPage: 'profileEditPage',
            linkName: 'Редактировать профиль',
        }),
        new Link('a', {
            settings: {
                isSimple: true,
            },
            href: '/not-found',
            dataPage: 'notFoundPage',
            linkName: '404 ошибка',
        }),
        new Link('a', {
            settings: {
                isSimple: true,
            },
            href: '/server-erorr',
            dataPage: 'serverErrorPage',
            linkName: '500 ошибка',
        }),
    ],
};
