import Block from "@/core/Block";
import { Form, InputField } from "@/components";
import { validation } from "@/utils";
import { AuthController } from "@/controllers/auth";
import { validateAndCollectFormData } from "@/utils/validateAndCollectFormData";
import { Router } from "@/core/Router";

export interface LoginPageProps {
  isRegistration: boolean;
  buttonText: string;
  onBtnClick?: () => void;
  title: string;
  linkText: string;
  linkPage: string;
  router?: Router;
}

export class LoginPage extends Block {
  constructor(props: LoginPageProps) {
    super({
      ...props,
      isRegistration: props?.isRegistration,
      form: new Form({
        className: "login-form",
        formTitle: props.title,
        buttonText: props.buttonText,
        linkText: props.linkText,
        linkPage: props.linkPage,
        onSubmit: (e: Event) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const { isValid, formData } = validateAndCollectFormData(form);
          if (!isValid) {
            console.log("Форма содержит ошибки валидации");
            return;
          }
          if (props?.isRegistration) {
            AuthController.signup({
              login: formData.login,
              password: formData.password,
              first_name: formData.first_name,
              second_name: formData.second_name,
              email: formData.email,
              phone: formData.phone,
            });
          } else {
            AuthController.signin({ login: formData.login, password: formData.password });
          }

          console.log(`Данные формы ${props?.isRegistration ? "регистрации" : "логина"}: `, formData);
        },
        children: props.isRegistration
          ? [
              new InputField<string>({
                className: "login-form__input",
                title: "Логин",
                name: "login",
                id: "login-login",
                nobg: true,
                border: true,
                validate: validation,
                validationName: "login",
              }),
              new InputField<string>({
                className: "login-form__input",
                title: "Почта",
                name: "email",
                id: "reg-email",
                border: true,
                nobg: true,
                validate: validation,
                validationName: "email",
              }),
              new InputField<string>({
                className: "login-form__input",
                title: "Имя",
                name: "first_name",
                id: "reg-first_name",
                border: true,
                nobg: true,
                validate: validation,
                validationName: "name",
              }),
              new InputField<string>({
                className: "login-form__input",
                title: "Фамилия",
                name: "second_name",
                id: "reg-second_name",
                border: true,
                nobg: true,
                validate: validation,
                validationName: "name",
              }),
              new InputField<string>({
                className: "login-form__input",
                title: "Телефон",
                name: "phone",
                id: "reg-phone",
                border: true,
                nobg: true,
                validate: validation,
                validationName: "phone",
              }),
              new InputField<string>({
                className: "login-form__input",
                title: "Пароль",
                name: "password",
                id: "reg-password",
                type: "password",
                border: true,
                nobg: true,
                validate: validation,
                validationName: "password",
              }),
              new InputField<string>({
                className: "login-form__input",
                title: "Пароль (еще раз)",
                name: "password_repeat",
                id: "reg-password-repeat",
                type: "password",
                border: true,
                nobg: true,
                validate: validation,
                validationName: "password",
              }),
            ]
          : [
              new InputField<string>({
                className: "login-form__input",
                title: "Логин",
                name: "login",
                id: "login-login",
                nobg: true,
                border: true,
                validate: validation,
                validationName: "login",
              }),
              new InputField<string>({
                className: "login-form__input",
                title: "Пароль",
                name: "password",
                id: "login-password",
                type: "password",
                border: true,
                nobg: true,
                validate: validation,
                validationName: "password",
              }),
            ],
      }),
    });
  }

  override render() {
    return `<main class="login-page">
        <div class="login-page-card">
          {{{form}}}
        </div>
      </main>`;
  }
}

export default LoginPage;
