export interface User {
  id: number;
  email: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  id: number;
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  liked: boolean;
  reactionType?: "like" | "dislike";
}

export interface Comment {
  id: number;
  postId: number;
  authorEmail: string;
  content: string;
  createdAt: string;
  likeCount: number;
  likedByMe: boolean;
}

export interface AuthResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

export interface LikedPostsResponse {
  posts: Post[];
  total: number;
  limit: number;
}