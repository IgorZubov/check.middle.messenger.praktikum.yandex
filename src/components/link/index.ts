import { Block } from '@/services/base-component';
import linkTemplate from './link.hbs?raw';
import './link.pcss';

export default class Link extends Block {
    render() {
        return this.compile(linkTemplate);
    }
}
