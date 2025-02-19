import Block from "@/core/Block";
import { Button } from "../button";

interface ModalProps {
  id: string | number;
  title: string;
  btnText: string;
  children: Block;
  isShow: boolean;
}

export class Modal extends Block {
  constructor(props: ModalProps) {
    super({
      id: props.id,
      title: props.title,
      isShow: props.isShow,
      children: props.children,
    });
  }

  init() {
    this.children.closeBtn = new Button({
      className: "modal__btn-close",
      isCircle: true,
      isGhost: true,
      type: "submit",
      text: '<img src="/icons/circle-cross.svg" alt=""><img>',
      onClick: () => {
        this.setProps({ isShow: false });
      },
    });
  }

  render() {
    return `<div class="modal${this.props.isShow ? " modal--show" : ""}" id={{id}}>
      <div class="modal__content">
          <h3 class="modal__content__title">{{title}}</h3>
          {{{closeBtn}}}
        {{{children}}}
      </div>
    </div>`;
  }
}
