import { BaseAPI } from "../../api/base-api";
import { ApiResponse } from "../../interfaces";

class ChatAPI extends BaseAPI {
  constructor(){
    super('/chats');
  }

  public async getChats(): Promise<any> {
    return this.get('');
  }

  public async createChat(data: {}): Promise<any> {
    return await this.post('', { data });
  }

  public async deleteChat(data: {}): Promise<any> {
    return await this.delete('', { data });
  }

  public async getToken(chatId: {}): Promise<ApiResponse> {
    return await this.post(`/token/${chatId}`);
  }

  public addUserToChat(chatId: number, userId: number): Promise<ApiResponse> {
    return this.put('/users', { data: { users: [userId], chatId: chatId } });
  }

  public async deleteUserFromChat(chatId: number, userId: number): Promise<ApiResponse> {
    return this.delete('/users', { data: { users: [userId], chatId: chatId } })
  }
}

export default new ChatAPI();
