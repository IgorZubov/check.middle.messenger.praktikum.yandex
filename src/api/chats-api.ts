import { BaseAPI } from "./base-api.ts";

class ChatsAPI extends BaseAPI {
  constructor() {
    super("/chats");
  }

  createChat(title: string) {
    return this.http.post("/", {
      data: {
        title,
      },
    });
  }

  getChats(data: { limit: number; title?: string }) {
    return this.http.get("/", { data });
  }

  addUsers(users: number[], chatId: number) {
    return this.http.put("/users", {
      data: {
        users,
        chatId,
      },
    });
  }

  deleteUsers(users: number[], chatId: number) {
    return this.http.delete("/users", {
      data: {
        users,
        chatId,
      },
    });
  }

  getChatUsers(chatId: number) {
    return this.http.get(`/${chatId}/users`);
  }

  delete(chatId: number) {
    return this.http.delete("/", {
      data: {
        chatId,
      },
    });
  }

  changeChatAvatar(data: FormData) {
    return this.http.put("/avatar", { data });
  }

  getToken(chatId: number) {
    return this.http.post(`/token/${chatId}`);
  }
}

export default new ChatsAPI();
