package com.demoapp.demo.dto;

import java.time.LocalDateTime;

public class CommentResponse {
    private Long id;
    private Long postId;
    private String authorEmail;
    private String content;
    private LocalDateTime createdAt;
    private int likeCount;
    private boolean likedByMe;

    public CommentResponse() {
    }

    public CommentResponse(Long id, Long postId, String authorEmail, String content, LocalDateTime createdAt, int likeCount, boolean likedByMe) {
        this.id = id;
        this.postId = postId;
        this.authorEmail = authorEmail;
        this.content = content;
        this.createdAt = createdAt;
        this.likeCount = likeCount;
        this.likedByMe = likedByMe;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }

    public String getAuthorEmail() { return authorEmail; }
    public void setAuthorEmail(String authorEmail) { this.authorEmail = authorEmail; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public int getLikeCount() { return likeCount; }
    public void setLikeCount(int likeCount) { this.likeCount = likeCount; }

    public boolean isLikedByMe() { return likedByMe; }
    public void setLikedByMe(boolean likedByMe) { this.likedByMe = likedByMe; }
}
