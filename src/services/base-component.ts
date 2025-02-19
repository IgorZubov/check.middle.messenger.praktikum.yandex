import { IProps, TCallback, TChildren, TEvents, TIterableObject, TMeta } from '@/types';
import Handlebars from 'handlebars';
import { v4 as uuidv4 } from 'uuid';
import { Event } from '@/types';
import { EventBus } from './event-bus';
import { isObject } from '@/types/guards';

// @ts-expect-error - unknown is ok
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Block<P extends Record<string, any> = unknown> {
    private _element: HTMLElement | null;
    private _meta: TMeta;
    private _props: IProps;
    private _children: TChildren;
    private _events: TEvents;
    private _lists: Record<string, Block[]>;
    private _id: string;
    private _eventBus: EventBus;
    private _setUpdate = false;

    // @ts-expect-error ==== {} - is default type ok
    constructor(tagName = 'div', propsAndChilds: P = {}) {
        const { props, children, lists, events } = this.getPropsAndChildren(propsAndChilds);
        this._eventBus = new EventBus();
        this._meta = {
            tagName,
            props,
        };
        this._element = null;
        this._id = uuidv4();
        this._props = this._makeProxy({ ...props, __id: this._id });
        this._children = this._makeProxy(children);
        this._lists = this._makeProxy(lists);
        this._events = events;
        this.registerEvents();
        this._eventBus.emit(Event.INIT);
    }

    public registerEvents() {
        this._eventBus.on(Event.INIT, this._init.bind(this));
        this._eventBus.on(Event.RENDER, this._render.bind(this));
        this._eventBus.on(Event.MOUNTED, this._mounted.bind(this));
        this._eventBus.on(Event.UPDATED, this._updated.bind(this));
    }

    private _init() {
        const componentProps = this.init();

        if (isObject(componentProps) && Object.keys(componentProps).length > 0) {
            this.setProps(componentProps);
        }
        this._element = this.createDocumentElement(this._meta?.tagName);
        this._eventBus.emit(Event.RENDER);
    }

    public init(): P {
        return {} as P;
    }

    public createDocumentElement(tag = 'div') {
        const $element = document.createElement(tag);

        if (this._props.settings?.withInternalId) {
            $element.setAttribute('data-id', this._id);
        }

        return $element;
    }

    public getPropsAndChildren(propsWithChilds: P) {
        const props: IProps = {};
        const children: TChildren = {};
        const lists: Record<string, Block[]> = {};
        const events: TEvents = {};

        Object.keys(propsWithChilds).forEach((key) => {
            if (propsWithChilds[key] instanceof Block) {
                children[key] = propsWithChilds[key];
            } else if (Array.isArray(propsWithChilds[key]) && propsWithChilds[key].every((child) => child instanceof Block)) {
                lists[key] = propsWithChilds[key];
            } else if (key.charAt(0) === '@') {
                events[key] = propsWithChilds[key] as TCallback;
            } else {
                props[key] = propsWithChilds[key];
            }
        });

        return { props, children, lists, events };
    }

    private _mounted() {
        this.mounted();
        Object.values(this._children).forEach((child) => child.dispatchOnMounted());
    }

    public mounted() {}

    public dispatchOnMounted() {
        this._eventBus.emit(Event.MOUNTED);

        if (Object.keys(this._children).length) {
            this._eventBus.emit(Event.RENDER);
        }
    }

    private _updated(oldProps: P, newProps: P) {
        const isRerender = this.hasUpdated(oldProps, newProps);

        if (isRerender) {
            console.log('_updated', isRerender);

            this._eventBus.emit(Event.RENDER);
        }
    }

    public hasUpdated(_: P, __: P) {
        return true;
    }

    public setProps(newProps: Partial<P>, isRerender = false) {
        if (!newProps) {
            return;
        }

        this._setUpdate = isRerender;
        const oldProps = { ...this._props };
        const { props = {}, children = {}, lists = {}, events = {} } = this.getPropsAndChildren(newProps as P);

        if (Object.values(props).length) {
            Object.assign(this._props, props);
        }

        if (Object.values(children).length) {
            Object.assign(this._children, children);
        }

        if (Object.values(lists).length) {
            Object.assign(this._lists, lists);
        }

        if (Object.values(events).length) {
            Object.assign(this._events, events);
        }

        if (this._setUpdate) {
            this._eventBus.emit(Event.UPDATED, oldProps, this._props);
            this._setUpdate = false;
        }
    }

    public addEvents() {
        Object.entries(this._events).forEach((event) => {
            const [key, cb] = event as [string, TCallback];
            const eventName = key.slice(1);
            this._events[eventName] = cb;

            if (this._element) {
                if (eventName === 'blur') {
                    this._element.addEventListener(eventName, cb, true);
                } else {
                    this._element.addEventListener(eventName, cb);
                }
            }
        });
    }

    public removeEvents() {
        Object.keys(this._events).forEach((eventName) => {
            this._element?.removeEventListener(eventName, this._events[eventName]);
        });
    }

    public addAttribute() {
        const attrs = (this._props?.attrs as object) ?? {};

        Object.entries(attrs as object).forEach(([key, value]) => {
            if (this._element) {
                this._element.setAttribute(key, value);
            }
        });
    }

    public compile(tmpl: string): DocumentFragment {
        const propsAndStubs = this._props;
        // const grandsons = [] as Block[];

        Object.entries(this._children).forEach(([key, child]) => {
            propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
        });

        Object.entries(this._lists).forEach(([key, listItem]) => {
            propsAndStubs[key] = listItem.map((child) => `<div data-id="list-id-${child._id}"></div>`);
        });

        Object.entries(this._lists).forEach(([key, listItem]) => {
            propsAndStubs[key] = listItem.map((child) => `<div data-id="list-id-${child._id}"></div>`);
        });

        // Object.keys(propsAndStubs).forEach((key) => {
        //     if (Array.isArray(propsAndStubs[key])) {
        //         propsAndStubs[key].forEach((el) => {
        //             if (el && typeof el === 'object') {
        //                 Object.keys(el).forEach((childPropKey) => {
        //                     if (Array.isArray(el[childPropKey]) && el[childPropKey].every((child) => child instanceof Block)) {
        //                         el[childPropKey] = el[childPropKey].map((grandson) => {
        //                             grandsons.push(grandson);

        //                             return `<div data-id="list-grand-id-${grandson._id}"></div>`;
        //                         });
        //                     }
        //                 });
        //             }
        //         });
        //     }
        // });

        const fragment = this.createDocumentElement('template') as HTMLTemplateElement;
        fragment.innerHTML = Handlebars.compile(tmpl)(propsAndStubs);

        Object.values(this._children).forEach((child) => {
            const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
            stub?.replaceWith(child.getContent() || '');
        });

        Object.values(this._lists).forEach((list) => {
            list.forEach((listChild) => {
                const stub = fragment.content.querySelector(`[data-id="list-id-${listChild._id}"]`);
                stub?.replaceWith(listChild.getContent() || '');
            });
        });

        // grandsons.forEach((grs) => {
        //     const stub = fragment.content.querySelector(`[data-id="list-grand-id-${grs._id}"]`);
        //     stub?.replaceWith(grs.getContent() || '');
        // });

        return fragment.content;
    }

    private _render() {
        const $block = this.render();

        this.removeEvents();

        if (this._element) {
            this._element.innerHTML = '';
            if ($block) {
                if (this._props?.settings?.isSimple) {
                    this._element = $block.firstElementChild as HTMLElement;
                } else {
                    this._element.append($block);
                }
            }
        }

        this.addAttribute();
        this.addEvents();
    }

    public render(): DocumentFragment | undefined {
        return;
    }

    private _makeProxy<T extends TIterableObject>(props: T) {
        const proxyOptions = {
            get(target: T, prop: string): unknown {
                const value = target[prop];
                return typeof value === 'function' ? value.bind(target) : value;
            },
            set: (target: T, prop: string, value: unknown): boolean => {
                if (prop.startsWith('_')) {
                    throw new Error('Нет прав');
                } else {
                    if (target[prop] !== value) {
                        // @ts-expect-error ругается на T
                        target[prop] = value;
                        this._setUpdate = true;
                    }

                    return true;
                }
            },
            deleteProperty(target: T, prop: string): boolean {
                if (prop.startsWith('_')) {
                    throw new Error('Нет прав');
                } else {
                    delete target[prop];
                    return true;
                }
            },
        };

        return new Proxy(props, proxyOptions);
    }

    public getContent() {
        return this._element;
    }

    public getProps(): P {
        return this._props as P;
    }

    public getChildren() {
        return this._children;
    }

    public hide() {
        const componentHtml = this.getContent();
        if (!componentHtml) {
            return;
        }
        componentHtml.style.display = 'none';
    }

    public show() {
        const componentHtml = this.getContent();
        if (!componentHtml) {
            return;
        }
        componentHtml.style.display = 'block';
    }
}
