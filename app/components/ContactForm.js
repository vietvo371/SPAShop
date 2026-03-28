"use client";

export default function ContactForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Cảm ơn bạn đã gửi tin nhắn! Chúng tôi sẽ liên hệ lại sớm nhất.");
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Họ và Tên *</label>
        <input type="text" id="name" name="name" placeholder="Nhập họ và tên..." required />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Số Điện Thoại *</label>
        <input type="tel" id="phone" name="phone" placeholder="Nhập số điện thoại..." required />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" placeholder="Nhập email..." />
      </div>
      <div className="form-group">
        <label htmlFor="message">Nội Dung *</label>
        <textarea id="message" name="message" placeholder="Nhập nội dung tin nhắn..." required />
      </div>
      <button type="submit" className="submit-btn">
        Gửi Tin Nhắn
      </button>
    </form>
  );
}
