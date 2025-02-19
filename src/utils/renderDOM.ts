import { Nullable } from "../types/Nullable.t";
import Block from "../framework/block";

export function render(idElement: string, block: Block) {
  const root: Nullable<HTMLElement> = document.getElementById(idElement);

  if (root instanceof HTMLElement) {
    root.appendChild(block.getContent());
    block.dispatchComponentDidMount();

    return root;
  } else {
    throw new Error(`Элемент по id "${idElement}" не был найден.`)
  }
}
