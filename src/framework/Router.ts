import { render } from "../utils/renderDOM.ts";
import Block from "./block.ts";
import { isEqual } from "../utils/isEqual.ts";

type BlockProps = {
  rootQuery: string;
};

class Route {
  private _pathname: string;
  private _blockClass: new () => Block;
  private _block: Block | null;
  private _props: BlockProps;

  constructor(pathname: string, view: new () => Block, props: BlockProps) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
  }

  navigate(pathname: string): void {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave(): void {
    if (this._block) {
      this._block.hide();
    }
  }

  match(pathname: string): boolean {
    return isEqual({ path: pathname }, { path: this._pathname });
  }

  render(): void {
    if (!this._block) {
      this._block = new this._blockClass();
      render(this._props.rootQuery, this._block);
      return;
    }

    this._block.show();
  }
}

export default class Router {
  private static __instance: Router;
  private routes: Route[];
  private blockedRoutes: Set<string>;
  private history: History;
  private _currentRoute: Route | null;
  private _rootQuery: string;

  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.routes = [];
    this.blockedRoutes = new Set();
    this.history = window.history;
    this._currentRoute = null;
    this._rootQuery = rootQuery;

    Router.__instance = this;
  }

  use(pathname: string, block: new () => Block): this {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery });
    this.routes.push(route);
    return this;
  }

  start(): void {
    window.onpopstate = ((event: PopStateEvent) => {
      const pathname = (event.currentTarget as Window).location.pathname;
      this._onRoute(event.currentTarget ? pathname : '/');
    }).bind(this);

    this._onRoute(window.location.pathname);
  }

  private _onRoute(pathname: string): void {
    const route = this.getRoute(pathname);

    if (this.blockedRoutes.has(pathname)) {
      this.go('/messenger');
      return;
    }

    if (!route) {
      return;
    }

    if (this._currentRoute && this._currentRoute !== route) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render();
  }

  go(pathname: string): void {
    if (this.blockedRoutes.has(pathname)) {
      // Перенаправляем на другой маршрут, если этот заблокирован
      this._onRoute('/messenger');
      return;
    }
    
    this.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  back(): void {
    this.history.back();
  }

  forward(): void {
    this.history.forward();
  }

  getRoute(pathname: string): Route | undefined {
    return this.routes.find(route => route.match(pathname));
  }

  blockRoute(pathname: string): void {
    this.blockedRoutes.add(pathname); // Добавляем путь в список заблокированных
  }

  unblockRoute(pathname: string): void {
    this.blockedRoutes.delete(pathname); // Убираем путь из списка заблокированных
  }
}
