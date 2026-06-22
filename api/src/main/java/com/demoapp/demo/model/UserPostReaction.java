package com.demoapp.demo.model;

import jakarta.persistence.*;
import jakarta.persistence.Table;

/**
 * Representa uma reação de um usuário a um post.
 * O campo reactionType pode ser "like" ou "dislike".
 *
 * Atividade 6 — Nova Feature: Likes/Dislikes
 */
@Entity
@Table(name = "user_post_reaction")
public class UserPostReaction {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Long userId;
  private Long postId;

  /** "like" ou "dislike" — padrão "like" para compatibilidade retroativa */
  private String reactionType = "like";

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public Long getPostId() {
    return postId;
  }

  public void setPostId(Long postId) {
    this.postId = postId;
  }

  public String getReactionType() {
    return reactionType;
  }

  public void setReactionType(String reactionType) {
    this.reactionType = reactionType;
  }

}

