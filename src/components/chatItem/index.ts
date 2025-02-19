import Block from "../../framework/block";
import ChatController from "../../pages/Chat/ChatController";
import { Message } from "../Message";
import templ from './chatItem.template.hbs?raw';

interface IChatItem {
  id: number,
  isRead: boolean,
  online: boolean,
  activeChat: boolean,
  interlocutorName: string,
  messages: Message[],
  setActiveChatById: (id: number) => void;
}

export class ChatItem extends Block {
  constructor(props: IChatItem) {
    super({
      ...props,
      events: {
        click: () => this.setActiveChat()
      }
    });
  }

  public getOnline(): boolean {
    return this.props.online ? this.props.online : false;
  }

  public sendMessage(content: string): void {
    const newMessage = ChatController.createMessage(content);
    this.lists.messages.push(newMessage);
  }

  public setActiveChat(): void {    
    if (!this.props.activeChat) {
      this.props.setActiveChatById(this.props.id);
    }
  }

  protected render(): string {
    return templ;
  }
};
