import Block from "@/core/Block";
import { Label } from "@/components/label";
import { InputElement } from "@/components/input";
import { IValidationReturn } from "@/utils";

export interface InputFieldProps<T> {
  className?: string;
  inputClassName?: string;
  isCircle?: boolean;
  nobg?: boolean;
  placeholder?: string;
  name: string;
  title: string;
  id: string;
  type?: string;
  value?: T;
  isSearch?: boolean;
  border?: boolean;
  validationName?: string;
  validate?: (name: string, value: string) => IValidationReturn;
  error?: string;
}
export class InputField<T> extends Block {
  constructor(props: InputFieldProps<T>) {
    super({
      ...props,
      attr: {
        class: `input-field ${props.className || ""}`,
      },
      label: new Label({ inputId: props.id, title: props.title }),
      input: new InputElement({
        className: props.inputClassName,
        isCircle: props.isCircle,
        nobg: props.nobg,
        placeholder: props.placeholder,
        name: props.name,
        id: props.id,
        value: props?.value,
        type: props.type,
        border: props.border,
        validate: props.validate,
        validationName: props.validationName,
      }),
    });
  }

  render() {
    return `<div class="input-field">{{{label}}}{{{input}}}</div>`;
  }
}
