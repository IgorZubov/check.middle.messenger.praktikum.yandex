export {};

declare global {
  interface Window {
    router: Router;
    store: Store;
  }
}
