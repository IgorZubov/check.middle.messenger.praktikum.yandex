import Block from "@/core/Block";
import { Button } from "../button";
import { Link } from "../link";
import { Title } from "../title";

interface FormProps {
  className?: string;
  formTitle?: string;
  buttonText?: string;
  children: Block[];
  linkText?: string;
  linkPage?: string;
  isFooter?: boolean;
  onSubmit: (e: Event) => void;
}

export class Form extends Block {
  constructor(props: FormProps) {
    super({
      ...props,
      events: {
        submit: (e: Event) => props.onSubmit(e),
      },
      attr: {
        class: props.className || "",
      },
      isFooter: props.isFooter ?? true,
      button: new Button({ text: props.buttonText || "", type: "submit" }),
      title: new Title({ title: props.formTitle || "" }),
      link: props.linkText
        ? new Link({
            text: props.linkText,
            url: props.linkPage || "",
          })
        : "",
      children: props.children,
    });
  }

  init() {
    this.children.inputs = this.props.children as Block;
  }

  render() {
    return `<form>
              ${this.props.formTitle ? `{{{title}}}` : ""}
                {{#each inputs}}
                    {{{this}}}
                {{/each}}
              ${
                this.props.isFooter
                  ? `<div class="form__footer">
                {{{button}}}
                {{{link}}}
                {{{linkReturn}}}
              </div>`
                  : ""
              }
            </form>`;
  }
}
