import EventBus from "./EventBus.ts";
import { set } from "@/utils/set.ts";
import { UserModel } from "@/types/models/User";
import { ChatModel } from "@/types/models/Chat";
import { MessageModel } from "@/types/models/Message";

export interface State {
  chats?: ChatModel[];
  selectedChat?: ChatModel[] | undefined;
  user?: UserModel;
  currentMessages?: MessageModel[];
  messages?: Record<number, MessageModel[]>;
}

export enum StoreEvents {
  Updated = "Updated",
}

class Store extends EventBus {
  private state: State = {};

  constructor() {
    super();
  }

  getState(): State {
    return this.state;
  }

  set(path: string, value: unknown) {
    if (path === "selectedChat") {
      set(this.state, path, [value]);
    } else {
      set(this.state, path, value);
    }
    this.emit(StoreEvents.Updated, this.state);
  }
}

export default new Store();
