import profilePageTemplate from './profile.hbs?raw';
import { Block } from '@/services/base-component';
import './profile.pcss';
import { prepareSubmitForm, withRouter } from '@/utils/events';
import { IProps } from '@/types';
import Avatar from '@/components/Avatar';
import Link from '@/components/Link';
import PageTitle from '@/components/PageTitle';
import { ERouter } from '@/constants/router';
import Button from '@/components/Button';
import Modal, { IModalProps } from '@/components/Modal';
import Input from '@/components/Input';
import * as serviceUser from '@/services/apiServices/user';
// import * as serviceAuth from '@/services/apiServices/auth';
import ChangePasswordForm from './modules/ChangePasswordForm';
import { IUserDTO } from '@/api/user/user.model';
import { IUserAvatar, IUserChangePassword } from '@/api/user/types';
import { logout } from '@/composables/events';
import { EDIT_PASSWORD_INPUTS, IMG_BASE_URL, PROFILE_FIELDS } from '@/constants';

import './profile.pcss';

enum EModalType {
    EDIT_AVATAR = 'editAvatar',
    EDIT_PASSWORD = 'editPassword',
}

export interface IProfilePageProps extends IProps {
    pageTitle: PageTitle;
    avatar: Avatar;
    profile: {
        userName: string;
        fields: Array<{
            name: string;
            value: string;
        }>;
    };
    editProfile: Link;
    editAvatar: Button;
    editPassword: Button;
    logout: Button;
    modal: Modal<EModalType>;
}
class ProfilePage extends Block<IProfilePageProps> {
    private _avatar: File | null = null;

    constructor(props = {} as IProfilePageProps) {
        super('div', {
            attrs: {
                class: 'profile',
            },
            ...props,
        });
    }

    init() {
        return {
            ...this.initModalProps(this.getModalEditAvatar()),
            pageTitle: new PageTitle('h1', {
                settings: {
                    isSimple: true,
                },
                class: 'profile__title',
                title: 'Профиль',
            }),
            avatar: new Avatar({
                class: 'profile__avatar',
                imageSrc: '',
            }),
            profile: {
                userName: '-',
                fields: PROFILE_FIELDS,
            },
            editProfile: new Link('a', {
                settings: {
                    isSimple: true,
                },
                href: '#',
                linkName: 'Редактировать профиль',
                '@click': () => window.router.go(ERouter.PROFILE_EDIT),
            }),
            editAvatar: new Button('button', {
                settings: {
                    isSimple: true,
                },
                id: 'button-edit-avatar',
                class: 'button--link profile__edit-btn',
                text: 'Изменить аватар',
                '@click': (evt: MouseEvent) => this.onOpenModal(evt, EModalType.EDIT_AVATAR),
            }),
            editPassword: new Button('button', {
                settings: {
                    isSimple: true,
                },
                id: 'button-edit-password',
                class: 'button--link profile__edit-btn',
                text: 'Изменить пароль',
                '@click': (evt: MouseEvent) => this.onOpenModal(evt, EModalType.EDIT_PASSWORD),
            }),
            logout: new Button('button', {
                settings: {
                    isSimple: true,
                },
                id: 'button-edit-password',
                class: 'button--link profile__logout-btn',
                text: 'Выйти',
                '@click': () => this.onLogout(),
            }),
        };
    }

    initModalProps(props: IModalProps<EModalType>) {
        return {
            modal: new Modal(props),
        };
    }

    getModalEditAvatar() {
        return {
            settings: {
                isSimple: true,
            },
            title: 'Изменить аватар',
            body: new Input('div', {
                attrs: {
                    class: 'input',
                },
                id: 'input-change-avatar',
                label: 'Изменить аватар',
                type: 'file',
                name: 'avatar',
                required: true,
                '@change': (evt: InputEvent) => this.onLoadAvatar(evt),
            }),
            type: EModalType.EDIT_AVATAR,
            submitBtn: new Button('button', {
                settings: {
                    isSimple: true,
                },
                id: 'button-send-add-user',
                class: 'button--primary',
                text: 'Поменять',
                '@click': () => this.onModalSend(EModalType.EDIT_AVATAR),
            }),
        };
    }

    getModalEditPassword() {
        return {
            settings: {
                isSimple: true,
            },
            title: 'Изменить пароль',
            body: new ChangePasswordForm({
                formName: 'chage-password-form',
                items: EDIT_PASSWORD_INPUTS,
            }),
            type: EModalType.EDIT_AVATAR,
            submitBtn: new Button('button', {
                settings: {
                    isSimple: true,
                },
                id: 'button-send-password',
                class: 'button--primary',
                text: 'Поменять',
                '@click': () => this.onModalSend(EModalType.EDIT_PASSWORD),
            }),
        };
    }

    onOpenModal(evt: MouseEvent, type: EModalType) {
        evt.preventDefault();
        let props;
        if (type === EModalType.EDIT_AVATAR) {
            props = this.getModalEditAvatar();
        } else {
            props = this.getModalEditPassword();
        }

        const newModal = this.initModalProps(props).modal;
        newModal.show();
        this.setProps({
            modal: newModal,
        });
    }

    onLoadAvatar(evt: InputEvent) {
        const target = evt.target as HTMLInputElement;
        const files = target.files;

        if (files) {
            this._avatar = files[0];
        }
    }

    async editPassword() {
        const modal = this.getChildren().modal as Modal<EModalType>;
        const changePasswordForm = modal.getChildren().body as ChangePasswordForm;

        const $form = changePasswordForm.getContent() as HTMLFormElement | null;

        if (!$form) {
            return;
        }

        const formData = prepareSubmitForm($form, changePasswordForm.items);

        if (formData) {
            delete formData['password'];
            await serviceUser.changePassword(formData as unknown as IUserChangePassword);

            modal.hide();
            this.setProps({ modal: modal });
        }
    }

    async editAvatar() {
        const modal = this.getChildren().modal as Modal<EModalType>;

        if (!this._avatar) {
            return;
        }

        const formData = new FormData() as IUserAvatar;
        formData.append('avatar', this._avatar);

        const data = await serviceUser.changeAvatar(formData);

        if (!data) {
            return;
        }

        this.setAvatar(data.avatar);

        modal.hide();
        this._avatar = null;
        this.setProps({ modal: modal });
    }

    async onModalSend(type: EModalType) {
        if (type === EModalType.EDIT_PASSWORD) {
            this.editPassword();
        } else if (type === EModalType.EDIT_AVATAR) {
            this.editAvatar();
        }
    }

    async onLogout() {
        await logout();
        window.router.go(ERouter.LOGIN);
    }

    setAvatar(imgSrc: string, isRerender = true) {
        const imageSrc = `${IMG_BASE_URL}${imgSrc}`;
        const AvatarComponent = this.getChildren().avatar as Avatar;
        AvatarComponent.setProps({ imageSrc });
        this.setProps({ avatar: AvatarComponent }, isRerender);
    }

    setProfile(authUser: IUserDTO) {
        const profileFields = PROFILE_FIELDS.map((field) => ({
            title: field.title,
            name: field.name,
            value: authUser[field.name]?.toString() ?? '-',
        }));
        const newProfile = {
            userName: `${authUser.first_name} ${authUser.second_name}`,
            fields: profileFields,
        };

        this.setProps({ profile: newProfile });
    }

    mounted() {
        const { authUser } = window.store.getState();

        if (!authUser) {
            window.router.go(ERouter.LOGIN);
            return;
        }

        this.setProfile(authUser);
        if (authUser.avatar) {
            this.setAvatar(authUser.avatar);
        }
    }

    render() {
        return this.compile(profilePageTemplate);
    }
}

export default withRouter(ProfilePage as typeof Block);
