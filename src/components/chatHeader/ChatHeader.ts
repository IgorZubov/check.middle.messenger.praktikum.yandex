import { Routes } from "@/types";
import { Input, Link, Button, InputField, Modal, Form } from "..";
import Block from "@/core/Block";
import { validateAndCollectFormData } from "@/utils/validateAndCollectFormData";
import { ChatsController } from "@/controllers/chats";
import { InputFieldProps } from "../inputField";

export class ChatHeader extends Block {
  constructor() {
    super({
      linkProfile: new Link({
        text: "Профиль ",
        url: Routes.Profile,
        secondary: "secondary",
      }),
      input: new Input({
        className: "input__element",
        type: "search",
        id: "chat-search",
        placeholder: "Поиск",
        name: "chat-search",
        nobg: false,
        isSearch: true,
        onBlur: event => {
          const target = event.target as HTMLInputElement;
          const value = target.value;
          ChatsController.getChatsList(value);
        },
      }),
      createBtn: new Button({
        className: "chat-header__create-btn",
        isCircle: true,
        isGhost: true,
        text: `<img alt="Create chat button" src='/icons/circle-plus.svg' />`,
        onClick: () => {
          this.setProps({ isOpenCreateModal: true });
        },
      }),
      modal: new Modal({
        id: "create-chat-modal",
        title: "Создать чат",
        btnText: "Создать",
        isShow: true,
        children: new Form({
          className: "create-chat",
          formTitle: "",
          buttonText: "Создать",
          isFooter: true,
          onSubmit: (e: Event) => {
            const form = e.target as HTMLFormElement;
            const { formData } = validateAndCollectFormData(form);
            ChatsController.create(formData.title);
            form.reset();
            this.setProps({ isOpenCreateModal: false });
          },
          children: [
            new InputField<InputFieldProps<string>>({
              title: "Имя чата",
              name: "title",
              id: "create-chat-form-title",
              border: true,
            }),
          ],
        }),
      }),
    });
  }

  render() {
    return `<div class="chat-header">
            <nav class="chat-header__nav">
                {{{linkProfile}}}
            </nav>
            <div class="chat-header__search">
              {{{input}}}
              {{{createBtn}}}
            </div>
              {{#if isOpenCreateModal}}
                {{{modal}}}
              {{/if}}
        </div>`;
  }
}
