export interface UserResponse{
  id:string;
  firstName:string;
  lastName:string;
  email:string;
  isAdmin:boolean;
  createAt:Date;
  accessToken?:string;
  refreshToken?:string;
}
