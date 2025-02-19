import EventBus from '../framework/eventBus';
import { WS_EVENTS, ERRORS_MESSAGES } from '../enum';

export default class WS extends EventBus {
  private static __instance: WS;

  private url: string;

  private socket?: WebSocket;

  private readonly pingInterval = 30000;

  private ping?: ReturnType<typeof setInterval>;

  constructor(url: string) {
    super();
    this.url = url;
  }

  public static getInstance(url: string): WS {
    if (!this.__instance) {
      this.__instance = new WS(url);
    }
    return this.__instance;
  }

  public connect(): Promise<void> {
    if (this.socket) {
      throw new Error(ERRORS_MESSAGES.WS_ALREADY_CONNECTED);
    }

    this.socket = new WebSocket(this.url);

    this.subscribe(this.socket);
    this.setupPing();

    return new Promise((resolve, reject) => {
      this.on(WS_EVENTS.Error, reject);
      this.on(WS_EVENTS.Open, () => {
        this.off(WS_EVENTS.Error, reject);
        resolve();
      });
    });
  }

  public close(): void {
    if (!this.socket) {
      return;
    }

    this.socket.close();
    clearInterval(this.ping);
    this.ping = undefined;
  }

  private setupPing(): void {
    this.ping = setInterval(() => {
      this.send({ type: 'ping' });
    }, this.pingInterval);

    this.on(WS_EVENTS.Close, () => {
      clearInterval(this.ping);
      this.ping = undefined;
    });
  }

  private subscribe(socket: WebSocket): void {
    socket.addEventListener('open', () => {
      this.emit(WS_EVENTS.Open);
    });

    socket.addEventListener('close', () => {
      this.emit(WS_EVENTS.Close);
    });

    socket.addEventListener('error', (event) => {
      this.emit(WS_EVENTS.Error, event);
    });

    socket.addEventListener('message', (message) => {
      try {
        const data = JSON.parse(message.data);
        if (Array.isArray(data)) {
          this.emit(WS_EVENTS.Message, data);
        } else if (!['pong', 'user connected'].includes(data?.type)) {
          this.emit(WS_EVENTS.Message, data);
        }
      } catch (error) {
        console.warn("Получено сообщение, не являющееся JSON:", message.data);
      }
    });
  }

  public send(data: string | number | object): void {
    if (!this.socket) {
      throw new Error(ERRORS_MESSAGES.WS_NOT_CONNECTED);
    }

    this.socket.send(JSON.stringify(data));
  }
}
