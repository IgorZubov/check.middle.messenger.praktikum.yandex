import Block from "../../framework/block";
import Router from "../../framework/Router";
import templ from './link.template.hbs?raw';

interface ILink {
  text: string;
  to?: string;
}

export class Link extends Block {
  constructor(props: ILink) {
    const router = new Router('app');
    super({
      ...props,
      events: {
        click: () => {
          if (props.to) {
            router.go(props.to)
          }
        }
      }
    });
  }

  protected render(): string {
    return templ;
  }
}
