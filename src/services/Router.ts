import Route from './Route';
import { Block } from './base-component';
import { IRouter, IRoute } from '@/types/router';
import { isWindow } from '@/types';
import { ERouter } from '@/constants/router';

export default class Router implements IRouter {
    static __instance: Router | null = null;
    private _rootQuery = '';
    private _currentRoute: IRoute | null = null;
    public routes: IRoute[] = [];
    public history: History = window.history;

    constructor(rootQuery: string) {
        if (Router.__instance) {
            return Router.__instance;
        }

        this._rootQuery = rootQuery;
        Router.__instance = this;
    }

    use(path: string, block: typeof Block) {
        const route = new Route(path, block, { rootQuery: this._rootQuery });
        this.routes.push(route);
        return this;
    }

    start() {
        window.onpopstate = ((event: Event) => {
            if (isWindow(event.currentTarget)) {
                this._onRoute(event.currentTarget.location.pathname);
            }
        }).bind(this);
        this._onRoute(window.location.pathname);
    }

    private _onRoute(pathName: string, isChild: boolean = false) {
        const { authUser } = window.store.getState();
        let route = this.getRoute(pathName, isChild);

        if (!route) {
            const routesLength = this.routes.length;
            route = this.routes[routesLength - 1];

            return;
        }

        if ([ERouter.MESSENGER, ERouter.SETTINGS, ERouter.PROFILE_EDIT].includes(pathName as ERouter) && !authUser) {
            this.history.pushState({}, '', ERouter.LOGIN);
            route = this.getRoute(ERouter.LOGIN);
        } else if ([ERouter.LOGIN, ERouter.REGISTRATION].includes(pathName as ERouter) && authUser) {
            this.history.pushState({}, '', ERouter.MESSENGER);
            route = this.getRoute(ERouter.MESSENGER);
        }

        if (!!this._currentRoute && this._currentRoute !== route) {
            this._currentRoute.leave();
        }

        this._currentRoute = route;
        route.render();
    }

    go(pathName: string, isChild: boolean = false) {
        this.history.pushState({}, '', pathName);
        this._onRoute(pathName, isChild);
    }

    back() {
        this.history.back();
    }

    next() {
        this.history.forward();
    }

    getRoute(pathName: string, isChild: boolean = false) {
        const route = this.routes.find((r) => r.match(pathName, isChild));
        if (!route) {
            return this.routes.find((r) => r.match('*', isChild)) as IRoute;
        }
        return route;
    }
}
