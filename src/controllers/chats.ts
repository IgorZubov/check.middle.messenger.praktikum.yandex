import { ChatModel, ChatUserModel } from "@/types/models/Chat";
import chatsAPI from "@/api/chats-api.ts";
import store from "@/core/Store.ts";
import { MessagesController } from "./messages.ts";

export class ChatsController {
  static async create(title: string) {
    try {
      await chatsAPI.createChat(title);
      await this.getChatsList();
    } catch (error) {
      console.log(error, "chat create error");
    }
  }

  static async getChatsList(title?: string) {
    try {
      const chats: ChatModel[] = (await chatsAPI.getChats({ limit: 20, title: title || "" })) as ChatModel[];
      chats.map(async (chat: ChatModel) => {
        const { token } = (await this.getToken(chat.id)) as { token: string };
        await MessagesController.connect(chat.id, token);
      });
      store.set("chats", chats);
    } catch (error) {
      console.log(error, "get chats list error");
    }
  }

  static async addUserToChat(chatId: number, userId: number[]) {
    try {
      await chatsAPI.addUsers(userId, chatId);
      await this.getChatsList();
    } catch (error) {
      console.log(error, "add user to chat error");
    }
  }

  static async deleteUserFromChat(chatId: number, userId: number[]) {
    try {
      await chatsAPI.deleteUsers(userId, chatId);
      await this.getChatsList();
    } catch (error) {
      console.log(error, "delete user from chat error");
    }
  }

  static async selectChat(chatId: number) {
    const target = store.getState().chats?.find(chat => chat.id === chatId);
    store.set("selectedChat", target);
    store.set("currentMessages", null);

    this.fetchChatUsers(chatId);
  }

  static async fetchChatUsers(chatId: number) {
    try {
      const chatMembers: ChatUserModel[] = (await chatsAPI.getChatUsers(chatId)) as ChatUserModel[];
      const nonAdminMembers = chatMembers.filter(user => user.role !== "admin");
      store.set("selectedChat", {
        ...store.getState().selectedChat?.[0],
        members: nonAdminMembers,
      });
    } catch (error) {
      console.log(error, "get chat users error");
    }
  }

  static async deleteChat(chatId: number) {
    try {
      await chatsAPI.delete(chatId);
      store.set("selectedChat", undefined);
      await this.getChatsList();
    } catch (error) {
      console.log(error, "delete the chat error");
    }
  }

  static async editChatAvatar(data: FormData) {
    try {
      const response = await chatsAPI.changeChatAvatar(data);
      const { avatar, id } = response as { avatar: string; id: string | number };
      const { chats, selectedChat } = store.getState();

      const updatedChats = chats?.map(chat =>
        chat.id !== id
          ? chat
          : {
              ...chat,
              avatar,
            },
      );
      if (updatedChats) {
        store.set("chats", updatedChats);
      }
      store.set("selectedChat", {
        ...selectedChat?.[0],
        avatar,
      });
    } catch (error) {
      console.log(error, "ошибка при попытке изменения аватара");
    }
  }

  static async getToken(chatId: number) {
    return chatsAPI.getToken(chatId);
  }
}
