import Block from "../../framework/block";
import Router from "../../framework/Router";
import { selectors } from "../../framework/selectors";
import store from "../../framework/store";
import ChatController from "../../pages/Chat/ChatController";
import { ChatItem } from "../ChatItem";
import templ from "./chatList.template.hbs?raw";

interface IChatList {
  chats: ChatItem[];
}

export class ChatList extends Block {
  private activeChatId: number | null = null;
  private router: Router;

  constructor(props: IChatList) {
    super({
      ...props,
      events: {
        click: (e: Event) => this.handleClickSettings(e)
      }
    });
    this.router = new Router('app');
  }

  public handleClickSettings(e: Event): void {
    if (e.target === document.querySelector('.chat-text')) {
      this.router.go('/settings')
    }
  }

  public async setActiveChatById(chatId: number): Promise<void> {
    try {      
      const userId = selectors.getUser()?.id;
      const activeChat = this.lists.chats.find(chat => chat.props.id === chatId);

      if (userId) {
        await ChatController.connectToChat(userId, chatId)
      }
      if (!activeChat) {
        throw new Error(`Чат с id ${chatId} не найден`);
      }
      this.activeChatId = chatId;

      store.setState({
        chatsData: {
          interlocutorName: activeChat.props.interlocutorName,
          activeChatId: chatId,
        },
      });      

      this.lists.chats.forEach((chat) => {
        chat.setProps({ activeChat: chat.props.id === chatId });
      });
    } catch (err) {
      throw new Error('Возникла ошибка при подключении WS к чату')
    }
  }

  public addChat(chat: ChatItem): void {
    this.lists.chats.push(chat);
    this.setProps({ ...this.lists.chats, chats: this.lists.chats });
  }

  public getActiveChat(): ChatItem | undefined {
    return this.lists.chats.find((chat) => chat.props.activeChat);
  }

  public getActiveChatBool(): number | null {
    return this.activeChatId;
  }

  protected render(): string {
    return templ;
  }
}
