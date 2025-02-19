import Block from "@/core/Block";

interface InputProps<T> {
  className?: string;
  accept?: string;
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
  onChange?: (value: Event) => void;
  onBlur?: (event: FocusEvent) => void;
}

export class Input<T> extends Block {
  constructor(props: InputProps<T>) {
    super({
      ...props,
      events: {
        blur: props.onBlur,
        ...(props.onChange ? { change: props.onChange } : {}),
      },
      value: String(props.value || ""),
      className: `input--w100 ${props.className ? `${props.className}` : ""}`,
      attr: {
        type: props.type || "text",
        id: String(props.id),
        placeholder: props.placeholder || "",
        name: props.name,
        disabled: props.disabled || false,
      },
      search: props.isSearch
        ? '<svg class="input__icon" aria-hidden="true" viewBox="0 0 24 24"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path></g></svg>'
        : "",
    });
  }

  componentDidMount() {
    const element = this.element as HTMLInputElement;
    if (this.props.nobg) {
      element.classList.add("input__element--no-bg");
    }
    if (this.props.type === "file") {
      element.classList.add("input__element--type-file");
    }
    if (this.props.isCircle) {
      element.classList.add("input--circle-border");
    }
    if (this.props.border) {
      element.classList.add("input--border");
    }
  }

  render() {
    return `
      <input class="{{className}}" value="{{value}}" />
      {{{search}}}
    `;
  }
}
