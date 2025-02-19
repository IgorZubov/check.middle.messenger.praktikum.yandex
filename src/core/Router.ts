import { Routes } from "@/types/index.ts";
import Block, { BlockProps } from "./Block.ts";
import { Route } from "./Route.ts";

export class Router {
  private readonly routes: Route[] = [];

  private static _instance: Router | null = null;

  private readonly _rootQuery: string = "";

  private _currentRoute: null | Route = null;

  private history = window.history;

  constructor(rootQuery: string) {
    this.routes = [];
    this.history = window.history;
    this._currentRoute = null;
    this._rootQuery = rootQuery;
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new Router("#app");
    }
    return this._instance;
  }

  static destroy() {
    this._instance = null;
  }

  public use(pathname: string, block: typeof Block, props: BlockProps) {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery, defaultProps: props });
    this.routes.push(route);
    return this;
  }

  start() {
    window.onpopstate = (event: PopStateEvent) => {
      const currentTarget = event.currentTarget as Window;
      this._onRoute(currentTarget.location.pathname);
    };
    this._onRoute(window.location.pathname);
  }

  private _onRoute(pathname: string) {
    const route = this.getRoute(pathname);
    if (!route) {
      Router.getInstance().go(Routes.NotFound);
    }

    if (this._currentRoute) {
      this._currentRoute.leave();
    }
    this._currentRoute = route;
    route.render();
  }

  go(pathname: string) {
    this.history.pushState({}, "", pathname);
    this._onRoute(pathname);
  }

  back() {
    this.history.back();
  }

  forward() {
    this.history.forward();
  }

  getRoute(pathname: string): Route {
    return this.routes.find(route => route.match(pathname))!;
  }
}
