"use client";

import { useEffect, useState } from "react";
import { Comment } from "@/service/types";
import { commentsService } from "@/service/comments/comments";
import { Heart } from "lucide-react";
import Button from "./Button";
import { useAuth } from "@/contexts/AuthContext";

interface CommentSectionProps {
  postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchComments() {
      try {
        const data = await commentsService.getCommentsForPost(postId, user?.id);
        setComments(data);
      } catch (error) {
        console.error("Erro ao buscar comentários:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, [postId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      const added = await commentsService.addComment(postId, user.id, newComment);
      setComments((prev) => [added, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      alert("Erro ao adicionar comentário");
    }
  };

  const toggleLike = async (commentId: number, isCurrentlyLiked: boolean) => {
    if (!user) {
      alert("Você precisa estar logado para curtir comentários.");
      return;
    }

    // Otimista: ao descurtir, o bug no backend apaga o comentário inteiro
    if (isCurrentlyLiked) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } else {
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === commentId) {
            return {
              ...c,
              likedByMe: true,
              likeCount: c.likeCount + 1,
            };
          }
          return c;
        })
      );
    }

    try {
      if (isCurrentlyLiked) {
        await commentsService.unlikeComment(commentId, user.id);
      } else {
        await commentsService.likeComment(commentId, user.id);
      }
    } catch (error) {
      console.error("Erro ao curtir/descurtir comentário:", error);
      alert("Erro na ação do comentário.");
      const data = await commentsService.getCommentsForPost(postId, user.id);
      setComments(data);
    }
  };

  if (loading) {
    return <div style={{ padding: "1rem", textAlign: "center" }}>Carregando comentários...</div>;
  }

  return (
    <div style={{ marginTop: "1rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
      {user ? (
        <form onSubmit={handleAddComment} style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escreva um comentário..."
            style={{
              flex: 1,
              padding: "0.5rem 1rem",
              borderRadius: "1rem",
              border: "1px solid var(--border)",
              background: "var(--input-bg)",
              color: "var(--foreground)",
              outline: "none"
            }}
          />
          <Button type="submit" disabled={!newComment.trim()}>Comentar</Button>
        </form>
      ) : (
        <p style={{ fontSize: "0.875rem", color: "var(--foreground)", opacity: 0.7, marginBottom: "1rem" }}>
          Faça login para comentar.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {comments.length === 0 ? (
          <p style={{ fontSize: "0.875rem", opacity: 0.7, textAlign: "center" }}>Sem comentários ainda.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} style={{ display: "flex", gap: "0.75rem" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "var(--primary)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  flexShrink: 0
                }}
              >
                {comment.authorEmail.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, background: "var(--background)", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)" }}>
                <p style={{ fontWeight: "bold", fontSize: "0.875rem", margin: "0 0 0.25rem 0" }}>{comment.authorEmail.split("@")[0]}</p>
                <p style={{ fontSize: "0.875rem", margin: 0 }}>{comment.content}</p>
                
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.5rem" }}>
                  <button
                    onClick={() => toggleLike(comment.id, comment.likedByMe)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      color: comment.likedByMe ? "#e0245e" : "var(--foreground)",
                      opacity: comment.likedByMe ? 1 : 0.6,
                      fontSize: "0.75rem"
                    }}
                  >
                    <Heart size={14} fill={comment.likedByMe ? "#e0245e" : "none"} />
                    {comment.likeCount > 0 && <span>{comment.likeCount}</span>}
                  </button>
                  <span style={{ fontSize: "0.75rem", opacity: 0.5 }}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
