import compiler from '../utils/compiler.ts';
import EventBus, { EventCallback } from './eventBus.ts';
import { v4 as makeUUID } from 'uuid';

export interface BlockProps {
  [key: string]: any;
}

export default class Block {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  };

  private _parentElement: HTMLElement | null = null;
  private _nextSibling: Node | null = null;

  protected _element: HTMLElement | null = null;

  protected _id: string = makeUUID();

  protected props: BlockProps;

  protected children: Record<string, Block>;

  protected lists: Record<string, any[]>;

  protected eventBus: () => EventBus;

  protected _eventHandlers: Record<string, (e: Event) => void> = {};

  constructor(propsWithChildren: BlockProps = {}) {
    const eventBus = new EventBus();
    const { props, children, lists } = this._getChildrenPropsAndProps(propsWithChildren);
    this.props = this._makePropsProxy({ ...props });
    this.children = children;
    this.lists = this._makePropsProxy({ ...lists });;
    this.eventBus = () => eventBus;
    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  private _addEvents(): void {
    const { events } = this.props;
    this._removeEvents();
    if (events) {
      Object.keys(events).forEach(eventName => {
        const handler = events[eventName];
        if (this._element) {
          this._element.addEventListener(eventName, events[eventName]);
          this._eventHandlers[eventName] = handler;
        }
      });
    }
  }

  private _removeEvents(): void {
    if (this._element && this._eventHandlers) {
      Object.keys(this._eventHandlers).forEach(eventName => {
        const handler = this._eventHandlers[eventName];
        if (handler) {
          this._element?.removeEventListener(eventName, handler);
          delete this._eventHandlers[eventName];
        }
      });
    }
  }

  private _registerEvents(eventBus: EventBus): void {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this) as EventCallback);
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this) as EventCallback);
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this) as EventCallback);
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this) as EventCallback);
  }

  protected init(): void {
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  private _componentDidMount(): void {
    this.componentDidMount();
    Object.values(this.children).forEach((child: Block) => { child.dispatchComponentDidMount() });
  }

  protected componentDidMount(): void {}

  public dispatchComponentDidMount(): void {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate(oldProps: BlockProps, newProps: BlockProps): void {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render();
  }

  protected componentDidUpdate(oldProps: BlockProps, newProps: BlockProps): boolean {
    return JSON.stringify(oldProps) !== JSON.stringify(newProps);
  }
  private _getChildrenPropsAndProps(propsAndChildren: BlockProps): {
    children: Record<string, Block>,
    props: BlockProps,
    lists: Record<string, any[]>
  } {
    const children: Record<string, Block> = {};
    const props: BlockProps = {};
    const lists: Record<string, any[]> = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value;
      } else if (Array.isArray(value)) {
        lists[key] = value;
      } else {
        props[key] = value;
      }
    });

    return { children, props, lists };
  }

  protected addAttributes(): void {
    const { attr = {} } = this.props;

    Object.entries(attr).forEach(([key, value]) => {
      if (this._element) {
        this._element.setAttribute(key, value as string);
      }
    });
  }

  public setProps = (nextProps: BlockProps): void => {
    if (!nextProps) {
      return;
    }

    Object.assign(this.props, nextProps);
  };

  public setLists = (nextProps: any): void => {
    if (!nextProps) {
      return;
    }

    Object.assign(this.lists, nextProps);
  };

  get element(): HTMLElement | null {
    return this._element;
  }
  private _render(): void {
    // console.log('Render');
    this._removeEvents();

    const propsAndStubs = { ...this.props };
    const _tmpId = makeUUID();

    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
    });

    Object.entries(this.lists).forEach(([key]) => {
      propsAndStubs[key] = `<div data-id="__l_${_tmpId}"></div>`;
    });

    const fragment = this._createDocumentElement('template');
    fragment.innerHTML = compiler(this.render(), propsAndStubs);

    Object.values(this.children).forEach(child => {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
      if (stub) {
        // console.log(stub);

        stub.replaceWith(child.getContent());
      }
    });

    Object.entries(this.lists).forEach(([, child]) => {
      const listCont = this._createDocumentElement('template');
      child.forEach(item => {
        if (item instanceof Block) {
          listCont.content.append(item.getContent());
        } else {
          listCont.content.append(`${item}`);
        }
      });
      const stub = fragment.content.querySelector(`[data-id="__l_${_tmpId}"]`);
      if (stub) {
        stub.replaceWith(listCont.content);
      }
    });

    const newElement = fragment.content.firstElementChild as HTMLElement;
    if (this._element && newElement) {
      this._element.replaceWith(newElement);
    }
    this._element = newElement;

    this._addEvents();
    this.addAttributes();
  }

  protected render(): string {
    return '';
  }

  public getContent(): HTMLElement {
    if (!this._element) {
      throw new Error('Element is not created');
    }
    return this._element;
  }
  private _makePropsProxy(props: BlockProps): BlockProps {
    const self = this;

    return new Proxy(props, {
      get(target: BlockProps, prop: string) {
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target: BlockProps, prop: string, value: any) {
        const oldTarget = { ...target };
        target[prop] = value;
        self.eventBus().emit(Block.EVENTS.FLOW_CDU, oldTarget, target);
        return true;
      },
      deleteProperty() {
        throw new Error('No access');
      },
    });
  }

  private _createDocumentElement(tagName: string): HTMLTemplateElement {
    return document.createElement(tagName) as HTMLTemplateElement;
  }

  // Метод для показа и добавления элемента в DOM
  public show(): void {
    if (!this._element) {
      throw new Error('Element was not found or created');
    }

    if (this._parentElement) {
      this._parentElement.insertBefore(this._element, this._nextSibling);
      this._parentElement = null;
      this._nextSibling = null;
    }
  }

  public hide(): void {
    if (!this._element) {
      throw new Error('Element is not created');
    }

    this._parentElement = this._element.parentElement;
    this._nextSibling = this._element.nextSibling;

    if (this._parentElement) {
      this._parentElement.removeChild(this._element);
    }
  }
}
