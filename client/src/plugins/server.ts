import type { App } from 'vue'
import axios from "axios";
import type { Axios } from 'axios';
import type { LoggedUserDto } from '@/server';
import { ComponentActionsEnum, ComponentsEnum } from './acl';

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $server: Server;
    }
}

export interface ServerOptions {
    baseUrl: string
}

export class Server {

    readonly Components = ComponentsEnum;
    readonly Actions = ComponentActionsEnum;

    static readonly TOKEN_STORE_KEY = "authToken";
    static readonly LOGGED_USER_STORE_KEY = "loggedUser";

    constructor(public http: Axios) { }

    public async login(login: string, password: string): Promise<void> {

        let response = await this.http.post<any>('/auth/login', { username: login, password: password });

        let token = response.data.token;

        localStorage.setItem(Server.TOKEN_STORE_KEY, token);
        localStorage.setItem(Server.LOGGED_USER_STORE_KEY, JSON.stringify(response.data));

        this.http.interceptors.request.use(config => {
            config.headers = { Authorization: `Bearer ${token}` };
            return config;
        });
    }

    public logout(): void {

        localStorage.removeItem(Server.TOKEN_STORE_KEY);
        localStorage.removeItem(Server.LOGGED_USER_STORE_KEY);

        this.http.interceptors.request.use(config => {
            config.headers = { Authorization: `Bearer ''` };
            return config;
        });
    }

    public getLoggedUser(): LoggedUserDto {
        let userJson = localStorage.getItem(Server.LOGGED_USER_STORE_KEY) ?? '{}';
        return JSON.parse(userJson);
    }

    public getLoggedUserId(): Number {
        let user = this.getLoggedUser();
        return user.userId;
    }

    public loggedUserHasAccess(component: ComponentsEnum, action: ComponentActionsEnum): boolean {

        let loggedUser = this.getLoggedUser();

        if (!loggedUser.acl)
            return false;

        let hasComponent = loggedUser.acl[component];

        if (!hasComponent)
            return false;

        if (!hasComponent.includes(action))
            return false;

        return true;
    }
}

export default {

    install(app: App, options: ServerOptions) {

        let token = localStorage.getItem(Server.TOKEN_STORE_KEY);
        app.config.globalProperties.$server = new Server(
            axios.create({
                baseURL: options.baseUrl,
                headers: { Authorization: `Bearer ${token}` }
            }));
    }

}