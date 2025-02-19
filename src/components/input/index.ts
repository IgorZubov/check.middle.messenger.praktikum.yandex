import Block from "../../framework/block";
import templ from './input.template.hbs?raw';

interface IInput {
  titleInp: string,
  wrapInp: string,
  input: {
    type: string,
    name: string,
    value?: string | null,
  }
}

export class Input extends Block {
  private _inputElement = this._element?.querySelector(`input[name="${this.props.input.name}"]`) as HTMLInputElement;

  constructor(props: IInput) {
    super({ ...props });
  }

  public getValue(): string {
    return this._inputElement ? this._inputElement.value : '';
  }

  public clearValue(): void {
    if (this._inputElement) {
      this._inputElement.value = '';
    }
  }

  render(): string {
    return templ;
  }
}
