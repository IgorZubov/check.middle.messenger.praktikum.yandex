import Block, { BlockProps } from "@/core/Block";
import { Button, ProfileItem, Form, Label, Input } from "@/components";
import { validation } from "@/utils";
import { validateAndCollectFormData } from "@/utils/validateAndCollectFormData";
import { Router } from "@/core/Router";
import { UserModel } from "@/types/models/User";
import { AuthController } from "@/controllers/auth";
import { ProfileController } from "@/controllers/profile";
import { ChangePasswordRequest, profileRequest } from "@/types/Profile/Profile.dto";
import { Routes } from "@/types";

export interface ProfilePageProps extends BlockProps {
  isChangePass: boolean;
  user: UserModel | undefined;
  disabled: boolean;
  isShowModal: boolean;
  router?: Router;
}

export class ProfilePage extends Block {
  constructor(props: ProfilePageProps) {
    super({
      ...props,
      isChangePass: props.isChangePass,
      disabled: props.disabled,
      isShowModal: false,
      user: props.user,
      fileLabel: new Label({
        inputId: "avatarFile",
        title: `<div class="profile-page__main__avatar"><img width="100%" height="100%" alt="User avatar" src="${props?.user?.avatar ? `https://ya-praktikum.tech/api/v2/resources${props?.user?.avatar}` : "/icons/img.svg"}"><img></div>`,
        className: "",
      }),
      fileInput: new Input({
        name: "avatarFile",
        id: "avatarFile",
        type: "file",
        onChange: (e: Event) => {
          e.preventDefault();
          const formData = new FormData();
          const target = e.target as HTMLInputElement;
          if (target.files && target.files.length !== 0) {
            const file = target.files[0];
            formData.append("avatar", file);
            ProfileController.changeAvatar(formData);
          }
        },
      }),

      buttonArrow: new Button({
        isCircle: true,
        text: `<img src='/icons/arrow-left.svg' alt="Arrow left icon"><img>`,
        onClick: () => Router.getInstance().back(),
      }),

      buttonExit: new Button({ text: "Выйти", isGhost: true, isWarning: true, className: "profile-page__footer__btn--warning", onClick: () => AuthController.logout() }),
      buttonToChat: new Button({
        text: "К чатам",
        isGhost: true,
        onClick: () => {
          Router.getInstance().go(Routes.Chats);
        },
      }),

      buttonChangeData: new Button({
        text: "Изменить данные",
        isGhost: true,
        onClick: () => {
          Router.getInstance().go(Routes.EditProfile);
        },
      }),

      buttonChangePass: new Button({
        text: "Изменить пароль",
        isGhost: true,
        onClick: () => {
          Router.getInstance().go(Routes.EditPassword);
        },
      }),
      form: new Form({
        className: "profile-page__main__body",
        isFooter: props.isChangePass || !props.disabled,
        buttonText: "Сохранить",
        onSubmit: (e: Event) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const { isValid, formData } = validateAndCollectFormData(form);
          if (!isValid) {
            console.log("Форма содержит ошибки валидации");
            return;
          }
          if (formData && props.isChangePass) {
            ProfileController.changePassword(formData as unknown as ChangePasswordRequest);
          }
          if (formData && !props.disabled) {
            ProfileController.changeProfile(formData as unknown as profileRequest);
          }
        },
        children: props.isChangePass
          ? [
              new ProfileItem<string>({ name: "oldPassword", label: "Старый пароль", type: "password", disabled: false, validate: validation, validationName: "password" }),
              new ProfileItem<string>({ name: "newPassword", label: "Новый пароль", type: "password", disabled: false, validate: validation, validationName: "password" }),
              new ProfileItem<string>({
                name: "repeatNewPassword",
                label: "Повторите новый пароль",
                type: "password",
                disabled: false,
                validate: validation,
                validationName: "password",
              }),
            ]
          : [
              new ProfileItem<string>({ name: "email", label: "Почта", disabled: props.disabled, value: props.user?.email, validate: validation, validationName: "email" }),
              new ProfileItem<string>({ name: "login", label: "Логин", disabled: props.disabled, value: props.user?.login, validate: validation, validationName: "login" }),
              new ProfileItem<string>({ name: "first_name", label: "Имя", disabled: props.disabled, value: props.user?.first_name, validate: validation, validationName: "name" }),
              new ProfileItem<string>({ name: "second_name", label: "Фамилия", disabled: props.disabled, value: props.user?.second_name, validate: validation, validationName: "name" }),
              new ProfileItem<string>({ name: "display_name", label: "Имя в чате", disabled: props.disabled, value: props.user?.display_name }),
              new ProfileItem<string>({ name: "phone", label: "Телефон", disabled: props.disabled, value: props.user?.phone, validate: validation, validationName: "phone" }),
            ],
      }),
    });
  }

  protected componentDidUpdate() {
    if (this.props.user) {
      const propsUser = this.props.user as UserModel;
      this.children.fileLabel = new Label({
        inputId: "avatarFile",
        title: `<div class="profile-page__main__avatar"><img width="100%" height="100%" alt="User avatar" src="${propsUser?.avatar ? `https://ya-praktikum.tech/api/v2/resources${propsUser?.avatar}` : "/icons/img.svg"}"><img></div>`,
        className: "",
      });
      this.children.form = new Form({
        className: "profile-page__main__body",
        isFooter: (this.props.isChangePass as boolean) || (!this.props.disabled as boolean),
        buttonText: "Сохранить",
        onSubmit: (e: Event) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const { isValid, formData } = validateAndCollectFormData(form);
          if (!isValid) {
            console.log("Форма содержит ошибки валидации");
            return;
          }
          if (formData && this.props.isChangePass) {
            ProfileController.changePassword(formData as unknown as ChangePasswordRequest);
          }
          if (formData && !this.props.disabled) {
            ProfileController.changeProfile(formData as unknown as profileRequest);
          }
        },
        children: this.props.isChangePass
          ? [
              new ProfileItem<string>({ name: "oldPassword", label: "Старый пароль", type: "password", disabled: false, validate: validation, validationName: "password" }),
              new ProfileItem<string>({ name: "newPassword", label: "Новый пароль", type: "password", disabled: false, validate: validation, validationName: "password" }),
              new ProfileItem<string>({
                name: "repeatNewPassword",
                label: "Повторите новый пароль",
                type: "password",
                disabled: false,
                validate: validation,
                validationName: "password",
              }),
            ]
          : [
              new ProfileItem<string>({ name: "email", label: "Почта", disabled: this.props.disabled as boolean, value: propsUser?.email, validate: validation, validationName: "email" }),
              new ProfileItem<string>({ name: "login", label: "Логин", disabled: this.props.disabled as boolean, value: propsUser?.login, validate: validation, validationName: "login" }),
              new ProfileItem<string>({ name: "first_name", label: "Имя", disabled: this.props.disabled as boolean, value: propsUser?.first_name, validate: validation, validationName: "name" }),
              new ProfileItem<string>({
                name: "second_name",
                label: "Фамилия",
                disabled: this.props.disabled as boolean,
                value: propsUser?.second_name as string,
                validate: validation,
                validationName: "name",
              }),
              new ProfileItem<string>({ name: "display_name", label: "Имя в чате", disabled: this.props.disabled as boolean, value: propsUser?.display_name as string }),
              new ProfileItem<string>({ name: "phone", label: "Телефон", disabled: this.props.disabled as boolean, value: propsUser?.phone, validate: validation, validationName: "phone" }),
            ],
      });
    }
    return true;
  }

  override render() {
    return `<div class="profile-page">
      {{{modal}}}
      <aside class="profile-page__sidebar">
        {{{buttonArrow}}}
      </aside>
      <main class="profile-page__main">
        <div class="profile-page__main__container">
          <div><span class="profile-page__main__name-text">{{ user.name }}</span></div>
          {{{fileLabel}}}
          {{{fileInput}}}
          {{{form}}}
          <div class="profile-page__footer">
          ${
            this.props.disabled
              ? `
                <div class="profile-page__footer__item">
                  {{{buttonToChat}}}
                </div>
                <div class="profile-page__footer__item">
                  {{{buttonChangeData}}}
                </div>
                <div class="profile-page__footer__item">
                  {{{buttonChangePass}}}
                </div>
                <div class="profile-page__footer__item">
                  {{{buttonExit}}}
                </div>`
              : ""
          }
          </div>
        </div>
      </main>
    </div>`;
  }
}
