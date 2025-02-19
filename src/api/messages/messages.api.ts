import { WSTransport } from '@/services/wsTransport';
import { BASE_WSS_URL } from '@/constants';

class MessagesAPI {
    private _baseWSSURL: string;

    wssTransport: WSTransport | null = null;

    constructor() {
        this._baseWSSURL = BASE_WSS_URL;
    }

    // Create WSS transport
    async getWSSTransport(userId: number, chatID: number, token: string | null): Promise<void> {
        if (!token) {
            this.disconnectFromChat();
            return;
        }

        try {
            this.wssTransport = new WSTransport(`${this._baseWSSURL}/${userId}/${chatID}/${token}`);
        } catch (error) {
            console.log(error);
        }
    }

    async connectToChat(): Promise<void> {
        try {
            if (this.wssTransport) {
                await this.wssTransport.connect();
            }
        } catch (error) {
            console.log(error);
        }
    }

    async sendMessage(message: string): Promise<void> {
        try {
            if (this.wssTransport) {
                this.wssTransport.send({ content: message, type: 'message' });
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getMessages(message: string = '0'): Promise<void> {
        try {
            if (this.wssTransport) {
                this.wssTransport.send({ content: message, type: 'get old' });
            }
        } catch (error) {
            console.log(error);
        }
    }

    async disconnectFromChat(): Promise<void> {
        try {
            if (this.wssTransport) {
                this.wssTransport.close();
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export default MessagesAPI;
