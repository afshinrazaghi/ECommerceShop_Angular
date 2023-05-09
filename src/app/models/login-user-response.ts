export interface LoginUserResponse{
  id:string;
  email:string;
  firstName?:string;
  lastName?:string;
  shippingAddress?:string;
  accessToken:string;
  refreshToken:string;
}
