import Block, { BlockProps } from "@/core/Block";
import { ChatModel } from "@/types/models/Chat";
import { formatDate } from "@/utils/formatDate";

interface ChatItemProps extends BlockProps {
  isCurrent?: boolean;
  chat: ChatModel;
  events?: {
    click: () => void;
  };
  onClick?: (chatId: number) => void;
}

export class ChatItem extends Block {
  constructor(props: ChatItemProps) {
    super({
      ...props,
      id: props.chat.id,
      isCurrent: props?.isCurrent || false,
      chat: {
        ...props.chat,
        last_message: {
          ...props.chat.last_message,
          time: props.chat.last_message?.time ? formatDate(props.chat.last_message?.time) : "",
        },
      },
      events: {
        click: (e: MouseEvent) => {
          const target = e.currentTarget as HTMLElement;
          const id = +target.id;
          if (!isNaN(id)) {
            if (props.onClick) props.onClick(id);
          }
        },
      },
    });
  }

  render() {
    return `<li id={{{id}}} class="chat-item">
    <div class='chat-item__container${this.props.isCurrent ? ` chat-item__container--current` : ""}'>
        <div class="chat-item__main">
          {{#if chat.avatar}}
            <img width="48" height="48" class="chat-item__avatar" src="https://ya-praktikum.tech/api/v2/resources{{chat.avatar}}" alt="">
          {{else}}
            <img width="100%" height="100%" class="chat-item__avatar" src='/icons/img.svg' alt="">
          {{/if}}
            <div>
                <div class="chat-item__name"><span class="chat-item__name-text">{{chat.title}}</span></div>
                <div class="chat-item__message"><span class="chat-item__message-text">{{ chat.last_message.content }}</span></div>
            </div>
        </div>
    
        <div class="chat-item__info">
            <div class="chat-item__date">{{ chat.last_message.time }}</div>
              {{#if chat.unread_count}}
                <div class="chat-item__unread">{{ chat.unread_count }}</div>
              {{/if}}
        </div>
  </div>
</li>`;
  }
}
