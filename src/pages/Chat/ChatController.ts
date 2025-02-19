import { WS_URL } from "../../api/url-api";
import WS from "../../api/WebSocket";
import { ChatItem } from "../../components/ChatItem";
import { ChatList } from "../../components/ChatList";
import { Message } from "../../components/Message";
import { WS_EVENTS } from "../../enum";
import { selectors } from "../../framework/selectors";
import store, { IChat } from "../../framework/store";
import settingsAPI from "../Settings/settingsAPI";
import ChatAPI from "./ChatAPI";

class ChatController {
  private chatAPI = ChatAPI;
  private socket?: WS;
  public chats: IChat[];

  public async connectToChat(userId: number, chatId: number): Promise<void> {
    const tokenResponse = await ChatAPI.getToken(chatId);
    const { token } = typeof tokenResponse.response === 'string' 
      ? JSON.parse(tokenResponse.response) 
      : null;

    if (!token) {
      throw new Error('Не удалось получить токен для чата');
    }
    const url = `${WS_URL}${userId}/${chatId}/${token}`;
    
    
    this.socket = new WS(url);
    await this.socket.connect();
    

    this.socket.on(WS_EVENTS.Message, (data) => {
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

      if (Array.isArray(parsedData)) {
        selectors.setMessages(parsedData);
        console.log('Old messages are received', parsedData);
      } else {
        selectors.addMessage(parsedData);
        console.log('New message is received', parsedData);
      }
    });

    this.socket.on(WS_EVENTS.Close, (event) => {
      console.log('Connection is closed', event);
    });

    this.socket.on(WS_EVENTS.Error, (event) => {
      console.log('Error connection', event);
    });

    this.getOldMessages();
  }

  public getOldMessages(offset: number = 0): void {
    if (!this.socket) {
      throw new Error('Socket is not connected');
    }

    this.socket.send({ content: offset.toString(), type: 'get old' });
  }

  public async getChats(chatList: ChatList): Promise<void> {
    try {
      const data: IChat[] = await this.chatAPI
        .getChats()
        .then((res) => {
          const data = JSON.parse(res.response);

          data.forEach((elem: IChat) => {
            const chatItem = new ChatItem({
              id: elem.id,
              isRead: true,
              online: true,
              activeChat: false,
              interlocutorName: elem.title,
              messages: [],
              setActiveChatById: chatList.setActiveChatById.bind(chatList),
            });
            chatList.addChat(chatItem);
          });

          return data;
        });

      store.setState({
        chatsData: {
          activeChatId: null,
          chats: data
        },
      });
    } catch (err) {
      console.error("Ошибка при получении данных:", err);
    }
  }

  public async getUser(): Promise<any> {
    try {
      const data = await settingsAPI
        .getUser()
        .then((res) => JSON.parse(res.response))
      
      store.setState({
        user: data,
        greetings: `Hello, ${data.first_name}!`,
      });
    } catch (err) {
      throw new Error('При получении пользователя произошла ошибка: ');
    }
  }

  public async createChat(titleChat: {}): Promise<any> {    
    try {
      await this.chatAPI
        .createChat(titleChat)
        .then((res) => console.log('Чат успешно создан! ', res));
    } catch (err) {
      throw new Error('Что-то пошло не так при создании чата.')
    }
  }

  public createMessage(content: string, idMessage?: number): any {
    return new Message({
      id: idMessage ? idMessage : Date.now(),
      message: content,
      author: 'Me'
    });
  }

  public sendMessage(content: string): void {
    if (!this.socket) {
      throw new Error('Socket is not connected');
    }
  
    if (!content.trim()) {
      throw new Error('Message content cannot be empty');
    }
  
    const message = {
      content,
      type: 'message',
    };
  
    this.socket.send(message);
    const newMsg = this.createMessage(content);
    const currentMessages = store.getState().messages || [];
    store.setState({
      messages: {...currentMessages, newMsg}
    });
    console.log('Message sent:', message);
  }

  // public deleteUser(userId: number) {}
}

export default new ChatController();
