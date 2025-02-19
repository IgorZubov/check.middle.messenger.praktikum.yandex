import './errorPage.scss';
import Block from "../../framework/block";
import templ from './errorPage.template.hbs?raw';

export class ErrorPage extends Block {
  constructor(props?: {}) {
    super({...props});
  }

  protected render(): string {
    return templ;
  }
}
