import { ChatsController } from "@/controllers/chats";
import { Dropdown, Form, InputField, Modal } from "..";
import Block from "@/core/Block";
import store from "@/core/Store.ts";
import { validateAndCollectFormData } from "@/utils/validateAndCollectFormData";

interface MessagesFeedHeaderProps {
  avatar: string;
  name: string;
}

export class MessagesFeedHeader extends Block {
  constructor(props: MessagesFeedHeaderProps) {
    super({
      avatar: props.avatar,
      name: props.name,
    });
  }
  init() {
    this.children.createModal = new Modal({
      id: "add-user-modal",
      title: "Добавить пользователя",
      btnText: "Добавить",
      isShow: true,
      children: new Form({
        className: "create-chat",
        formTitle: "",
        buttonText: "Добавить",
        isFooter: true,
        onSubmit: (event: Event) => {
          event.preventDefault();
          const target = event.target as HTMLFormElement;
          const { formData } = validateAndCollectFormData(target);
          if (formData) {
            const userId = formData["user-id"].split(",").map(n => +n);
            const chatId = store?.getState()?.selectedChat?.[0]?.id;
            if (chatId && userId) {
              ChatsController.addUserToChat(chatId, userId);
              target.reset();
              setTimeout(() => {
                this.setProps({
                  isOpenCreateModal: false,
                });
              }, 1000);
            }
          }
        },
        children: [
          new InputField({
            title: "ID пользователя (если несколько, укажите через запятую)",
            name: "user-id",
            id: "chat-user-id",
            border: true,
          }),
        ],
      }),
    });
    this.children.deleteModal = new Modal({
      id: "delete-user-modal",
      title: "Удалить пользователей",
      btnText: "Удалить",
      isShow: true,
      children: new Form({
        className: "create-chat",
        formTitle: "",
        buttonText: "Удалить",
        isFooter: true,
        onSubmit: (event: Event) => {
          event.preventDefault();
          const target = event.target as HTMLFormElement;
          const { formData } = validateAndCollectFormData(target);
          if (formData) {
            const userId = formData["user-id"].split(",").map(n => +n);
            const chatId = store?.getState()?.selectedChat?.[0]?.id;
            if (chatId && userId) {
              ChatsController.deleteUserFromChat(chatId, userId);
              target.reset();
              setTimeout(() => {
                this.setProps({
                  isOpenDeleteModal: false,
                });
              }, 1000);
            }
          }
        },
        children: [
          new InputField({
            title: "ID пользователя (если несколько, укажите через запятую)",
            name: "user-id",
            id: "chat-user-id",
            border: true,
          }),
        ],
      }),
    });
    this.children.dropdown = new Dropdown({
      isOpen: false,
      iconSrc: "/icons/vertical-dots.svg",
      options: [
        {
          iconSrc: "/icons/circle-plus.svg",
          text: "Добавить пользователя",
          onClick: () => {
            this.setProps({ isOpenCreateModal: true });
          },
        },
        {
          iconSrc: "/icons/circle-cross.svg",
          text: "Удалить пользователя",
          onClick: () => {
            this.setProps({ isOpenDeleteModal: true });
          },
        },
        {
          iconSrc: "/icons/circle-cross.svg",
          text: "Удалить чат",
          onClick: () => {
            const selectedChatId = store?.getState()?.selectedChat?.[0]?.id;
            if (selectedChatId) {
              ChatsController.deleteChat(selectedChatId);
            }

            this.setProps({ isOpen: false });
          },
        },
      ],
    });
  }

  override render() {
    return `<header class="messages-feed-header">
                <div class="messages-feed-header__user">
                    ${this.props.avatar ? `<div class="messages-feed-header__avatar"> <img width="48" height="48" class="messages-feed-header__user__avatar" src="https://ya-praktikum.tech/api/v2/resources{{avatar}}" alt=""></div>` : ' <div class="messages-feed-header__avatar"></div>'}
                    <span class="messages-feed-header__name">{{ name }}</span>
                </div>
                {{{dropdown}}}
                {{#if isOpenCreateModal}}
                  {{{createModal}}}
                {{/if}}
                {{#if isOpenDeleteModal}}
                  {{{deleteModal}}}
                {{/if}}
            </header>`;
  }
}
