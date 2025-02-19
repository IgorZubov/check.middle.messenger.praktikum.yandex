import { IChatDTO } from '@/api/chats/chats.model';
import AvatarMini from '@/components/AvatarMini';
import { ERouter } from '@/constants/router';
import { firstCharUpper } from '@/utils';
import { Chat } from '../modules';
import { formatChatsDate } from '@/utils/date';

export const useAsideChats = () => {
    const initChatProps = (chat: IChatDTO) => {
        return {
            attrs: {
                id: chat.id,
                class: 'aside-chats__chat chat',
            },
            settings: {
                isSimple: true,
            },
            avatarMini: new AvatarMini('div', {
                class: 'chat__avatar',
                settings: {
                    isSimple: true,
                },
                avatarSrc: chat.avatar,
                userNameChar: firstCharUpper(chat.last_message?.user.first_name || chat.title),
            }),
            link: `${ERouter.MESSENGER}/${chat.id}`,
            chat,
            time: formatChatsDate(chat.last_message?.time),
        };
    };

    const adapterChatsPropsToChatsComponent = (chats: IChatDTO[]): Chat[] => {
        return chats.map((chat) => new Chat(initChatProps(chat)));
    };

    return {
        initChatProps,
        adapterChatsPropsToChatsComponent,
    };
};
