import { Block } from '@/services/base-component';
import HeaderTemplate from './header.hbs?raw';
import './header.pcss';

export default class Header extends Block {
    render() {
        return this.compile(HeaderTemplate);
    }
}
