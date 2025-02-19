import Router from "../../framework/Router";
import { RESOURCE_URL } from "../../api/url-api";
import { selectors } from "../../framework/selectors";
import store from "../../framework/store";
import authAPI from "../Аuthorization/authAPI";
import settingsAPI from "./settingsAPI";

class SettingsController {
  private router: Router;

  constructor () {
    this.router = new Router('app')
  }

  public async getUser(): Promise<any> {
    try {
      const data = await settingsAPI
        .getUser()
        .then((res) => JSON.parse(res.response))

      store.setState({
        user: data,
        greetings: `Hello, ${data.first_name}!`,
      });      
      
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'avatar' && value) {
          this.updateAvatar(data, value);
          return;
        }
        
        const inputElement = document.querySelector(`input[name="${key}"]`) as HTMLInputElement;
        
        if (inputElement) {
          inputElement.value = value ? value.toString() : '';
        }
      });
      this.updateGreeting();
    } catch (err) {
      throw new Error('При получении пользователя произошла ошибка: ');
    }
  }

  public async updateUserData(): Promise<void> {
    const inputs = document.querySelectorAll('input:not([type="password"]):not([type="file"])') as NodeListOf<HTMLInputElement>;

    const updatedData: any = selectors.getUser();
    inputs.forEach((input) => {
      const { name, value } = input;
      if (name) {
        updatedData[name] = value;
      }
    });
    updatedData.avatar = selectors.getAvatar();


    try {
      await settingsAPI.updateUser(updatedData);

      store.setState({
        user: updatedData,
        greetings: `Hello, ${updatedData.first_name}!`
      });
      this.updateGreeting();
      
      this.updAvatar(updatedData.avatar)
      
    } catch (err) {
      console.error("Ошибка при обновлении данных:", err);
    }
  }

  public async updatePassword(): Promise<void> {
    const oldPasswordInput = document.querySelector('input[name="oldPassword"]') as HTMLInputElement;
    const newPasswordInput = document.querySelector('input[name="newPassword"]') as HTMLInputElement;

    if (!oldPasswordInput || !newPasswordInput) {
      console.error("Не удалось найти один из элементов пароля.");
      return;
    }

    const oldPassword = oldPasswordInput.value;
    const newPassword = newPasswordInput.value;

    if (newPassword && oldPassword !== newPassword) {
      try {
        await settingsAPI.updatePassword({ oldPassword, newPassword });
        console.log("Пароль успешно обновлен");
      } catch (err) {
        console.error("Ошибка при обновлении пароля:", err);
      }
    } else {
      console.error("Новый пароль и подтвержденный пароль не совпадают или совпадают со старым паролем.");
    }
  }

  public async handleAvatarChange(e: Event): Promise<void> {
    if (e.target !== document.querySelector('input[type="file"]')) return;
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;    
    
  
    if (input && input.files?.length) {
      const formData = new FormData();
      const file = input.files[0];
      formData.append('avatar', file);
        
      try {
        const response = await settingsAPI.updateAvatar(formData);
        const userData = JSON.parse(response.response);
  
        store.setState({
          user: userData,
        });
  
        const avatarElement = document.querySelector('.avatar') as HTMLImageElement;
        if (avatarElement) {
          this.updateAvatar(userData, userData.avatar);
          this.updateGreeting();
        }
  
        console.log('Аватар успешно обновлен:', userData);
      } catch (err) {
        console.error('Ошибка при обновлении аватара:', err);
      }
    } else {
      console.error('Файл не выбран.');
    }
  }

  private updAvatar(url: any) {
    const avatarInp = document.querySelector('.avatar') as HTMLImageElement;
    avatarInp.src = `${url}`;
  }

  private updateAvatar(state: any, url: string | {}): void {
    store.setState({
      user: {
        ...state,
        avatar: `${RESOURCE_URL}${url}`
      }
    })
    const avatarInp = document.querySelector('.avatar') as HTMLImageElement;
    avatarInp.src = `${RESOURCE_URL}${url}`;
  }

  private updateGreeting = () => {
    const greetings = document.querySelector('.greetings');
    const userName = store.getState().greetings ?? `Hello, Guest!`;
    if (greetings) {      
      greetings.textContent = userName;
    }
  }

  public async handleClick(e: Event): Promise<void> {
    const target = e.target as HTMLElement;

    if (target.textContent?.trim() === 'Save new Data') {
      await this.updateUserData();
    }
    if (target.textContent?.trim() === 'Save New Password') {
      await this.updatePassword();
    }
    if (target.textContent?.trim() === 'Quit') {
      this.router.unblockRoute('/');
      this.router.go('/');
      authAPI.logout();
    }
  }
}

export default new SettingsController();
