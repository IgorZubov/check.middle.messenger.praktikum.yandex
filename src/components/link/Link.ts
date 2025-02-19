import Block from "@/core/Block";

interface LinkProps {
  text: string;
  className?: string;
  secondary?: string;
  url: string;
}

export class Link extends Block {
  constructor(props: LinkProps) {
    super({
      ...props,
      text: props.text,
      attr: {
        class: `link ${props.className || ""}${props.secondary ? " link--secondary" : ""}`,
        href: props.url,
      },
    });
  }

  render() {
    return `<a>{{ text }}</a>`;
  }
}
