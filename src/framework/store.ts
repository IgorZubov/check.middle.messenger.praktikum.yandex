import { STORE_EVENTS } from "../enum";
import { IMessage, IUser } from "../interfaces";
import EventBus from "./eventBus";

export interface IChat {
  id: number,
  title: string,
  avatar: null | string,
  created_by: number,
  unread_count: number,
  last_message: {
    user: IUser,
    time: string,
    content: string
  }
}

interface IState {
  chatsData?: {
    activeChatId?: number | null,
    interlocutorName?: string | null,
    chats?: IChat[]
  }
  user: IUser | null;
  greetings: string | null;
  messages: IMessage[];
}

class Store extends EventBus {
  private state: IState  = {
    user: null,
    greetings: '',
    messages: [],
  };

  public getState(): IState {
    return this.state;
  }

  public setState(nextState: Partial<any>): void {
    const prevState = this.getState();
    this.state = { ...this.state, ...nextState };

    if (this.listeners[STORE_EVENTS.Updated]) {
      this.emit(STORE_EVENTS.Updated, prevState, nextState);
    }
  }
}

export default new Store();
