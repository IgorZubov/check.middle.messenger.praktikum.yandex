import Block from "@/core/Block";
import { ChatHeader, ChatItem } from "@/components";
import { ChatsController } from "@/controllers/chats";
import { ChatModel } from "@/types/models/Chat";
import { MessagesController } from "@/controllers/messages";
import { MessagesFeed } from "@/components/messagesFeed";

export class ChatPage extends Block {
  constructor() {
    super({});
  }

  init() {
    this.children.messagesFeed = new MessagesFeed({});
    this.children.chatHeader = new ChatHeader();
  }

  componentDidUpdate() {
    if (this.props.chatsList) {
      const propsChatsList = this.props.chatsList as ChatModel[];
      const chatItem = propsChatsList.map(
        chat =>
          new ChatItem({
            chat: chat,
            id: chat.id,
            isCurrent: chat.id === this.props.currentChat,
            onClick: (chatId: number) => {
              ChatsController.selectChat(chatId);
              MessagesController.findMessages(chatId);
            },
          }),
      );
      this.children.lists = chatItem;
    }
    return true;
  }

  componentDidMount() {
    ChatsController.getChatsList();
  }

  override render() {
    return `<div class="chat-page">
                <aside class="chat-page__list">
                    {{{chatHeader}}}
                    <ul class="chat-page__list-container">
                      {{#each lists}}
                        {{{this}}}
                      {{/each}}
                    </ul>
                </aside>
              
  
              <div class="chat-page__messages">
                {{#if currentChat}}
                  {{{messagesFeed}}}
                {{else}}
                  <span class="chat-page__no-data">Выберите чат чтобы отправить сообщение</span>
                {{/if}}    
              </div>
        </div>`;
  }
}
