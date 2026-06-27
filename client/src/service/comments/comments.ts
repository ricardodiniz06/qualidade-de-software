import api from "@/service/api";
import { Comment } from "../types";

export const commentsService = {
  getCommentsForPost: async (postId: number, userId?: number): Promise<Comment[]> => {
    const url = userId ? `/posts/${postId}/comments?userId=${userId}` : `/posts/${postId}/comments`;
    const { data } = await api.get<Comment[]>(url);
    return data;
  },

  addComment: async (postId: number, userId: number, content: string): Promise<Comment> => {
    const { data } = await api.post<Comment>(`/posts/${postId}/comments?userId=${userId}`, { content });
    return data;
  },

  likeComment: async (commentId: number, userId: number): Promise<void> => {
    await api.post(`/posts/comments/${commentId}/like?userId=${userId}`);
  },

  unlikeComment: async (commentId: number, userId: number): Promise<void> => {
    await api.delete(`/posts/comments/${commentId}/like?userId=${userId}`);
  },
};
