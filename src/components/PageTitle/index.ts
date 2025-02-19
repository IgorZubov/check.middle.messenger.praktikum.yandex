import { Block } from '@/services/base-component';
import pateTitleTemplate from './page-title.hbs?raw';
import './page-title.pcss';

export default class PageTitle extends Block {
    render() {
        return this.compile(pateTitleTemplate);
    }
}
