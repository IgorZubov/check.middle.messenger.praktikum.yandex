import Block, { BlockProps } from "@/core/Block";
import { IValidationReturn } from "@/utils";
import { ErrorLine } from "./ErrorLine";
import { Input } from "./Input";

interface InputElementProps<T> extends BlockProps {
  className?: string;
  border?: boolean;
  nobg?: boolean;
  isCircle?: boolean;
  placeholder?: string;
  name: string;
  id: string | number;
  type?: string;
  isSearch?: boolean;
  value?: T;
  disabled?: boolean;
  onChange?: (value: KeyboardEvent) => void;
  validationName?: string;
  validate?: (name: string, value: string) => IValidationReturn;
  error?: string;
}

export class InputElement<T> extends Block {
  constructor(props: InputElementProps<T>) {
    super({
      ...props,
    });
  }

  init() {
    this.children.input = new Input({
      className: this.props.className as string,
      isCircle: this.props.isCircle as boolean,
      disabled: this.props.disabled as boolean,
      nobg: this.props.nobg as boolean,
      placeholder: this.props.placeholder as string,
      name: this.props.name as string,
      id: this.props.id as string,
      value: this.props?.value,
      type: this.props.type as string,
      border: this.props.border as boolean,
      onBlur: (event: FocusEvent) => {
        const target = event.target as HTMLInputElement;
        if (this.props.validate) {
          const { isValid, errorMessage } = this.props.validate(this.props.validationName || "", target.value as string);
          const classLine = {
            className: isValid ? target?.className.split(" input--invalid").join("") : target?.className.includes("input--invalid") ? target?.className : target?.className + " input--invalid",
          };

          this.setProps({ error: errorMessage, value: target.value, ...classLine });
        } else {
          this.setProps({ value: target.value, error: "" });
        }
      },
    });
  }

  componentDidUpdate() {
    const error = this.props.error as string;
    if (error.length > 0) {
      this.children.errorLine = new ErrorLine({
        error: error || "",
      });
    } else {
      const errorLine = this.children.errorLine as Block;
      errorLine?.hide();
    }

    return true;
  }

  render() {
    return `
      <div class="input__error__container">
        {{{input}}}
        {{{errorLine}}}
      </div>
    `;
  }
}
