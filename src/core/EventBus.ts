type Listener<T = unknown> = (...args: T[]) => void;

interface Listeners {
  [event: string]: Listener[];
}

export default class EventBus {
  private listeners: Listeners;

  constructor() {
    this.listeners = {};
  }

  private hasEvent(event: string): boolean {
    return !!this.listeners[event];
  }

  private checkEvent(event: string): void {
    if (!this.hasEvent(event)) {
      throw new Error(`Нет события: ${event}`);
    }
  }

  on(event: string, callback: Listener): void {
    if (!this.hasEvent(event)) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
  }

  off(event: string, callback: Listener): void {
    this.checkEvent(event);
    const filteredListeners = this.listeners[event].filter(listener => listener !== callback);
    this.listeners[event] = filteredListeners;
  }

  emit(event: string, ...args: unknown[]): void {
    // this.checkEvent(event);
    this.listeners[event]?.forEach(listener => {
      listener(...args);
    });
  }
}
