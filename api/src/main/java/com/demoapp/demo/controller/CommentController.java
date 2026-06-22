package com.demoapp.demo.controller;

import com.demoapp.demo.dto.CommentResponse;
import com.demoapp.demo.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/posts")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(
            @PathVariable Long postId,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(commentService.getCommentsForPost(postId, userId));
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long postId,
            @RequestBody Map<String, String> payload,
            @RequestParam Long userId) {
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        String content = payload.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        CommentResponse comment = commentService.addComment(postId, userId, content);
        return ResponseEntity.ok(comment);
    }

    @PostMapping("/comments/{commentId}/like")
    public ResponseEntity<Void> likeComment(
            @PathVariable Long commentId,
            @RequestParam Long userId) {
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        commentService.likeComment(commentId, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/comments/{commentId}/like")
    public ResponseEntity<Void> unlikeComment(
            @PathVariable Long commentId,
            @RequestParam Long userId) {
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        commentService.removeLikeComment(commentId, userId);
        return ResponseEntity.ok().build();
    }
}
