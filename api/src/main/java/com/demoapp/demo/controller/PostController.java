package com.demoapp.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.demoapp.demo.dto.ErrorResponse;
import com.demoapp.demo.service.PostService;

import java.util.Map;

/**
 * Controller de Posts — expõe endpoints para listagem e reações (like/dislike).
 *
 * Atividade 6 — Nova Feature: Likes/Dislikes
 * Novo endpoint: POST /posts/{postId}/dislike
 */
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/posts")
public class PostController {

  private final PostService postService;

  public PostController(PostService postService) {
    this.postService = postService;
  }

  @GetMapping
  public ResponseEntity<?> getPosts(
      @RequestParam(required = false) Integer limit,
      @RequestParam(required = false) Integer skip,
      @RequestParam(required = false) Long userId) {
    
    try {
      Map<String, Object> posts = postService.getPosts(limit, skip, userId);
      return ResponseEntity.ok(posts);
    } catch (Exception e) {
      return ResponseEntity
          .status(500)
          .body(new ErrorResponse("Erro ao buscar posts: " + e.getMessage(), 500));
    }
  }

  @GetMapping("/liked")
  public ResponseEntity<?> getLikedPosts(
      @RequestParam Long userId,
      @RequestParam(required = false) Integer limit,
      @RequestParam(required = false) Integer skip) {
    
    try {
      if (userId == null) {
        return ResponseEntity
            .status(400)
            .body(new ErrorResponse("userId é obrigatório", 400));
      }

      Map<String, Object> posts = postService.getLikedPosts(userId, limit, skip);
      return ResponseEntity.ok(posts);
    } catch (Exception e) {
      return ResponseEntity
          .status(500)
          .body(new ErrorResponse("Erro ao buscar posts curtidos: " + e.getMessage(), 500));
    }
  }

  /**
   * Alterna o like de um post.
   * Se o post já tiver dislike, o dislike é removido automaticamente.
   */
  @PostMapping("/{postId}/like")
  public ResponseEntity<?> toggleLike(
      @PathVariable Long postId,
      @RequestParam Long userId) {
    
    try {
      if (userId == null) {
        return ResponseEntity
            .status(400)
            .body(new ErrorResponse("userId é obrigatório", 400));
      }

      Map<String, Object> result = postService.toggleLike(postId, userId);
      return ResponseEntity.ok(result);
    } catch (Exception e) {
      return ResponseEntity
          .status(500)
          .body(new ErrorResponse("Erro ao curtir post: " + e.getMessage(), 500));
    }
  }

  /**
   * Alterna o dislike de um post.
   * Nova feature — Atividade 6.
   * Se o post já tiver like, o like é removido automaticamente.
   *
   * @param postId ID do post (path variable)
   * @param userId ID do usuário (query param)
   */
  @PostMapping("/{postId}/dislike")
  public ResponseEntity<?> toggleDislike(
      @PathVariable Long postId,
      @RequestParam Long userId) {
    
    try {
      if (userId == null) {
        return ResponseEntity
            .status(400)
            .body(new ErrorResponse("userId é obrigatório", 400));
      }

      Map<String, Object> result = postService.toggleDislike(postId, userId);
      return ResponseEntity.ok(result);
    } catch (Exception e) {
      return ResponseEntity
          .status(500)
          .body(new ErrorResponse("Erro ao dar dislike no post: " + e.getMessage(), 500));
    }
  }

}
