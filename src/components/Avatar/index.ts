import { Block } from '@/services/base-component';
import avatarTemplate from './avatar.hbs?raw';

import './avatar.pcss';

export interface IAvatarProps {
    class: string;
    imageSrc: string;
}
export default class Avatar extends Block {
    constructor(props: IAvatarProps) {
        super('div', {
            settings: {
                isSimple: true,
            },
            ...props,
        });
    }

    hasUpdated() {
        return true;
    }

    render() {
        return this.compile(avatarTemplate);
    }
}
