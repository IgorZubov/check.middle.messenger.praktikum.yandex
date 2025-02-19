import { MessagesController } from "@/controllers/messages";
import { Button, Form, Input, InputElement, Label } from "..";
import Block from "@/core/Block";
import { validation } from "@/utils";
import { validateAndCollectFormData } from "@/utils/validateAndCollectFormData";
import store from "@/core/Store.ts";

export class MessagesFeedFooter extends Block {
  constructor() {
    super({
      form: new Form({
        isFooter: false,
        className: "messages-feed-footer__form",
        onSubmit: (e: Event) => {
          e.preventDefault();

          const form = e.target as HTMLFormElement;

          const { isValid, formData } = validateAndCollectFormData(form);

          if (!isValid) {
            console.log("Форма содержит ошибки валидации");
            return;
          }
          if (formData) {
            const { message } = formData;
            const chatId = store.getState().selectedChat?.[0]?.id;
            if (chatId) {
              MessagesController.sendMessage(chatId, message);
              form.reset();
            }
          }
          console.log(`Данные формы отправки сообщения: `, formData);
        },
        children: [
          new Label({ inputId: "file", title: "", className: " messages-feed-footer__form__file-label" }),
          new Input({
            name: "file",
            id: "file",
            type: "file",
          }),
          new InputElement<string>({
            className: "input__element",
            isCircle: true,
            id: "message-input",
            placeholder: "Сообщение",
            name: "message",
            validate: validation,
            validationName: "not_empty",
          }),
          new Button({
            className: "messages-feed-footer__btn",
            isCircle: true,
            type: "submit",
            text: '<img src="/icons/arrow-right.svg" alt="Arrow right icon"><img>',
          }),
        ],
      }),
    });
  }

  override render() {
    return `<footer class="messages-feed-footer">
        {{{form}}}
    </footer>`;
  }
}
