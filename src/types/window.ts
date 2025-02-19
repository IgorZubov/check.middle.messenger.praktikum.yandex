import Router from '@/services/Router';
import Store from '@/services/Store';

declare global {
    interface Window {
        router: Router;
        store: Store;
    }
}

window.router = window.router || {};
