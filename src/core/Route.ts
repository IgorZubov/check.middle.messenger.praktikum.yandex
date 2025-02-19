import Block, { BlockProps } from "./Block.ts";

export class Route {
  private _pathname: string;

  private readonly _blockClass: typeof Block;

  private _block: null | Block;

  private _props: {
    rootQuery: string;
    defaultProps: BlockProps;
  };

  constructor(pathname: string, view: typeof Block, props: { rootQuery: string; defaultProps: BlockProps }) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
  }

  navigate(pathname: string) {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave() {
    if (this._block) {
      this._block.hide();
    }
  }

  match(pathname: string) {
    return pathname === this._pathname;
  }

  _renderDom(query: string, block: Block): void {
    const root = document.querySelector(query) as HTMLElement | null;
    if (root) {
      root.innerHTML = ``;
      root.appendChild(block.getContent()!);
    }
    block.dispatchComponentDidMount();
  }

  render() {
    if (!this._block) {
      this._block = new this._blockClass(this._props.defaultProps);
      // this._block = new this._blockClass({});
      this._renderDom(this._props.rootQuery, this._block as Block);
      return;
    }

    this._block.show(this._props.rootQuery, this._renderDom);
  }
}
