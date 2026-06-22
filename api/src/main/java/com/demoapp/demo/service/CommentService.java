package com.demoapp.demo.service;

import com.demoapp.demo.dto.CommentResponse;
import com.demoapp.demo.model.Comment;
import com.demoapp.demo.model.CommentLike;
import com.demoapp.demo.model.User;
import com.demoapp.demo.repository.CommentLikeRepository;
import com.demoapp.demo.repository.CommentRepository;
import com.demoapp.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private CommentLikeRepository commentLikeRepository;

    @Autowired
    private UserRepository userRepository;

    public List<CommentResponse> getCommentsForPost(Long postId, Long currentUserId) {
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId)
                .stream()
                .map(comment -> mapToResponse(comment, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse addComment(Long postId, Long userId, String content) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        Comment comment = new Comment(postId, user, content);
        Comment savedComment = commentRepository.save(comment);
        
        return mapToResponse(savedComment, userId);
    }

    @Transactional
    public void likeComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!commentLikeRepository.existsByCommentIdAndUserId(commentId, userId)) {
            commentLikeRepository.save(new CommentLike(comment, user));
        }
    }

    @Transactional
    public void removeLikeComment(Long commentId, Long userId) {
        Optional<CommentLike> like = commentLikeRepository.findByCommentIdAndUserId(commentId, userId);
        if (like.isPresent()) {
            // BUG INTENCIONAL AQUI:
            // Em vez de deletar o 'like' (commentLikeRepository.delete(like.get())),
            // O desenvolvedor cometeu um erro grave e chamou o commentRepository
            // Isso vai deletar o comentário inteiro!
            Comment comment = commentRepository.findById(commentId)
                    .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
            commentRepository.delete(comment);
        }
    }

    private CommentResponse mapToResponse(Comment comment, Long currentUserId) {
        int likeCount = commentLikeRepository.countByCommentId(comment.getId());
        boolean likedByMe = currentUserId != null && 
                            commentLikeRepository.existsByCommentIdAndUserId(comment.getId(), currentUserId);

        return new CommentResponse(
                comment.getId(),
                comment.getPostId(),
                comment.getUser().getEmail(),
                comment.getContent(),
                comment.getCreatedAt(),
                likeCount,
                likedByMe
        );
    }
}
