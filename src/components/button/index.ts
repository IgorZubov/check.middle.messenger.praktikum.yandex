import Block from "../../framework/block";
import Router from "../../framework/Router";
import templ from './button.template.hbs?raw';

interface IButton {
  class: string,
  theme?: string,
  text: string,
  linkTo?: string
}

export class Button extends Block {
  constructor(props: IButton) {
    const router = new Router('app');
    super({
      ...props,
      events: {
        click: () => {
          if (props.linkTo === "back") {
            router.back();
          } else if (props.linkTo) router.go(props.linkTo);
        }
      }
    });
  }

  protected render(): string {
    return templ;
  }
}
