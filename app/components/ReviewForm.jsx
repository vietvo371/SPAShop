"use client";

import { useState } from "react";
import styles from "./ReviewForm.module.css";

export default function ReviewForm({ serviceId, productId, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    rating: 5,
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Vui lòng nhập họ tên");
      return;
    }
    if (!formData.content.trim() || formData.content.length < 10) {
      setError("Vui lòng nhập nội dung đánh giá (ít nhất 10 ký tự)");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          serviceId,
          productId,
        }),
      });

      if (response.ok) {
        setFormData({ name: "", phone: "", rating: 5, content: "" });
        if (onSuccess) onSuccess();
        alert("Cảm ơn bạn đã đánh giá! Đánh giá sẽ được hiển thị sau khi duyệt.");
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch {
      setError("Không thể kết nối server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.reviewForm}>
      <h3 className={styles.formTitle}>Gửi đánh giá của bạn</h3>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.formGroup}>
        <label>Họ tên *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nhập họ tên của bạn"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Số điện thoại</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="0xxx xxx xxx"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Đánh giá</label>
        <div className={styles.ratingStars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`${styles.starBtn} ${formData.rating >= star ? styles.active : ""}`}
              onClick={() => setFormData({ ...formData, rating: star })}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>Nội dung đánh giá *</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Chia sẻ trải nghiệm của bạn..."
          rows={4}
          required
        />
      </div>

      <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
        {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
      </button>
    </form>
  );
}

export function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className={styles.noReviews}>
        <p>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
      </div>
    );
  }

  return (
    <div className={styles.reviewList}>
      {reviews.map((review) => (
        <div key={review.id} className={styles.reviewItem}>
          <div className={styles.reviewHeader}>
            <div className={styles.reviewerInfo}>
              <span className={styles.reviewerName}>{review.name}</span>
              <span className={styles.reviewDate}>
                {new Date(review.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className={styles.rating}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < review.rating ? styles.starFilled : styles.starEmpty}>
                  ★
                </span>
              ))}
            </div>
          </div>
          <p className={styles.reviewContent}>{review.content}</p>
        </div>
      ))}
    </div>
  );
}