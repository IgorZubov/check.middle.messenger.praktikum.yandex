import "./authorization.scss";
import Block from "../../framework/block";
import templ from "./authorization.template.hbs?raw";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Link } from "../../components/Link";
import AuthAPI from "./authAPI";
import Router from "../../framework/Router";
import { HTTP_CODES } from "../../enum";

interface IFormData {
  login: string;
  password: string;
  first_name?: string;
  second_name?: string;
  phone?: string;
  email?: string;
}

interface IProps {
  title: string;
  inputs: Input[];
  submit_btn: Button;
  links: Link[];
}

export class AuthPage extends Block {
  private authAPI = AuthAPI;
  private router: Router;
  private formErrorElement: HTMLDivElement | null;
  constructor(props: IProps) {
    super({
      events: {
        click: (e: Event) => this.handleSubmitData(e),
      },
      ...props,
    });
    this.router = new Router("app");
    this.formErrorElement = null;
  }

  public showFormError(message: string): void {
    if (!this.formErrorElement) {
      this.formErrorElement = document.createElement("div");
      this.formErrorElement.classList.add("form-error");
      this.getContent().appendChild(this.formErrorElement);
    }
    this.formErrorElement.textContent = message;
  }

  // Метод для скрытия ошибок формы
  public clearFormError(): void {
    if (this.formErrorElement) {
      this.formErrorElement.textContent = "";
    }
  }

  // Валидация
  public validateField(name: string, value: string): string | null {
    const nameRegex = /^[A-ZА-ЯЁ][a-zа-яё-]{1,}$/u;
    const loginRegex = /^(?!^\d+$)[A-Za-z0-9_-]{3,20}$/;
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    switch (name) {
      case "login":
        if (!value) return "Логин не может быть пустым";
        if (!loginRegex.test(value))
          return "Логин может содержать только латинские буквы, цифры, подчеркивания и дефисы, а начинаться с буквы или цифры";
        break;
      case "password":
        if (!value) return "Пароль не может быть пустым";
        if (value.length < 8) return "Пароль должен быть не менее 8 символов";
        break;
      case "first_name":
        if (!value) return "Имя не может быть пустым";
        if (value.length <= 2) return "Имя не должно быть коротким";
        if (!nameRegex.test(value))
          return "Имя должно начинаться с заглавной буквы и содержать только буквы и дефис";
        break;
      case "second_name":
        if (!value) return "Фамилия не может быть пустым";
        if (value.length <= 4) return "Фамилия не должно быть коротким";
        if (!nameRegex.test(value))
          return "Фамилия должно начинаться с заглавной буквы и содержать только буквы и дефис";
        break;
      case "phone":
        if (!value) return "Номер телефона не может быть пустым";
        if (!phoneRegex.test(value)) return "Введите корректный номер телефона";
        break;
      case "email":
        if (!value) return "Email не может быть пустым";
        if (!emailRegex.test(value)) return "Введите корректный email";
        break;
      default:
        return null;
    }
    return null;
  }

  // Показ ошибки под полями
  public showError(input: Block, errorMessage: string | null): void {
    const errorElement = input
      .getContent()
      .parentElement?.querySelector(".error") as HTMLElement;
    if (errorMessage) {
      if (errorElement) {
        errorElement.textContent = errorMessage;
      } else {
        const errorDiv = document.createElement("div");
        errorDiv.classList.add("error");
        errorDiv.textContent = errorMessage;
        input.getContent().parentElement?.appendChild(errorDiv);
      }
    } else if (errorElement) {
      errorElement.remove();
    }
  }

  // Обработка данных формы и валидация
  public handleSubmitData = async (e: Event): Promise<void> => {
    e.preventDefault();
    let formData = {} as IFormData;
    let hasErrors = false;

    if (e.target === this.children.submit_btn.getContent()) {
      this.clearFormError();
      this.lists.inputs.forEach((inp) => {
        const inpName: string = inp.props.input.name;
        const inpValue: string = inp.getValue();
        const errorMessage: string | null = this.validateField(
          inpName,
          inpValue
        );
        const errorDiv: HTMLDivElement | null =
          document.querySelector(".error");

        if (errorMessage) {
          this.showError(inp, errorMessage);
          hasErrors = true;
          errorDiv?.scrollIntoView({ behavior: "smooth", block: "center" });
          throw new Error(`Ошибка валидации полей: ${errorMessage}`);
        } else {
          formData[inpName as keyof typeof formData] = inpValue;
          this.showError(inp, null);
        }
      });

      if (!hasErrors) {
        if (location.pathname !== "/sign-up") {
          try {
            await this.authAPI.signIn(formData).then((res) => {
              if (res.status !== HTTP_CODES.UNAUTHORIZED) {
                this.clearForm(formData);
                this.router.go("/messenger");
                this.router.blockRoute('/');
              } else {
                this.showFormError("Неверные данные.");
                throw new Error("Неверные данные");
              }
            });
          } catch (err) {
            console.error("Ошибка при авторизации: ", err);
          }
        } else {
          try {
            await this.authAPI.signUp(formData);
            console.log("Отправка даных: ", formData);
            this.clearForm(formData);
          } catch (err) {
            console.error("Ошибка при регистрации: ", err);
          }
        }
      }
    }
  };

  public clearForm(formData: IFormData): void {
    this.lists.inputs.forEach((inp) => inp.clearValue());
    Object.keys(formData).forEach((key) => {
      formData[key as keyof IFormData] = "";
    });
  }

  protected componentDidMount(): void {
    AuthAPI.getUser()
      .then((res) => {
        const data = JSON.parse(res.response);
        if (!data.reason) {
          console.log('Авторизован');

          this.router.forward();
          this.router.go("/messenger");
        } else {
          console.log('Не авторизован');
          return
        }
      });
    
    this.lists.inputs.forEach((input: any) => {
      const inputElement = input.getContent().childNodes[3];
      inputElement.addEventListener("blur", () => {      
        const name = input.props.input.name;
        const value = inputElement.value;
        const errorMessage = this.validateField(name, value);
        this.showError(input, errorMessage);
      });
    });
  }

  protected render(): string {
    return templ;
  }
}
