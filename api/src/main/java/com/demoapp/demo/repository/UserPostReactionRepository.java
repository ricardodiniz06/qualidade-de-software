package com.demoapp.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.demoapp.demo.model.UserPostReaction;
import java.util.List;
import java.util.Optional;

/**
 * Repositório de reações de usuário (likes e dislikes).
 * Atividade 6 — Nova Feature: Likes/Dislikes
 */
public interface UserPostReactionRepository extends JpaRepository<UserPostReaction, Long> {
  Optional<UserPostReaction> findByUserIdAndPostId(Long userId, Long postId);
  Optional<UserPostReaction> findByUserIdAndPostIdAndReactionType(Long userId, Long postId, String reactionType);
  List<UserPostReaction> findByUserId(Long userId);
  List<UserPostReaction> findByUserIdAndReactionType(Long userId, String reactionType);
}

