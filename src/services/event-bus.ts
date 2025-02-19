import { TCallback } from '@/types';

export class EventBus {
    listeners: Record<string, TCallback[]>;

    constructor() {
        this.listeners = {};
    }

    on(eventName: string, callback: TCallback) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }

        this.listeners[eventName].push(callback);
    }

    off(eventName: string, callback: TCallback) {
        if (!this.listeners[eventName]) {
            throw new Error(`Нет события: ${eventName}`);
        }

        this.listeners[eventName] = this.listeners[eventName].filter((handlerCb) => handlerCb !== callback);
    }

    emit(eventName: string, ...args: unknown[]) {
        if (!this.listeners[eventName]) {
            console.error(`Нет события: ${eventName}`);
            return;
        }

        this.listeners[eventName].forEach((handler) => {
            handler(...args);
        });
    }
}
