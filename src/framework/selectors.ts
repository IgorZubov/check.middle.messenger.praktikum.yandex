import { IMessage, IUser } from "../interfaces";
import ChatController from "../pages/Chat/ChatController";
import store from "./store";

class Selectors {
  public getUser(): IUser | null {
    return store.getState().user;
  }

  public setAvatar(path: any): void {
    store.setState({
      user: {
        avatar: path
      }
    });
  }

  public getAvatar(): string | undefined {
    return store.getState().user?.avatar;
  }

  public getActiveChatId(): number | null | undefined {
    return store.getState().chatsData?.activeChatId;
  }

  public getChatsData(): any {
    return store.getState().chatsData;
  }

  public setUser(user: IUser | null): void {
    store.setState({ user });
  }

  public setMessages(messages: string[]): void {
    const messageItems = messages.reverse();
    let msgs = messageItems.map((item: any) => ChatController.createMessage(item.content))
    store.setState({ messages: msgs });
  }

  public addMessage(message: IMessage): void {
    const state = store.getState();
    state.messages.push(message);
    store.setState({ messages: state.messages });
  }
}

export const selectors = new Selectors();
