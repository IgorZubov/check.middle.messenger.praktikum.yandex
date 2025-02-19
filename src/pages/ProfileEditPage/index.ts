import { Block } from '@/services/base-component';
import { IProps, RequiredKeys } from '@/types';
import AuthFormTemplate from '@/components/AuthForm/auth-form.hbs?raw';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Link from '@/components/Link';
import PageTitle from '@/components/PageTitle';
import { onblur, prepareSubmitForm, withRouter } from '@/utils/events';
import { ERouter } from '@/constants/router';
import * as userService from '@/services/apiServices/user';
import { IProfileData } from '@/api/user/types';
import { IUserDTO } from '@/api/user/user.model';
import { PROFILE_INPUTS } from '@/constants';

import '@/components/AuthForm/auth-form.pcss';
import './profile-edit.pcss';

class ProfileEditPage extends Block {
    constructor(props = {} as RequiredKeys<IProps, 'router'>) {
        super('div', {
            ...props,
            ...{
                attrs: {
                    class: 'page page-center justify-center edit-profile',
                },
                formName: 'profileEdit',
                pageTitle: new PageTitle('h1', {
                    settings: {
                        isSimple: true,
                    },
                    class: 'edit-profile__title',
                    title: 'Редактировать профиль',
                }),
                items: PROFILE_INPUTS,
                button: new Button('button', {
                    settings: {
                        isSimple: true,
                    },
                    id: 'edit-profile-btn',
                    type: 'submit',
                    class: 'button--primary auth-form__submit-btn',
                    text: 'Сохранить',
                    '@click': (evt: MouseEvent) => this.onEditProfile(evt, PROFILE_INPUTS),
                }),
                link: new Link('a', {
                    settings: {
                        isSimple: true,
                    },
                    class: 'edit-profile__link',
                    href: '#',
                    linkName: 'Отмена',
                    '@click': () => props.router.go(ERouter.SETTINGS),
                }),
                '@blur': (evt: MouseEvent) => onblur(evt, PROFILE_INPUTS),
            },
        });
    }

    async onEditProfile(evt: MouseEvent, inputs: Input[]) {
        evt.preventDefault();
        const $form = document.getElementById('form') as HTMLFormElement | null;

        if (!$form) {
            return;
        }

        const editProfileForm = prepareSubmitForm($form, inputs) as unknown as IProfileData;

        if (editProfileForm) {
            await userService.editProfile(editProfileForm);
        }
    }

    setProfile() {
        const isRerender = true;
        const { authUser } = window.store.getState();

        if (!authUser) {
            return;
        }

        PROFILE_INPUTS.forEach((Inp) => {
            const name = Inp.getName() as keyof IUserDTO;
            const value = authUser[name];
            Inp.setValue(value.toString());
        });
        this.setProps({ items: PROFILE_INPUTS }, isRerender);
    }

    mounted() {
        this.setProfile();
    }

    render() {
        return this.compile(AuthFormTemplate);
    }
}

export default withRouter(ProfileEditPage as typeof Block);
