import { BaseAPI } from "../../api/base-api";

class AuthAPI extends BaseAPI {
  constructor(){
    super('/auth');
  }

  public async signIn(data: {}): Promise<any> {
    return await this.post('/signin', { data });
  }

  public async signUp(data: {}): Promise<any> {
    return await this.post('/signup', { data });
  }

  public async logout(): Promise<any> {
    return await this.post('/logout');
  }

  public async getUser(): Promise<any> {
    return await this.get('/user')
  }
}

export default new AuthAPI();
