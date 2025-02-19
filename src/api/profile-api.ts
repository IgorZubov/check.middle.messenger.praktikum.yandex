import { BaseAPI } from "./base-api.ts";
import { ChangePasswordRequest, profileRequest } from "@/types/Profile/Profile.dto.ts";

export class ProfileAPI extends BaseAPI {
  constructor() {
    super("/user");
  }

  changeProfile(data: profileRequest) {
    return this.http.put("/profile", { data });
  }

  changeAvatar(data: FormData) {
    return this.http.put("/profile/avatar", { data });
  }

  changePassword(data: ChangePasswordRequest) {
    return this.http.put("/password", { data });
  }
}

export default new ProfileAPI();
