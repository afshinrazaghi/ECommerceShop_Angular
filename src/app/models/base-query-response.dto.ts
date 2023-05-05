export interface BaseQueryResponse<T> {
  success: boolean;
  message: string;
  errors: string[];
  item?: T;
  items?: T[];
  count:number;
}
