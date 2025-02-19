import defaultLayoutTemplate from './default.hbs?raw';
import { Block } from '@/services/base-component';
import './default-layout.pcss';

export default class LayoutDefault extends Block {
    render() {
        return this.compile(defaultLayoutTemplate);
    }
}
