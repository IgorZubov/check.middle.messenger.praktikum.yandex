import Block from "../../framework/block";
import templ from './message.template.hbs?raw';

export class Message extends Block {
  constructor(props?: {}) {
    super({...props});
  }
  public render(): string {
    return templ;
  }
};
