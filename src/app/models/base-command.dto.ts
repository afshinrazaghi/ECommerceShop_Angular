export interface BaseCommandResponse {
  id: number;
  message: string;
  errors: string[];
  success: boolean;
  action?: string;
}

export interface BaseCommandResponse2<T> extends BaseCommandResponse {
  item?: T;
}
