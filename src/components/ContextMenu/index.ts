import { Block } from '@/services/base-component';
import contextMenuTemplate from './context-menu.hbs?raw';
import { IProps } from '@/types';
import Button from '../Button';

import './context-menu.pcss';

type TContextMenuPosition = 'top' | 'bottom' | 'left' | 'right';

interface IContextMenuProps extends IProps {
    Activator: Button;
    isShowMenu: boolean;
    position: TContextMenuPosition[];
    menuList: Button[];
    contentClass?: string;
}

export default class ContextMenu extends Block<IContextMenuProps> {
    constructor(props: IContextMenuProps) {
        super('div', {
            settings: {
                isSimple: true,
            },
            ...props,
        });

        this._initClickEvent();
    }

    private _initClickEvent() {
        window.addEventListener('click', this._onClickWindow.bind(this));
    }

    private _onClickWindow(evt: MouseEvent) {
        const target = evt.target as HTMLElement | null;
        const isClickOnContextMenu = target?.closest('.menu');
        const isClickActivatorBtn = target && target.getAttribute('id') !== 'activator-btn';

        if (!isClickActivatorBtn || !isClickOnContextMenu) {
            this.hide();
        }
    }

    show() {
        const $contextMenu = this.getContent()?.querySelector('.menu__content');
        const position = (this.getProps()?.position ?? []) as TContextMenuPosition[];

        $contextMenu?.classList.add(...position, 'show');
    }

    hide() {
        const $contextMenu = this.getContent()?.querySelector('.menu__content');
        if ($contextMenu) {
            $contextMenu.className = 'menu__content';
        }
    }

    render() {
        return this.compile(contextMenuTemplate);
    }
}
