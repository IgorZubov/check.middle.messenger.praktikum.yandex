import "./modal.scss";
import Block from "../../framework/block";
import templ from "./modal.template.hbs?raw";
import ChatController from "../../pages/Chat/ChatController";
import { selectors } from "../../framework/selectors";
import settingsAPI from "../../pages/Settings/settingsAPI";
import ChatAPI from "../../pages/Chat/ChatAPI";
import store from "../../framework/store";

export class Modal extends Block {
  constructor(props = {}) {
    super({
      ...props,
      events: {
        click: (e: PointerEvent) => this.handleCloseModal(e),
        submit: (e: SubmitEvent) => this.handleSubmitModal(e),
      },
    });

    console.log(props);
  }

  public on(): void {
    this._element?.classList.add("modal--visible");
  }

  public off() {
    this._element?.classList.remove("modal--visible");
  }

  public handleCloseModal(e: Event) {
    if (e.target === document.querySelector("#modalClose")) {
      this.off();
    }
  }

  public handleSubmitModal(e: SubmitEvent): void {
    e.stopImmediatePropagation();
    e.preventDefault();
    const submitEvent = e.submitter?.id;
    if (!submitEvent) return;

    if (submitEvent === "modalBtn") {
      if (e.target === document.querySelector(".modal-form")) {
        e.stopImmediatePropagation();
        e.preventDefault();

        const input = this._element?.querySelector(
          ".modal-input"
        ) as HTMLInputElement;
        const chatTitleValue = input.value.trim();

        if (chatTitleValue) {
          ChatController.createChat({ title: chatTitleValue });
          this.off();
        }
      }
    }

    if (submitEvent === "userBtn") {
      const input = document.querySelector(".modal-input") as HTMLInputElement;
      const userLoginValue = input.value.trim();
      const activeChatId = selectors.getActiveChatId();
      const intrlctrName = selectors.getChatsData().interlocutorName;
      if (!activeChatId)
        throw new Error("Не удалось получить id активного чата");
      if (!intrlctrName) throw new Error("Не удалось получить название чата");

      settingsAPI
        .searchUser({ login: userLoginValue })
        .then((res) => JSON.parse(res.response))
        .then((data) => {
          ChatAPI.addUserToChat(activeChatId, data[0].id);

          store.setState({
            chatsData: {
              activeChatId: activeChatId,
              interlocutorName: intrlctrName,
              users: [...data],
            },
          });

          this.createUser(data);

          console.log("Пользователь успешно добавлен в чат!");
          this.off();
        })
        .catch((err) => console.error(err));
    }
  }

  private mountModal(selector: string): void {
    if (!this._element) {
      throw new Error("Нету элемента");
    }
    document.querySelector(selector)?.appendChild(this._element);
  }

  private createUser(data: []): void {
    const usersContainer = document.querySelector(".users") as HTMLDivElement;
    data.forEach((elem: any) => {
      const newUser = document.createElement("p");
      newUser.textContent = elem.display_name;
      newUser.id = `ueserId__${elem.id}`;
      newUser.onclick = () => this.deleteUser(elem.id);
      usersContainer.appendChild(newUser);
    });
  }

  public async deleteUser(userId: number): Promise<any> {
    const activeChatId = selectors.getActiveChatId();
    if (!activeChatId) throw new Error("Не удалось получить id активного чата");

    await ChatAPI.deleteUserFromChat(activeChatId, userId)
      .then(() => {
        const usersContainer = document.querySelector(
          ".users"
        ) as HTMLDivElement;
        console.log(usersContainer);
        
        const userElement = document.querySelector(`#ueserId__${userId}`);
        if (userElement) {
          usersContainer.removeChild(userElement);
        }

        console.log(
          `Пользователь с id ${userId} был удалён из чата ${activeChatId}`
        );
      })
      .catch((err) => {
        console.error(`Ошибка при удалении пользователя с id ${userId}:`, err);
      });
  }

  protected componentDidMount(): void {
    this.mountModal("#app");
  }

  protected render(): string {
    return templ;
  }
}
