export class UserDto{
  id: number;
  userName: string;
  email: string;
  accessToken: string;
  refreshToken:string;
  fullName?:string;
  isAdmin:boolean;
}
