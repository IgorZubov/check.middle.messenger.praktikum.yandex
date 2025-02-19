import { Block } from '@/services/base-component';
import bubbleTemplate from './bubble.hbs?raw';
import { IProps } from '@/types';

import './bubble.pcss';

export interface IBubbleProps extends IProps {
    class?: string;
    text: string;
}
export default class Bubble extends Block<IBubbleProps> {
    constructor(props: IBubbleProps) {
        super('div', {
            settings: {
                isSimple: true,
            },
            ...props,
        });
    }

    render() {
        return this.compile(bubbleTemplate);
    }
}
