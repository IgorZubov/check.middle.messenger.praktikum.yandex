import Block from "@/core/Block";

interface LabelProps {
  title: string;
  inputId: string;
  className?: string;
}

export class Label extends Block {
  constructor(props: LabelProps) {
    super({
      ...props,
      attr: {
        class: "label" + (props.className || ""),
        for: props.inputId,
      },
    });
  }

  protected componentDidUpdate(): boolean {
    this.setProps({ title: this.props.title || "" });
    return true;
  }

  render() {
    return `<label>{{{ title }}}</label>`;
  }
}
