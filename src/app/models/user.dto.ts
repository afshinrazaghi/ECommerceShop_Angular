export class UserDto{
  id: string;
  userName: string;
  email: string;
  accessToken: string;
  refreshToken:string;
  fullName?:string;
  isAdmin:boolean;
}
