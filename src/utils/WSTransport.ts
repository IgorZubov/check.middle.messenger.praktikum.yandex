import EventBus from "../framework/eventBus";
import { WS_TransportEvents } from "../enum";

export class WSTransport extends EventBus {
  private socket?: WebSocket;
  private pingInterval: ReturnType<typeof setInterval> | undefined;
  private readonly pingIntervalTime: number = 30000;
  private url: string;

  constructor(url: string) {
    super();
    this.url = url;
  }

  public send(data: string | number | object): void {
    if (!this.socket) {
      throw new Error("WebSocket is not connected");
    }

    this.socket.send(JSON.stringify(data));
  }

  public connect(): Promise<void> {
    if (!this.socket) {
      throw new Error("WebSocket is already connected");
    }

    this.socket = new WebSocket(this.url);
    this.subscribe(this.socket);
    this.setupPing();

    return new Promise((resolve, reject) => {
      this.on(WS_TransportEvents.Error, reject);
      this.on(WS_TransportEvents.Connected, () => {
        this.off(WS_TransportEvents.Error, reject);
        resolve();
      });
    });
  }

  public close(): void {
    this.socket?.close();
    clearInterval(this.pingInterval);
  }

  private setupPing(): void {
    this.pingInterval = setInterval(() => {
      this.send({ type: "ping" });
    }, this.pingIntervalTime);

    this.on(WS_TransportEvents.Close, () => {
      clearInterval(this.pingInterval);
      this.pingInterval = undefined
    })
  }

  private subscribe(socket: WebSocket): void {
    socket.addEventListener('open', () => {
      this.emit(WS_TransportEvents.Connected)
    });

    socket.addEventListener('close', () => {
      this.emit(WS_TransportEvents.Close)
    });

    socket.addEventListener('error', () => {
      this.emit(WS_TransportEvents.Error)
    });

    socket.addEventListener('message', (message) => {
      try {
        const data = JSON.parse(message.data);
        if (['pong', 'user connected'].includes(data?.type)) {
          return;
        }
        this.emit(WS_TransportEvents.Message, data)
      } catch (e) {}
    });
  }
}
