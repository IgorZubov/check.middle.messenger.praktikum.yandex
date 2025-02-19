import Block from "@/core/Block";

interface ErrorLineProps {
  error: string;
}

export class ErrorLine extends Block {
  constructor(props: ErrorLineProps) {
    super({
      ...props,
      error: props.error,
    });
  }

  protected componentDidUpdate(): boolean {
    this.setProps({ error: this.props.error || "" });
    return true;
  }

  render() {
    return `
      <div class="input__error">{{{error}}}</div>
    `;
  }
}
