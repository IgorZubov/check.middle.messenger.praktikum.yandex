import Block from "@/core/Block";

interface TitleProps {
  title: string;
}

export class Title extends Block {
  constructor(props: TitleProps) {
    super({
      ...props,
      title: props.title,
    });
  }

  render() {
    return `<h1 class="page-title">
        {{title}}
      </h1>`;
  }
}
