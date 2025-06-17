import { User } from "./user";

export interface UserLoginResponse {
    status: string;
    data:   UserData;
  }
  
  export interface UserData {
    user:  User;
    token: string;
    message?: string;
  }
