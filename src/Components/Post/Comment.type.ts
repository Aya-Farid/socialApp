
export interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface commentType {
  _id: string;
  content: string;
  image?: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment: string | null;
  likes: string[];
  createdAt: string;
}
