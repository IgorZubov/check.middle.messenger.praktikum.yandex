import { InputElement } from "..";
import Block from "@/core/Block";
import { IValidationReturn } from "@/utils";

interface ProfileItemProps<T> {
  label: string;
  name: string;
  value?: T;
  type?: string;
  disabled: boolean;
  validationName?: string;
  validate?: (name: string, value: string) => IValidationReturn;
}

export class ProfileItem<T> extends Block {
  constructor(props: ProfileItemProps<T>) {
    super({
      ...props,
      input: new InputElement({
        className: "profileItem__value",
        disabled: props.disabled,
        name: props.name,
        id: props.name,
        value: props.value,
        type: props.type,
        nobg: true,
        validationName: props.validationName,
        validate: props.validate,
      }),
    });
  }

  render() {
    return `<div class="profileItem">
      <div class="profileItem__label">{{ label }}</div>
      {{{input}}}
    </div>`;
  }
}
