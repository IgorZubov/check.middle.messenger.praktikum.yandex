import { Block } from '@/services/base-component';
import avatarMiniTemplate from './avatar-mini.hbs?raw';
import './avatar-mini.pcss';

export default class AvatarMini extends Block {
    render() {
        return this.compile(avatarMiniTemplate);
    }
}
