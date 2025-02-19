import Block from "@/core/Block";

interface ButtonProps {
  onClick?: (value: MouseEvent) => void;
  className?: string;
  text: string;
  page?: string;
  type?: string;
  isCircle?: boolean;
  isGhost?: boolean;
  isWarning?: boolean;
  underline?: boolean;
}

export class Button extends Block {
  constructor(props: ButtonProps) {
    super({
      ...props,
      events: props?.onClick ? { click: props.onClick } : {},
      attr: {
        class: `button ${props.className || ""}`,
        type: props.type || "button",
        page: props.page || "",
      },
    });
  }

  componentDidMount() {
    const element = this.element as HTMLInputElement;
    if (this.props.isGhost) {
      element.classList.add("button--ghost");
    }
    if (this.props.isWarning) {
      element.classList.add("button--ghost--warning");
    }
    if (this.props.isCircle) {
      element.classList.add("button--circle");
    }
    if (this.props.underline) {
      element.classList.add("button--underline");
    }
  }

  render() {
    return `<button>{{{text}}}</button>`;
  }
}
