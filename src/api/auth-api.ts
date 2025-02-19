import { BaseAPI } from "./base-api.ts";
import { AuthSignInRequest, AuthSignupRequest } from "@/types/index.ts";

class AuthAPI extends BaseAPI {
  constructor() {
    super("/auth");
  }

  signup(data: AuthSignupRequest) {
    return this.http.post("/signup", { data });
  }

  signin(data: AuthSignInRequest) {
    return this.http.post("/signin", { data });
  }

  getUser() {
    return this.http.get("/user");
  }

  logout() {
    return this.http.post("/logout");
  }
}

export default new AuthAPI();
