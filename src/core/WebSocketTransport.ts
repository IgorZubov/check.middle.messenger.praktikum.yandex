import EventBus from "./EventBus.ts";

export enum WebSocketEvents {
  Close = "close",
  Connect = "connected",
  Error = "error",
  Message = "message",
  Open = "open",
}

export class WebSocketTransport extends EventBus {
  private socket: WebSocket | null = null;

  private interval: number | NodeJS.Timeout = 0;

  private readonly url: string;

  constructor(url: string) {
    super();
    this.url = url;
  }

  public connect() {
    this.socket = new WebSocket(this.url);
    this.addEventListeners(this.socket);
    this.setPing();
    return new Promise<void>(resolve => {
      this.on(WebSocketEvents.Connect, () => resolve());
    });
  }

  private setPing() {
    this.interval = setInterval(() => {
      this.send({ type: "ping" });
    }, 5000);

    this.on(WebSocketEvents.Close, () => {
      clearInterval(this.interval);

      this.interval = 0;
    });
  }

  public send(data: unknown) {
    if (!this.socket) {
      throw new Error("Cоединение не установлено");
    }
    this.socket.send(JSON.stringify(data));
  }

  private addEventListeners(socket: WebSocket) {
    socket.addEventListener(WebSocketEvents.Open, () => {
      this.emit(WebSocketEvents.Connect);
    });

    socket.addEventListener(WebSocketEvents.Close, (event: CloseEvent) => {
      if (event.wasClean) {
        console.log("Соединение закрыто", event.reason);
      } else {
        console.log("Обрыв соединения");
      }
      this.emit(WebSocketEvents.Close);
    });

    socket.addEventListener(WebSocketEvents.Message, (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "pong") {
          return;
        }
        this.emit(WebSocketEvents.Message, data);
      } catch (error) {
        console.log(error);
      }
    });

    socket.addEventListener(WebSocketEvents.Error, (event: Event) => {
      console.log("Ошибка", event);
      this.emit(WebSocketEvents.Error, event);
    });
  }
}
