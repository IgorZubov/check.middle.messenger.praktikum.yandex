import Block from "@/core/Block";
import { Link } from "@/components/link";
import { Title } from "@/components/title";

interface ErrorPageProps {
  error: string;
  title: string;
  linkPage: string;
  linkText: string;
}

export class ErrorPage extends Block {
  constructor(props: ErrorPageProps) {
    super({
      ...props,
      title: new Title({ title: props.title }),
      link: new Link({
        url: props.linkPage,
        text: props.linkText,
      }),
    });
  }

  override render() {
    return `<main class="error-page">
                <span class="error-page__error">{{error}}</span>
                {{{ title }}}
                {{{ link }}}
            </main>
            `;
  }
}
