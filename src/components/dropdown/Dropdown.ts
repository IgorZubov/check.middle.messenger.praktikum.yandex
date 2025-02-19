import { Button, DropdownOptionItem, DropdownOptionItemProps } from "..";
import Block from "@/core/Block";

interface DropdownProps {
  iconSrc: string;
  position?: string;
  options: DropdownOptionItemProps[];
  isOpen: boolean;
}

export class Dropdown extends Block {
  constructor(props: DropdownProps) {
    super({
      button: new Button({
        isCircle: true,
        isGhost: true,
        className: "dropbtn",
        text: `<img class="dropbtn__content" src=${props.iconSrc} />`,
        onClick: () => {
          this.setProps({ isOpen: !this.props.isOpen });
        },
      }),
      position: props.position || "bottom",
      isOpen: props.isOpen,
      options: props.options,
    });
  }

  init() {
    const propsOptions = this.props.options as DropdownOptionItemProps[];
    this.children.lists = propsOptions.map(
      option =>
        new DropdownOptionItem({
          text: option.text,
          iconSrc: option.iconSrc,
          onClick: () => {
            option.onClick();
            this.setProps({ isOpen: false });
          },
        }),
    );
  }

  render() {
    return `<div class="dropdown">
        {{{button}}}
        <div class="dropdown-content dropdown-content--${this.props.position ? this.props.position : "bottom"}${this.props.isOpen ? " dropdown-content--show" : ""}" >
            <div class="dropdown-content-card">
              {{#each lists}}
                {{{this}}}
              {{/each}}
            </div>
          </div>
        </div>`;
  }
}
