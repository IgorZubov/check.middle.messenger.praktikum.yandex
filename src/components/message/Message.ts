import Block, { BlockProps } from "@/core/Block.ts";
import { MessageModel } from "@/types/models/Message/index.ts";
import "./message.scss";

export interface MessageProps extends BlockProps {
  message: MessageModel;
}

export class Message extends Block {
  constructor(props: MessageProps) {
    super(props);
  }

  render() {
    return `
      {{#if message.sent}}
        <li class="messages messages__sent">
          <p class="messages__text">{{message.content}}</p>
          <span class="messages__sent__time">{{message.time}}</span>
        </li>
      {{else}}
        <li class="messages">
          <p class="messages__text">{{message.content}}</p>
          <span class="messages__time">{{message.time}}</span>
        </li>
      {{/if}}
    `;
  }
}
