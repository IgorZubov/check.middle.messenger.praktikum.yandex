export interface MessageModel {
  chat_id: number;
  content: string;
  file?: {
    content_size: number;
    content_type: string;
    filename: string;
    id: number;
    path: string;
    upload_date: string;
    user_id: number;
  };
  time: string;
  type: string;
  user_id: string;
}
